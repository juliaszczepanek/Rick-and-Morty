import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: 300,
    sm: 400,
    lg: 500,
  },
  bgcolor: "#111111",
  border: "2px solid #cccccc",
  borderRadius: "10px",
  color: "#fff",
  p: 4,
};

export default function WatchlistModal({
  open,
  handleClose,
  existingWatchlists = [],
  onCreateWatchlist,
  onAddToWatchlist,
}) {
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [selectedWatchlists, setSelectedWatchlists] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggleWatchlist = (watchlist) => {
    if (selectedWatchlists.includes(watchlist)) {
      setSelectedWatchlists(
        selectedWatchlists.filter((name) => name !== watchlist)
      );
    } else {
      setSelectedWatchlists([...selectedWatchlists, watchlist]);
    }
  };

  const handleCreateWatchlist = () => {
    const trimmedName = newWatchlistName.trim();
    if (!trimmedName) {
      setErrorMessage("You need to name your watchlist");
      return;
    }
    if (newWatchlistName.trim()) {
      if (
        existingWatchlists.some(
          (name) => name.toLowerCase() === newWatchlistName.toLowerCase()
        )
      ) {
        setErrorMessage("A watchlist with this name already exists.");
      } else {
        onCreateWatchlist(newWatchlistName);
        setNewWatchlistName("");
        setErrorMessage("");
      }
    }
  };

  const handleAddToSelected = () => {
    if (selectedWatchlists.length > 0) {
      onAddToWatchlist(selectedWatchlists);
      setSelectedWatchlists([]);
      handleClose();
    }
  };

  useEffect(() => {
    if (!open) {
      setSelectedWatchlists([]);
      setNewWatchlistName("");
      setErrorMessage("");
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            color: "#fff",
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        <Typography
          id="modal-title"
          variant="h4"
          sx={{
            mb: 3,
            textAlign: "center",
            fontFamily: "Squada One",
            fontSize: "25px",
          }}
        >
          Add Episode to Watchlist
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, fontFamily: "Allerta" }}>
          Create New Watchlist
        </Typography>

        {errorMessage && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              fontFamily: "Allerta",
              fontSize: "12px",
              bgcolor: "#111111",
              color: "red",
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <TextField
          variant="outlined"
          fullWidth
          type="text"
          placeholder="Enter watchlist name"
          value={newWatchlistName}
          onChange={(e) => setNewWatchlistName(e.target.value)}
          sx={{
            bgcolor: "#dddddd",
            mb: 2,
            borderRadius: 1,
            color: "#000000",
            fontFamily: "Allerta",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCreateWatchlist}
          sx={{
            mb: 4,
            fontFamily: "Squada One",
            fontSize: "14px",
            bgcolor: "#13acc9",
            textTransform: "none",
          }}
        >
          Create
        </Button>

        <Typography variant="h6" sx={{ mb: 2, fontFamily: "Allerta" }}>
          Add Episode to Existing Watchlists
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            gap: 1.5,
            overflowY: "auto",
            mb: 3,
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ffffff",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#dddddd",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#333333",
            },
          }}
        >
          {existingWatchlists.map((watchlist, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => handleToggleWatchlist(watchlist)}
              sx={{
                mb: 3,
                whiteSpace: "nowrap",
                minWidth: "100px",
                fontFamily: "Allerta",
                bgcolor: selectedWatchlists.includes(watchlist)
                  ? "#13acc9"
                  : "#333333",
                color: "#fff",
                "&:hover": {
                  bgcolor: selectedWatchlists.includes(watchlist)
                    ? "#13acc9"
                    : "#444444",
                },
                borderColor: selectedWatchlists.includes(watchlist)
                  ? "#13acc9"
                  : "#fff",
              }}
            >
              {watchlist}
            </Button>
          ))}
        </Box>
        <Button
          variant="contained"
          fullWidth
          disabled={selectedWatchlists.length === 0}
          onClick={handleAddToSelected}
          sx={{
            fontFamily: "Squada One",
            fontSize: "14px",
            textTransform: "none",
            bgcolor: "#13acc9",
          }}
        >
          Add to Selected Watchlists
        </Button>
      </Box>
    </Modal>
  );
}
