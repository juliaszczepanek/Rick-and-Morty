import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import emailjs from "@emailjs/browser";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "70%",
    sm: 400,
    lg: 500,
  },
  bgcolor: "#111111",
  border: "2px solid #cccccc",
  borderRadius: "10px",
  color: "#fff",
  p: {
    xs: 3,
    sm: 4,
  },
};

export default function FormModal({ isOpen, onClose, currentUser, watchlist }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!watchlist || !watchlist.episodes) return;

    const serviceId = import.meta.env.VITE_SERVICE_ID;
    const templateId = import.meta.env.VITE_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_PUBLIC_KEY;

    const formattedWatchList = watchlist.episodes
      .map((episode) => {
        const characters = episode.characters
          .map((char) => char.name)
          .join(", ");
        return `Episode: ${episode.episode}
    Name: ${episode.name}
    Air Date: ${episode.air_date}
    -----------------------`;
      })
      .join("\n\n");

    const templateParams = {
      from_email: currentUser?.email,
      message: formattedWatchList,
      to_email: email,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully", response);
        setEmail("");
        onClose();
      })
      .catch((error) => {
        console.error("Error sending email: ", error);
      });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: {
              xs: 10,
              sm: 20,
            },
            right: 20,
            color: "#fff",
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        <Typography
          id="modal-title"
          variant="h4"
          component="h2"
          sx={{
            textAlign: "center",
            minWidth: "250px",
            fontFamily: "Squada One",
            fontSize: "25px",
            mb: 4,
            mt: {
              xs: 3,
            },
          }}
        >
          Share "{watchlist?.name || "Watchlist"}" via Email
        </Typography>

        <TextField
          label="Enter Email"
          variant="outlined"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            mb: 3,
            bgcolor: "#ffffff",
            borderRadius: "10px",
            color: "#000",
            padding: "0.5rem, 1rem",
            fontFamily: "Allerta",
          }}
        />
        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#13acc9",
            color: "#fff",
            mb: 4,
            textTransform: "none",
            fontFamily: "Squada One",
            fontSize: "14px",
            "&:hover": {
              bgcolor: "#0e8ba8",
            },
          }}
        >
          Share
        </Button>
      </Box>
    </Modal>
  );
}
