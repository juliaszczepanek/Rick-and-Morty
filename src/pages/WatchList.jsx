import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import Button from "@mui/material/Button";
import FormModal from "../form/FormModal";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default function WatchList({ isMenuOpen }) {
  const { currentUser } = useAuth();
  const [watchLists, setWatchLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);

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
      setWatchLists(updatedWatchlists);
    } catch (err) {
      console.error("Error updating watchlists", err);
    }
  };

  const fetchWatchLists = async () => {
    const data = await getUserWatchlists();
    setWatchLists(data);
  };

  const deleteWatchlist = async (watchlistName) => {
    const updatedWatchLists = await getUserWatchlists();

    const filteredWatchlists = updatedWatchLists.filter(
      (list) => list.name !== watchlistName
    );

    await updateUserWatchlists(filteredWatchlists);
  };

  useEffect(() => {
    fetchWatchLists();
  }, [currentUser]);

  const openModal = (watchlist) => {
    setSelectedWatchlist(watchlist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedWatchlist(null);
    setIsModalOpen(false);
  };

  const removeEpisodeFromFirestore = async (watchlistName, episodeId) => {
    const updatedWatchLists = await getUserWatchlists();

    const updatedLists = updatedWatchLists.map((list) => {
      if (list.name === watchlistName) {
        return {
          ...list,
          episodes: list.episodes.filter((ep) => ep.id !== episodeId),
        };
      }
      return list;
    });

    await updateUserWatchlists(updatedLists);
  };

  const toggleWatched = async (watchlistName, episodeId) => {
    const updatedWatchLists = await getUserWatchlists();

    const updatedLists = updatedWatchLists.map((list) => {
      if (list.name === watchlistName) {
        const updatedEpisodes = list.episodes.map((ep) => {
          if (ep.id === episodeId) {
            return { ...ep, watched: !ep.watched };
          }
          return ep;
        });
        return { ...list, episodes: updatedEpisodes };
      }
      return list;
    });

    await updateUserWatchlists(updatedLists);
  };

  return (
    <div className="watch-list section--style">
      {watchLists.length > 0 ? (
        watchLists.map((watchlist, index) => (
          <div key={index} className="watch-list__container">
            <div className="watch-list__header-box">
              <h2 className="watch-list__name table__caption typo--caption">
                {watchlist.name}
              </h2>
              <div
                className={`watch-list__buttons ${isMenuOpen ? "hidden" : ""}`}
              >
                <Button
                  variant="outlined"
                  className="btn btn--share"
                  onClick={() => openModal(watchlist)}
                  sx={{
                    p: "0.7rem 1.5rem",
                    border: "1.2px solid white",
                    color: "white",
                    fontFamily: "Allerta",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Share &nbsp;
                  <ReplyIcon
                    fontSize="md"
                    sx={{
                      transform: "rotateY(180deg)",
                    }}
                  />
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  className="btn btn-delete"
                  onClick={() => deleteWatchlist(watchlist.name)}
                  sx={{
                    p: "0.7rem 2rem",
                    border: "1.2px solid red",
                    fontFamily: "Allerta",
                    "&:hover": {
                      backgroundColor: "rgba(255, 0, 0, 0.1)",
                      borderColor: "red",
                    },
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>

            {watchlist.episodes.length > 0 ? (
              <div className="table__container">
                <table className="table">
                  <thead className="watch-list__header">
                    <tr>
                      <th className="table__header-cell typo--header-cell watch-list__id">
                        ID
                      </th>
                      <th className="table__header-cell typo--header-cell">
                        Name
                      </th>
                      <th className="table__header-cell typo--header-cell watch-list__episode">
                        Episode
                      </th>
                      <th className="table__header-cell typo--header-cell watch-list__watched">
                        Watched
                      </th>
                      <th className="table__header-cell typo--header-cell watch-list__remove">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchlist.episodes.map((episode) => (
                      <tr key={episode.id}>
                        <td className="table__cell watch-list__id">
                          {episode.id}
                        </td>
                        <td className="table__cell">{episode.name}</td>
                        <td className="table__cell watch-list__episode">
                          {episode.episode}
                        </td>
                        <td className="table__cell watch-list__watched">
                          <IconButton
                            className={`${isMenuOpen ? "hidden" : ""}`}
                            onClick={() =>
                              toggleWatched(watchlist.name, episode.id)
                            }
                            sx={{
                              color: episode.watched ? "#13acc9" : "white",
                              "&:hover": {
                                color: episode.watched ? "red" : "#13acc9",
                              },
                            }}
                          >
                            {episode.watched ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </td>
                        <td className="table__cell watch-list__remove">
                          <IconButton
                            className={`${isMenuOpen ? "hidden" : ""}`}
                            onClick={() =>
                              removeEpisodeFromFirestore(
                                watchlist.name,
                                episode.id
                              )
                            }
                            sx={{
                              color: "red",
                              "&:hover": { color: "darkred" },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="watch-list__empty">
                No episodes in this watchlist.
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="watch-list__empty-message">No watchlists available.</p>
      )}
      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentUser={currentUser}
        watchlist={selectedWatchlist}
      />
    </div>
  );
}
