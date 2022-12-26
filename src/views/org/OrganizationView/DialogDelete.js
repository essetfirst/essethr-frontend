import React from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Button,
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
const DialogDelete = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        id="alert-dialog-title"
        style={{
          backgroundColor: "#f44336",
          color: "#fff",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          style={{
            color: "#fff",
            fontFamily: "Poppins",
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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={onDelete}
          color="primary"
          style={{
            backgroundColor: "#f44336",
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
