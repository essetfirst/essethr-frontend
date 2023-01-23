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
  CircularProgress,
  Typography,
} from "@material-ui/core";

import { readExcelFile } from "../../../helpers/import";
import API from "../../../api";
import FileImportForm from "./FileImportForm";

const FileImportDialog = ({
  open,
  onClose,
  title = "File import dialog",
  acceptedFileTypes,
}) => {
  const [loading, setLoading] = React.useState(false);

  const [fileContent, setFileContent] = React.useState(null);

  const handleFileRead = async (file) => {
    return await readExcelFile(file)
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

  const handleImport = async () => {
    for (let i = 0; i < fileContent.data.length; i++) {
      const { success, error } = await API.employees.create(
        fileContent.data[i]
      );
      if (success) {
        setLoading(true);
        setLoading(false);
        onClose();
      } else {
        console.error(error);
      }
    }
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
          <pre>{JSON.stringify(fileContent)}</pre>
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
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography>Import</Typography>
              )}
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
