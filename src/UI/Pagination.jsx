import React from "react";
import Button from "@mui/material/Button";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  return (
    <div className="pagination__container">
      <Button
        variant="contained"
        className="btn btn__pagination"
        startIcon={<WestIcon />}
        onClick={onPrev}
        disabled={currentPage === 1}
        sx={{
          backgroundColor: "#13acc9",
          color: "#fff",
          fontSize: {
            xs: "1.4rem",
            sm: "1.8rem",
            md: "2rem",
          },
          borderRadius: "100px",
          fontFamily: "Permanent Marker",
          padding: { xs: "0px 20px", md: "10px 30px" },
        }}
      >
        Prev
      </Button>
      <span className="pagination__page">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        className="btn btn__pagination"
        variant="contained"
        endIcon={<EastIcon />}
        onClick={onNext}
        disabled={currentPage === totalPages}
        sx={{
          backgroundColor: "#13acc9",
          color: "#fff",
          fontSize: {
            xs: "1.4rem",
            sm: "1.8rem",
            md: "2rem",
          },
          borderRadius: "100px",
          fontFamily: "Permanent Marker",
          padding: { xs: "0px 20px", md: "10px 30px" },
        }}
      >
        Next
      </Button>
    </div>
  );
}
