import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#000000",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  outline: "2px solid #ffffff",
  width: "100%",
  maxWidth: "300px",
  display: "flex",
  alignItems: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flex: 1,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 2),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

export default function SearchBar({ searchQuery, onSearch, placeholderText }) {
  const [inputValue, setInputValue] = React.useState(searchQuery);

  React.useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  return (
    <Search>
      <StyledInputBase
        value={inputValue}
        placeholder={placeholderText || "Search..."}
        inputProps={{ "aria-label": "search" }}
        onChange={handleInputChange}
        sx={{ fontSize: "12px" }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <IconButton
        onClick={handleSearch}
        aria-label="search"
        sx={{ padding: 1, color: "#ffffff" }}
      >
        <SearchIcon sx={{ fontSize: "20px" }} />
      </IconButton>
    </Search>
  );
}
