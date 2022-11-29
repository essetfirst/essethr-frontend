import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@material-ui/core";

import { readExcelFile } from "../../../helpers/import";

import FileImportForm from "./FileImportForm";

const FileImportDialog = ({
  open,
  onClose,
  title = "File import dialog",
  acceptedFileTypes,
  onFileRead,
}) => {
  const [fileContent, setFileContent] = React.useState(null);

  const handleFileRead = (file) => {
    return readExcelFile(file)
      .then((data) => {
        if (data) {
          setFileContent(data);
          return true;
        }
        return false;
      })
      .catch((e) => {
        return false;
      });
  };

  const handleImport = () => {
    onFileRead(fileContent);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography align="center" variant="h4" gutterBottom>
          {title}
        </Typography>
        <Divider />
      </DialogTitle>
      <DialogContent>
        <FileImportForm
          acceptedFileTypes={acceptedFileTypes}
          onReadSelectedFile={handleFileRead}
        />
        <Box mt={1} p={1}>
          <Typography>File contents:</Typography>
          <code>{JSON.stringify(fileContent)}</code>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <ButtonGroup>
            <Button fullWidth variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              component="span"
              disabled={!fileContent}
              onClick={handleImport}
            >
              Import
            </Button>
          </ButtonGroup>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

FileImportDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  acceptedFileTypes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onFileRead: PropTypes.func,
};

export default FileImportDialog;
