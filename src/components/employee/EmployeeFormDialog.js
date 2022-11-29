import React from "react";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";

const EmployeeFormDialog = ({ open, onClose, content, actions }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>{content || children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default EmployeeFormDialog;
