import { fetchEpisodes } from "../api/rickAndMortyApi";
import { Pagination, SearchBar } from "./../UI";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { Spinner } from "@nextui-org/spinner";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { IconButton } from "@mui/material";

const getCharacterIdsFromEpisodes = (episodes) => {
  const allUrls = episodes.flatMap((episode) => episode.characters);
  return [...new Set(allUrls.map((url) => url.split("/").pop()))];
};

const fetchCharactersByIds = async (characterIds) => {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${characterIds.join(",")}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching characters", error);
    return [];
  }
};

export default function Episodes({ isMenuOpen }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [loading, setLoading] = useState(true);
  const [episodes, setEpisodes] = useState([]);
  const [characterInfo, setCharacterInfo] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const queryFromUrl = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [watchList, setWatchList] = useState(
    JSON.parse(localStorage.getItem("watchList")) || []
  );

  const handleBookmarkClick = (episode) => {
    const isAlreadyBookmarked = watchList.some(
      (item) => item.id === episode.id
    );

    let updatedWatchList;

    if (isAlreadyBookmarked) {
      updatedWatchList = watchList.filter((item) => item.id !== episode.id);
    } else {
      updatedWatchList = [...watchList, { ...episode, watched: false }];
    }

    setWatchList(updatedWatchList);
    localStorage.setItem("watchList", JSON.stringify(updatedWatchList));
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
        const data = await fetchEpisodes(currentPage, searchQuery);
        setEpisodes(data.results);
        setTotalPages(data.info.pages);

        const characterIds = getCharacterIdsFromEpisodes(data.results);

        const characters = await fetchCharactersByIds(characterIds);
        setCharacterInfo(characters);
      } catch (error) {
        console.error("Error loading episodes and characters", error);
      }
      setLoading(false);
    };

    loadEpisodesAndCharacters();
  }, [currentPage, searchQuery]);

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

  const getCharacterNamesForEpisode = (episode) => {
    const episodeCharacterIds = episode.characters.map((url) =>
      url.split("/").pop()
    );
    return characterInfo
      .filter((character) =>
        episodeCharacterIds.includes(character.id.toString())
      )
      .map((character) => character.name)
      .join(", ");
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
                  <th className="table__header-cell typo--header-cell">
                    Watch List
                  </th>
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
                      <td className="table__cell  episodes__cell--bookmark">
                        <IconButton
                          className={`episodes__bookmark ${
                            isMenuOpen ? "hidden" : ""
                          }`}
                          onClick={() => handleBookmarkClick(episode)}
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
