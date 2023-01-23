import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  CircularProgress,
  darken,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { Download as DownloadIcon, File as FileIcon } from "react-feather";
import ExcelFileIcon from "../../../icons/ExcelFileIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
    borderRadius: 5,
    boxSizing: "border-box",
  },
  fileDragOver: {
    background: darken(theme.palette.primary.light, 0.2),
    border: "2px dotted #CCC",
  },
}));
const ImportDataFile = ({ acceptedFileTypes, onReadSelectedFile }) => {
  const classes = useStyles();

  const [state, setState] = React.useState({
    isImporting: false,
    message: "",
    fileDragOver: false,
    selectedFile: "",
  });

  const handleFileDrop = async (e) => {
    const files = e.originalEvent.dataTransfer.files;
    if (!!files && files.length > 0) {
      await handleFileRead(files);
    }
  };

  const handleFileSelection = async (e) => {
    const files = e.target.files;
    if (!!files && files.length > 0) {
      await handleFileRead(files);
    }
  };

  const handleFileRead = async (files) => {
    setState({
      ...state,
      isImporting: true,
      message: "",
      selectedFile: files && files[0],
    });
    const imported = await onReadSelectedFile(files[0]);
    let message = "";
    if (imported) {
      message = "File imported successfully";
    } else {
      message = "File could not be imported. File not properly formatted";
    }
    setState({
      ...state,
      isImporting: false,
      message,
      selectedFile: files && files[0],
    });
  };

  return (
    <Box
      className={classes.root}
      onDrop={handleFileDrop}
      onFocus={() => setState({ ...state, fileDragOver: false })}
      onDragOver={() => setState({ ...state, fileDragOver: true })}
      onDragEnter={() => setState({ ...state, fileDragOver: true })}
      onDragLeave={() => setState({ ...state, fileDragOver: false })}
      style={
        state.fileDragOver
          ? {
              border: "3px dashed #ccc",
              background: "lightgray",
            }
          : {
              background: "transparent",
            }
      }
    >
      {!state.isImporting && state.message && (
        <Box mt={2} mb={2}>
          <Alert
            variant={"outlined"}
            severity={
              state.message.includes("successfully") ? "success" : "error"
            }
            onClose={() => setState({ ...state, message: "" })}
          >
            <Typography>{state.message}</Typography>
          </Alert>
        </Box>
      )}

      <Box m={1} p={1}>
        {state.selectedFile ? (
          <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <div>
              <ExcelFileIcon />
            </div>
            <p>{state.selectedFile.name}</p>
          </Box>
        ) : (
          <span>
            <DownloadIcon fontSize="large" color="disabled" />
          </span>
        )}
      </Box>
      <Typography color="textSecondary" gutterBottom>
        Drag &amp; drop your file over here or click below
      </Typography>
      <Box mt={1} mb={1}>
        <label>
          <input
            id="importFiles"
            name="salesDataFile"
            type="file"
            onChange={handleFileSelection}
            style={{ display: "none" }}
            accept={acceptedFileTypes}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            component="span"
            onClick={handleFileSelection}
            startIcon={<FileIcon />}
            aria-label="choose files"
          >
            {state.isImporting ? (
              <>
                <CircularProgress /> Importing...
              </>
            ) : (
              "Choose file"
            )}
          </Button>
        </label>
      </Box>
    </Box>
  );
};

ImportDataFile.propTypes = {
  acceptedFileTypes: PropTypes.string,
  onReadSelectedFile: PropTypes.func,
};

export default ImportDataFile;
