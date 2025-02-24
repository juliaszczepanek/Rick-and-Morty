import { fetchLocations } from "../api/rickAndMortyApi";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination, SearchBar } from "./../UI";
import Button from "@mui/material/Button";
import { Spinner } from "@nextui-org/spinner";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function Locations({ isMenuOpen }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [name, setName] = useState(searchParams.get("name") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [dimension, setDimension] = useState(
    searchParams.get("dimension") || ""
  );
  const [selectedFilter, setSelectedFilter] = useState("name");

  const filterOptions = [
    { value: "name", label: "Name" },
    { value: "type", label: "Type" },
    { value: "dimension", label: "Dimension" },
  ];

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    const nameParam = searchParams.get("name") || "";
    const typeParam = searchParams.get("type") || "";
    const dimensionParam = searchParams.get("dimension") || "";

    setName(nameParam);
    setType(typeParam);
    setDimension(dimensionParam);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchLocations(currentPage, name, type, dimension)
      .then((data) => {
        setLocations(data.results);
        setTotalPages(data.info.pages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        setLocations([]);
        setTotalPages(1);
        setLoading(false);
      });
  }, [currentPage, name, type, dimension]);

  const handleSearch = (query) => {
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", 1);

    newParams.delete("name");
    newParams.delete("type");
    newParams.delete("dimension");

    if (query) {
      newParams.set(selectedFilter, query);
    }

    setSearchParams(newParams);

    if (selectedFilter === "name") {
      setName(query);
      setType("");
      setDimension("");
    } else if (selectedFilter === "type") {
      setType(query);
      setName("");
      setDimension("");
    } else if (selectedFilter === "dimension") {
      setDimension(query);
      setName("");
      setType("");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      const newParams = new URLSearchParams(searchParams);

      newParams.set("page", newPage);

      setCurrentPage(newPage);
      setSearchParams(newParams);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      const newParams = new URLSearchParams(searchParams);

      newParams.set("page", newPage);

      setCurrentPage(newPage);
      setSearchParams(newParams);
    }
  };

  const resetFilters = () => {
    setName("");
    setType("");
    setDimension("");
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="locations section--style">
      {loading ? (
        <div className="loading-spinner">
          <Spinner color="white" size="xl" />
        </div>
      ) : (
        <>
          <div className={`locations__search ${isMenuOpen ? "hidden" : ""}`}>
            <Select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="locations__select"
              sx={{
                height: "40px",
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
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            <SearchBar
              searchQuery={
                selectedFilter === "name"
                  ? name
                  : selectedFilter === "type"
                  ? type
                  : dimension
              }
              className="locations__search-bar"
              onSearch={handleSearch}
              placeholderText={`Search by ${selectedFilter}`}
            />

            <Button
              variant="outlined"
              color="error"
              className="locations__clear-button"
              onClick={resetFilters}
            >
              Clear
            </Button>
          </div>

          <h1 className="table__caption typo--caption">Locations</h1>
          {locations.length > 0 ? (
            <div className="table__container">
              <table className="table">
                <thead className="table__header">
                  <tr className="table__row">
                    <th className="table__header-cell typo--header-cell">ID</th>
                    <th className="table__header-cell typo--header-cell">
                      Location Name
                    </th>
                    <th className="table__header-cell typo--header-cell">
                      Type
                    </th>
                    <th className="table__header-cell typo--header-cell">
                      Dimension
                    </th>
                  </tr>
                </thead>
                <tbody className="locations__body">
                  {locations.map((location) => (
                    <tr className="table__row" key={location.id}>
                      <td className="table__cell">{location.id}</td>
                      <td className="table__cell">{location.name}</td>
                      <td className="table__cell">{location.type}</td>
                      <td className="table__cell">{location.dimension}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data-message">
              <p>No data found.</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
            />
          )}
        </>
      )}
    </div>
  );
}
