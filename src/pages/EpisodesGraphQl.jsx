import { fetchEpisodesGraphQl } from "../api/rickAndMortyApi";
import { Pagination, SearchBar } from "./../UI";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { Spinner } from "@nextui-org/spinner";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { IconButton } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
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
  const [watchList, setWatchList] = useState([]);

  const isLoggedIn = !!currentUser;

  const createUserDocIfNotExists = async () => {
    if (!currentUser) return;
    const userId = currentUser.uid;
    const userDocRef = doc(db, "watchlists", userId);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, { episodes: [] });
    }
  };

  useEffect(() => {
    createUserDocIfNotExists();
  }, [currentUser]);

  const addEpisodeToFirestore = async (episode) => {
    if (!currentUser) {
      return;
    }

    const userId = currentUser.uid;
    const userDocRef = doc(db, "watchlists", userId);

    try {
      await updateDoc(userDocRef, {
        episodes: arrayUnion({ ...episode, watched: false }),
      });
    } catch (err) {
      console.error("Cannot save episode to Firebase", err);
    }
  };

  const getCharacterNamesForEpisode = (episode) => {
    return episode.characters.map((character) => character.name).join(", ");
  };

  const onBookmarkClick = (episode) => {
    const isAlreadyBookmarked = watchList.some(
      (item) => item.id === episode.id
    );
    let updatedWatchList;

    if (isAlreadyBookmarked) {
      updatedWatchList = watchList.filter((item) => item.id !== episode.id);
    } else {
      updatedWatchList = [...watchList, { ...episode, watched: false }];
      addEpisodeToFirestore(episode);
    }

    setWatchList(updatedWatchList);
  };

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

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

  useEffect(() => {
    const getDataFromFirebase = async () => {
      if (!currentUser) {
        return;
      }

      const userId = currentUser.uid;
      const userDocRef = doc(db, "watchlists", userId);

      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedEpisodes = data.episodes || [];
          setWatchList(fetchedEpisodes);
        }
      } catch (err) {
        console.error("Error fetching watchlist: ", err);
      }
    };

    getDataFromFirebase();
  }, [currentUser]);

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
          {" "}
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
                {episodes.map((episode) => {
                  const isBookmarked = watchList.some(
                    (item) => item.id === episode.id
                  );
                  return (
                    <tr className="table__row" key={episode.id}>
                      <td className="table__cell">{episode.episode}</td>
                      <td className="table__cell">{episode.name}</td>
                      <td className="table__cell">{episode.air_date}</td>
                      <td className="table__cell table__hidden-cell">
                        {getCharacterNamesForEpisode(episode)}
                      </td>
                      <td className="table__cell episodes__cell--bookmark">
                        {isLoggedIn && (
                          <IconButton
                            className={`episodes__bookmark ${
                              isMenuOpen ? "hidden" : ""
                            }`}
                            onClick={() => onBookmarkClick(episode)}
                            sx={{
                              color: "white",
                              minWidth: 0,
                              padding: "8px",
                              margin: "0 10px",
                              backgroundColor: "transparent",
                            }}
                          >
                            {isBookmarked ? (
                              <BookmarkIcon />
                            ) : (
                              <BookmarkBorderIcon />
                            )}
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
    </div>
  );
}
