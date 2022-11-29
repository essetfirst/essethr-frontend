import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

const DeleteEmployeeDialog = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogTitle>Delete employee?</DialogTitle>
        <DialogContentText>
          Do you really want to delete employee data?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onDelete}>
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEmployeeDialog;
