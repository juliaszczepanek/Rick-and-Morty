import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import emailjs from "@emailjs/browser";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: 250,
    sm: 300,
    lg: 400,
  },
  borderRadius: "10px",
  bgcolor: "rgb(30, 30, 30)",
  border: "2px solid rgba(255, 255, 255, 0.1)",
  boxShadow: 24,
  p: 5,
  color: "#fff",
};

export default function FormModal({ isOpen, onClose, currentUser, watchList }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceId = import.meta.env.VITE_SERVICE_ID;
    const templateId = import.meta.env.VITE_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_PUBLIC_KEY;

    const formattedWatchList = watchList
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
      })
      .catch((error) => {
        console.error("Error sending email: ", error);
      });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={handleSubmit} className="form__modal">
        <Box sx={style} className="form__modal--box">
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            sx={{ textAlign: "center", marginBottom: "2rem" }}
          >
            Share Watchlist via E-mail
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: "10px",
              backgroundColor: "#fff",
              marginBottom: "2rem",
              color: "white",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",

                fontSize: "12px",
                padding: "0.5rem 1.5rem",
                height: "40px",
                "& input": {
                  padding: "0.4rem",
                },
              },
            }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#13acc9",
              "&:hover": {
                backgroundColor: "#0e8ba8",
              },
              fontSize: "1rem",
              padding: "0.6rem 2rem",
              display: "block",
              margin: "0 auto",
            }}
          >
            Share
          </Button>
        </Box>
      </form>
    </Modal>
  );
}
