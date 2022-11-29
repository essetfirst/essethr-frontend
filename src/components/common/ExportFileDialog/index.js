import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

import { FilePlus as DirectoryIcon } from 'react-feather'

const ExportFileDialog = ({
  open,
  onClose,
  data,
  formats,
  onExportFinished,
}) => {
  const [filename, setFilename] = React.useState("");

  const handleExport = () => {
    //   Call onExportFinished somewhere
  };

  const handleDialogClose = () => {
    onClose();
  };

  const formatOptions = [
    { label: "Excel", value: "xlsx" },
    { label: "PDF", value: "pdf" },
  ];

  const handleDestChange = (e) => {
    const file = e.target.files[0];
    console.dir("Read file: ", file);
    // const newFilename = `${file.path}${file.filename}`
    // setFilename(newFilename)
  };

  const handleFilenameChange = (e) => {
    console.dir("Filename change: ", e.target);
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogContent>
      <Typography align="center" variant="h3" gutterBottom>
          File Import Dialog
        </Typography>
        <Divider />

        <input type="file" onChange={handleDestChange} hidden />
        <TextField
          variant="outlined"
          name="filename"
          value={filename}
          onChange={handleFilenameChange}
        />
        <IconButton onClick={handleDestChange}>
          <DirectoryIcon fontSize="small" />
        </IconButton>
        <TextField select variant="outlined">
          {formatOptions.map((format, index) => (
            <MenuItem key={index}>{format}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleExport}></Button>
        <Button variant="outlined" onClick={handleDialogClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportFileDialog;
