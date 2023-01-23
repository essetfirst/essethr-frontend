import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Typography,
  Button,
  // ListItem,
  withStyles,
  // List,
  Dialog,
  DialogContent,
  ButtonGroup,
  Divider,
  DialogTitle,
  DialogActions,
  // Grid,
  // IconButton,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { File as FileIcon } from "react-feather";
import { readExcelFile } from "../../../helpers/import";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#EEEEEE",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

const ImportFileDialog = ({ open, onClose, onFileChange, onFileImport }) => {
  const [state, setState] = React.useState({
    selectedFiles: undefined,
    currentFile: undefined,
    importedFiles: [],
    progress: 0,
    message: "",
    hasError: false,
    fileInfos: [],
  });

  const handleFileDrop = (e) => {};

  const handleFileSelection = (e) => {
    setState({ selectedFiles: e.target.files });
    typeof onFileChange === "function" && onFileChange(e.target.files);
  };

  const handleImport = () => {
    let currentFile = state.selectedFiles[0];
    setState({
      progress: 0,
      currentFile,
    });

    try {
      const int = setInterval(() => {
        setState(({ progress }) => ({
          progress: progress + 1,
        }));
      }, 10);

      if (onFileImport(currentFile)) {
        setState({
          fileInfos: [...state.fileInfos, currentFile],
          message: "File content imported",
          hasError: false,
        });
        clearInterval(int);
      }
    } catch (e) {
      setState({
        progress: 0,
        message: "Unable to import file content",
        currentFile: undefined,
        hasError: true,
      });
    }

    setState({
      currentFile: undefined,
      selectedFiles: undefined,
      hasError: false,
    });
  };

  const { message, hasError, currentFile, progress, selectedFiles } = state;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography align="center" variant="h3" gutterBottom>
          File Import Dialog
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box mt={2} heigh={"100%"}>
          <Box
            minHeight={150}
            p={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              minHeight: "400px",
              border: "2px dotted #cacaca",
              // border: "2px dotted #333",
              borderRadius: 5,
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              onDrop={handleFileDrop}
            >
              <Typography color="textSecondary" variant="body2">
                Drag & drop files here or click below choose files...
                <br />
                <label
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                  <input
                    id="btn-upload"
                    name="btn-upload"
                    style={{ display: "none" }}
                    type="file"
                    accept={
                      "application/ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }
                    onChange={handleFileSelection}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFileSelection}
                    component="span"
                    startIcon={<FileIcon />}
                    aria-label="choose files"
                  >
                    Choose Files
                  </Button>
                </label>
              </Typography>
              {currentFile && (
                <Box display="flex" alignItems="center">
                  <Box width={"100%"} mr={1}>
                    <BorderLinearProgress
                      variant="determinate"
                      value={progress}
                    />
                  </Box>
                  <Box minWidth={35}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >{`${progress}%`}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box mt={2} mb={2} display="flex" justifyContent="space-between">
            <Typography variant="body2">
              {selectedFiles && selectedFiles.length > 0
                ? selectedFiles[0].name
                : null}
            </Typography>
          </Box>

          <Typography variant="subtitle2" color={hasError ? "error" : ""}>
            {message}
          </Typography>
          {/* 
          <Typography variant="h6" gutterBottom>
            List of Files
          </Typography>

          <List>
            {fileInfos &&
              fileInfos.map((file, index) => (
                <ListItem divider key={index}>
                  <a href={file.url || file.path}>{file.name}</a>
                </ListItem>
              ))}
          </List> */}

          <Box mt={2} display="flex" justifyContent="flex-end">
            <ButtonGroup>
              <Button fullWidth variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                component="span"
                disabled={!selectedFiles}
                onClick={handleImport}
              >
                Import
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const ImportFileDialogSimple = ({
  title,
  acceptedFileTypes = "application/ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv",
  description,
  open,
  onClose,
  onFileSelectionChanged,
  onFileRead,
}) => {
  const [fileSelected, setFileSelected] = React.useState(null);

  const handleFileSelectClick = (e) => {
    const files = e.target.files;
    typeof onFileSelectionChanged === "function" &&
      files &&
      onFileSelectionChanged(files[0]);
    files && setFileSelected(files[0]);
  };
  const handleCancelClick = () => {
    onClose();
  };
  const handleImportClick = async () => {
    if (fileSelected) {
      const data = await readExcelFile(fileSelected);
      onFileRead(data);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h4" align="center" gutterBottom>
          {title}
        </Typography>
        <Divider />
        <Box mt={2} heigh={"100%"}>
          <Box
            p={4}
            style={{
              height: "100%",
              minWidth: "450px",
              border: "2px dotted #cacaca",
              borderRadius: 5,
            }}
          >
            <Typography variant="body" color="textSecondary" align="center">
              {description}
              <br />
              <label
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <input
                  id="btn-upload"
                  name="btn-upload"
                  style={{ display: "none" }}
                  type="file"
                  accept={acceptedFileTypes}
                  onChange={handleFileSelectClick}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFileSelectClick}
                  component="span"
                  startIcon={<FileIcon />}
                  aria-label="choose files"
                >
                  Choose Files
                </Button>
              </label>
            </Typography>
            <Box mt={2} />
            <Box>
              {fileSelected && (
                <div>
                  <div>
                    <FileIcon />
                  </div>
                  <Typography>
                    <br />
                    {fileSelected.name}
                  </Typography>
                </div>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            variant="contained"
            disabled={!fileSelected}
            onClick={handleImportClick}
            style={{ marginRight: "10px" }}
          >
            Import
          </Button>
          <Button variant="outlined" onClick={handleCancelClick}>
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

ImportFileDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onFileChange: PropTypes.func,
  onFileImport: PropTypes.func,
};

export default ImportFileDialog;
