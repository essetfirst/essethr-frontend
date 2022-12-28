import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";

const DeleteDialog = ({ open, onClose, onDelete, selected }) => {
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
          Are you sure you want to delete this Leave item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onDelete(selected);
            onClose();
          }}
          color="primary"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
