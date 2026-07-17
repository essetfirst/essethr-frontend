import React, { useCallback, useMemo } from "react";

import { useDropzone } from "react-dropzone";

import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";

import { readExcelFile } from "helpers/import";

const dropZoneStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
};

const FileImportDialog = ({
  open,
  onClose,
  onFileRead,
  title = "File import dialog",
  acceptedFileTypes,
}) => {

  const [selectedFiles, setSelectedFiles] = React.useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
  });
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: acceptedFileTypes });
  const style = useMemo(
    () => ({
      ...dropZoneStyle,
      ...(isDragActive ? { borderColor: "#2196f3" } : {}),
      ...(isDragAccept ? { borderColor: "#00e676" } : {}),
      ...(isDragReject ? { borderColor: "#ff1744" } : {}),
    }),
    [isDragActive, isDragAccept, isDragReject],
  );

  const handleFileSelect = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleImport = async () => {
    if (!!selectedFiles) {
      const data = await readExcelFile(selectedFiles[0]);
      onFileRead(data);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {/* <Typography align="center" variant="h3" gutterBottom> */}
        {title}
        {/* </Typography> */}
      </DialogTitle>
      <Divider />
      <DialogContent>
        {/* <Box mt={2} height={"100%"}>
          <Box display="flex" justifyContent="center" alignItems="center"> */}
        <div
          style={{
            minHeight: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px dotted #cacaca",
            borderRadius: 5,
          }}
          {...getRootProps({ style })}
        >
          <input
            {...getInputProps}
            // accept={acceptedFileTypes}
            // onChange={handleFileSelect}
          />
          {/* <Button
                variant="contained"
                color="primary"
                onClick={handleFileSelect}
                component="span"
                startIcon={<FileIcon />}
                aria-label="choose files"
              >
                Choose Files
              </Button> */}
          {/* <Typography color="textSecondary" variant="body2">
                Drag & drop files here or click below to choose files...
                <br />
                <label
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                </label>
              </Typography> */}
        </div>
        {/* </Box>
        </Box> */}
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
              disabled={!selectedFiles}
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

export default FileImportDialog;
