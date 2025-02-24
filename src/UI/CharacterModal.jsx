import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
  color: "#fff",
  bgcolor: "#222222",
  border: "2px solid #000000",
  p: 5,
  fontFamily: "Permanent Marker",
};

export default function CharacterModal({ open, handleClose, character }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="characters__modal--box">
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 25,
            right: 20,
            color: "#fff",
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        {character && (
          <>
            <Typography
              id="modal-modal-title"
              variant="h3"
              component="h2"
              sx={{
                padding: "0 0 15px 0",
                fontFamily: "Squada One",
              }}
            >
              {character.name}
            </Typography>
            <img
              src={character.image}
              alt={character.name}
              style={{
                width: "100%",
                height: "auto",
                marginTop: "10px",
              }}
            />
            <Typography
              id="modal-modal-description"
              sx={{
                mt: 2,
                fontSize: "14px",
                fontFamily: "Allerta",
              }}
            >
              <span> Species: &nbsp; </span> {character.species}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Allerta",
              }}
            >
              <span> Origin: &nbsp; </span>
              {character.origin.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Allerta",
              }}
            >
              <span className="characters__box--gender">Gender: &nbsp;</span>
              {character.gender}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Allerta",
              }}
            >
              <span> Status: &nbsp; </span>
              {character.status}
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
}
