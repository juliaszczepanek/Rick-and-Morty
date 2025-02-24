import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import FormModal from "../form/FormModal";
import { db } from ".././firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  doc,
  updateDoc,
  onSnapshot,
  getDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

export default function WatchList({ isMenuOpen }) {
  const { currentUser } = useAuth();
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const userId = currentUser.uid;
    const userDocRef = doc(db, "watchlists", userId);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const episodes = docSnap.data().episodes || [];
        const sortedEpisodes = episodes.sort((a, b) => a.id - b.id);
        setWatchList(sortedEpisodes);
      } else {
        console.log("Can't find data.");
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getDataFromFirebase = async () => {
    if (!currentUser) {
      return;
    }

    const userId = currentUser.uid;
    const docRef = doc(db, "watchlists", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const episodes = docSnap.data().episodes || [];
      const sortedEpisodes = Object.values(episodes).sort(
        (a, b) => a.id - b.id
      );
      setWatchList(sortedEpisodes);
    } else {
      console.log("Can't find data.");
    }
  };

  const removeEpisodeFromFirestore = async (episode) => {
    if (!currentUser) {
      return;
    }

    const userId = currentUser.uid;
    const userDocRef = doc(db, "watchlists", userId);

    try {
      await updateDoc(userDocRef, {
        episodes: arrayRemove(episode),
      });
    } catch (err) {
      console.error("Cannot remove episode from Firebase", err);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedWatchList = JSON.parse(localStorage.getItem("watchList"));
    if (storedWatchList) {
      const sortedWatchList = storedWatchList.sort((a, b) => a.id - b.id);

      setWatchList(sortedWatchList);
    }

    if (currentUser) {
      getDataFromFirebase();
    }
  }, [currentUser]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleWatched = (id) => {
    const updatedWatchList = watchList
      .map((episode) =>
        episode.id === id ? { ...episode, watched: !episode.watched } : episode
      )
      .sort((a, b) => a.id - b.id);

    setWatchList(updatedWatchList);
    localStorage.setItem("watchList", JSON.stringify(updatedWatchList));
  };

  return (
    <div className="watch-list section--style">
      <h1 className="table__caption typo--caption">
        Watch List{" "}
        <button className="btn btn--share" onClick={openModal}>
          Share &nbsp;
          <ReplyIcon
            fontSize="md"
            sx={{
              transform: "rotateY(180deg)",
            }}
          />
        </button>
      </h1>
      <div className="table__container">
        <table className="table">
          <thead className="watch-list__header">
            <tr className="tablet__row">
              <th className="table__header-cell typo--header-cell">ID</th>
              <th className="table__header-cell typo--header-cell">Name</th>
              <th className="table__header-cell typo--header-cell">Episode</th>
              <th className="table__header-cell typo--header-cell">Watched</th>
              <th className="table__header-cell typo--header-cell">Remove</th>
            </tr>
          </thead>
          <tbody className="watch-list__body">
            {watchList.map((episode) => (
              <tr className="table__row" key={episode.id}>
                <td className="table__cell">{episode.id}</td>
                <td className="table__cell">{episode.name}</td>
                <td className="table__cell">{episode.episode}</td>
                <td className="table__cell">
                  <IconButton
                    onClick={() => handleToggleWatched(episode.id)}
                    aria-label="delete"
                    className={`watch-list__button ${
                      isMenuOpen ? "hidden" : ""
                    }`}
                    sx={{
                      color: "white",
                      minWidth: 0,
                      padding: "8px",
                      margin: "0 10px",
                      backgroundColor: "transparent",
                      "&:hover": {
                        color: "#13acc9",
                      },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {episode.watched ? (
                      <VisibilityIcon
                        sx={{
                          color: "#13acc9",
                        }}
                      />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </td>
                <td className="table__cell table__cell--remove">
                  <IconButton
                    aria-label="delete"
                    onClick={() => removeEpisodeFromFirestore(episode)}
                    className={`watch-list__button ${
                      isMenuOpen ? "hidden" : ""
                    }`}
                    sx={{
                      color: "white",
                      minWidth: 0,
                      padding: "8px",
                      margin: "0 10px",
                      backgroundColor: "transparent",
                      "&:hover": {
                        color: "red",
                      },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {watchList.length === 0 && (
          <div className="watch-list__empty-message">
            No episodes in the watch list.
          </div>
        )}
      </div>
      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentUser={currentUser}
        watchList={watchList}
      />
    </div>
  );
}
