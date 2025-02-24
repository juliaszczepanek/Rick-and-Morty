import React, { useEffect, useState } from "react";
import { fetchCharacters } from "../api/rickAndMortyApi";
import { Pagination, CharacterModal } from "./../UI";
import { useSearchParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Spinner } from "@nextui-org/spinner";
import Button from "@mui/material/Button";

export default function Characters({ isMenuOpen }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [species, setSpecies] = useState(searchParams.get("species") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");

  const speciesOptions = [
    { value: "", label: "All Species" },
    { value: "Human", label: "Human" },
    { value: "Alien", label: "Alien" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Alive", label: "Alive" },
    { value: "Dead", label: "Dead" },
    { value: "unknown", label: "Unknown" },
  ];

  const genderOptions = [
    { value: "", label: "All Genders" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "unknown", label: "Unknown" },
  ];

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    const speciesParam = searchParams.get("species") || "";
    const statusParam = searchParams.get("status") || "";
    const genderParam = searchParams.get("gender") || "";

    setSpecies(speciesParam);
    setStatus(statusParam);
    setGender(genderParam);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchCharacters(currentPage, species, status, gender)
      .then((data) => {
        setCharacters(data.results);
        setTotalPages(data.info.pages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching characters:", error);
        setLoading(false);
      });
  }, [currentPage, species, status, gender]);

  const handleOpen = (character) => {
    setSelectedCharacter(character);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCharacter(null);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);

      const newParams = new URLSearchParams();

      newParams.set("page", newPage);

      if (species) newParams.set("species", species);
      if (status) newParams.set("status", status);
      if (gender) newParams.set("gender", gender);

      setSearchParams(newParams);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);

      const newParams = new URLSearchParams();

      newParams.set("page", newPage);

      if (species) newParams.set("species", species);
      if (status) newParams.set("status", status);
      if (gender) newParams.set("gender", gender);

      setSearchParams(newParams);
    }
  };

  const updateFilters = (filterName, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }

    ["species", "status", "gender"].forEach((filter) => {
      if (!newParams.get(filter)) {
        newParams.delete(filter);
      }
    });

    newParams.set("page", 1);
    setCurrentPage(1);
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSpecies("");
    setStatus("");
    setGender("");
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="characters__content">
      <div className={`characters__filters ${isMenuOpen ? "hidden" : ""}`}>
        <Select
          value={species}
          onChange={(e) => {
            setSpecies(e.target.value);
            updateFilters("species", e.target.value);
          }}
          displayEmpty
          className="characters__filter"
          sx={{
            color: "#fff",
            fontSize: "12px",
            border: "0.5px solid #fff",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            "& .MuiSvgIcon-root": {
              color: "#fff",
            },
            backgroundColor: "#000000",
          }}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          {speciesOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            updateFilters("status", e.target.value);
          }}
          displayEmpty
          className="characters__filter"
          sx={{
            color: "#fff",
            fontSize: "12px",
            border: "1px solid #fff",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            "& .MuiSvgIcon-root": {
              color: "#fff",
            },
            backgroundColor: "#000000",
          }}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            updateFilters("gender", e.target.value);
          }}
          displayEmpty
          className="characters__filter"
          sx={{
            color: "#fff",
            fontSize: "12px",
            border: "1px solid #fff",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            "& .MuiSvgIcon-root": {
              color: "#fff",
            },
            backgroundColor: "#000000",
          }}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          {genderOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="outlined"
          color="error"
          className="characters__filter"
          onClick={resetFilters}
        >
          Clear
        </Button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <Spinner
            label="Default"
            color="default"
            size="lg"
            labelColor="foreground"
          />
        </div>
      ) : (
        <>
          <div className="characters__list">
            {characters.map((character) => (
              <div
                className="character__card"
                key={character.id}
                onClick={() => handleOpen(character)}
              >
                <h3 className="character__name">{character.name}</h3>
                <img
                  src={character.image}
                  alt={character.name}
                  className="character__img"
                />
                <div className="character__info">
                  <p className="character__type typo--card">
                    <span
                      className="character__status"
                      style={{
                        backgroundColor:
                          character.status === "Alive"
                            ? "$color-highlight"
                            : character.status === "Dead"
                            ? "red"
                            : "gray",
                      }}
                    ></span>
                    {character.status} - {character.species}
                  </p>

                  <p className="character__origin typo--card">
                    Origin: {character.origin.name}
                  </p>
                </div>
              </div>
            ))}

            <CharacterModal
              open={open}
              handleClose={handleClose}
              character={selectedCharacter}
            />
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
