import React from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Button,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";

const DialogDelete = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        id="alert-dialog-title"
        style={{
          backgroundColor: "#f7665e",
          color: "#fff",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          style={{
            fontSize: "1.2rem",
          }}
        >
          Confirm Delete
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this item ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onDelete}
          color="primary"
          style={{
            backgroundColor: "#f7665e",
            color: "#fff",
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDelete;
