import { fetchEpisodesGraphQl } from "../api/rickAndMortyApi";
import { Pagination, SearchBar, WatchlistModal } from "./../UI";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { Spinner } from "@nextui-org/spinner";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from ".././firebase";

export default function EpisodesGraphQl({ isMenuOpen }) {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [loading, setLoading] = useState(true);
  const [episodes, setEpisodes] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const queryFromUrl = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [watchlists, setWatchlists] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoggedIn = !!currentUser;

  const createUserDocIfNotExists = async () => {
    if (!currentUser) return;
    const userId = currentUser.uid;
    const userDocRef = doc(db, "watchlists", userId);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, { watchlists: [] });
    }
  };

  const getUserWatchlists = async () => {
    if (!currentUser) return [];

    const userId = currentUser.uid;
    const userDocRef = doc(db, "watchlists", userId);

    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data().watchlists || [];
      } else {
        return [];
      }
    } catch (err) {
      console.error("Error fetching watchlists", err);
      return [];
    }
  };

  const updateUserWatchlists = async (updatedWatchlists) => {
    if (!currentUser) return;

    const userId = currentUser.uid;
    const userDocRef = doc(db, "watchlists", userId);

    try {
      await updateDoc(userDocRef, { watchlists: updatedWatchlists });
      setWatchlists(updatedWatchlists);
    } catch (err) {
      console.error("Error updating watchlists", err);
    }
  };

  useEffect(() => {
    createUserDocIfNotExists();
  }, [currentUser]);

  useEffect(() => {
    fetchWatchlists();
  }, [currentUser]);

  useEffect(() => {
    const loadEpisodesAndCharacters = async () => {
      setLoading(true);
      try {
        const data = await fetchEpisodesGraphQl(currentPage, searchQuery);
        setEpisodes(data.data.episodes.results);
        setTotalPages(data.data.episodes.info.pages);
      } catch (error) {
        console.error("Error loading episodes and characters", error);
      }
      setLoading(false);
    };

    loadEpisodesAndCharacters();
  }, [currentPage, searchQuery]);

  const fetchWatchlists = async () => {
    const data = await getUserWatchlists();
    setWatchlists(data);
  };

  const createWatchlistInFirestore = async (watchlistName) => {
    const updatedWatchlists = await getUserWatchlists();

    const watchlistExists = updatedWatchlists.some(
      (list) => list.name.toLowerCase() === watchlistName.toLowerCase()
    );

    if (!watchlistExists) {
      const newWatchlist = { name: watchlistName, episodes: [] };
      const newWatchlists = [...updatedWatchlists, newWatchlist];

      await updateUserWatchlists(newWatchlists);
    }
  };

  const onAddToMultipleWatchlists = async (selectedWatchlists) => {
    if (!currentUser || !selectedEpisode || selectedWatchlists.length === 0)
      return;

    const updatedWatchlists = await getUserWatchlists();

    const newWatchlists = updatedWatchlists.map((watchlist) => {
      if (selectedWatchlists.includes(watchlist.name)) {
        const episodeExists = watchlist.episodes.some(
          (ep) => ep.id === selectedEpisode.id
        );

        if (!episodeExists) {
          return {
            ...watchlist,
            episodes: [
              ...watchlist.episodes,
              { ...selectedEpisode, watched: false },
            ],
          };
        }
      }
      return watchlist;
    });

    await updateUserWatchlists(newWatchlists);
    setIsModalOpen(false);
  };

  const handleBookmarkClick = (episode) => {
    setSelectedEpisode(episode);
    setIsModalOpen(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    const params = { page: 1 };
    if (query) {
      params.query = query;
    }
    setSearchParams(params);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      const params = { page: newPage };
      if (searchQuery) {
        params.query = searchQuery;
      }
      setSearchParams(params);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      const params = { page: newPage };
      if (searchQuery) {
        params.query = searchQuery;
      }
      setSearchParams(params);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setCurrentPage(1);

    const newParams = {};
    newParams.page = 1;

    setSearchParams(newParams);
  };

  return (
    <div className="episodes section--style">
      {loading ? (
        <div className="loading-spinner">
          <Spinner color="white" size="xl" />
        </div>
      ) : (
        <>
          <div className={`episodes__search ${isMenuOpen ? "hidden" : ""}`}>
            <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
            <Button
              variant="outlined"
              color="error"
              className="episodes__clear"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
          <h1 className="table__caption typo--caption">Episodes</h1>
          <div className="table__container">
            <table className="table">
              <thead className="table__header">
                <tr className="table__row">
                  <th className="table__header-cell typo--header-cell">
                    Number
                  </th>
                  <th className="table__header-cell typo--header-cell">
                    Episode Name
                  </th>
                  <th className="table__header-cell typo--header-cell">
                    Air Date
                  </th>
                  <th className="table__header-cell typo--header-cell table__hidden-cell">
                    Characters
                  </th>
                  {isLoggedIn && (
                    <th className="table__header-cell typo--header-cell">
                      Watch List
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="episodes__body">
                {episodes.map((episode) => (
                  <tr className="table__row" key={episode.id}>
                    <td className="table__cell">{episode.episode}</td>
                    <td className="table__cell">{episode.name}</td>
                    <td className="table__cell">{episode.air_date}</td>
                    <td className="table__cell table__hidden-cell">
                      {episode.characters.map((c) => c.name).join(", ")}
                    </td>
                    <td
                      className={`table__cell episodes__cell--bookmark ${
                        isMenuOpen ? "hidden" : ""
                      }`}
                    >
                      {isLoggedIn && (
                        <IconButton
                          onClick={() => handleBookmarkClick(episode)}
                          sx={{
                            color: "white",
                            backgroundColor: "#13acc9",
                            "&:hover": { backgroundColor: "#0d7b91" },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />
        </>
      )}
      <WatchlistModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        existingWatchlists={watchlists.map((list) => list.name)}
        onCreateWatchlist={(name) => {
          createWatchlistInFirestore(name);
        }}
        onAddToWatchlist={(selectedWatchlists) => {
          onAddToMultipleWatchlists(selectedWatchlists);
        }}
      />
    </div>
  );
}
