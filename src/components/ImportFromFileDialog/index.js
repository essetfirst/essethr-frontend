import React from "react";

import { Box, Dialog, DialogContent } from "@material-ui/core";

import { DropzoneArea } from "material-ui-dropzone";

const ImportJSONFromTabularFileDialog = ({
  open,
  onClose,
  onDropedFileReadAsJSON,
}) => {
  const handleDialogClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    onClose();
  };

  const handleFileDropAreaChange = (files) => {
    if (Array(files).length === 0) {
      return;
    }
    // // Do some XLSX manipulation and convert dropped file to JSON
    // const file = files[0].path;
    // console.log("File: ", file);
    // const reader = new FileReader();
    // reader.onload = (evt) => {
    //   /* Parse data */
    //   const bstr = evt.target.result;
    //   const wb = XLSX.read(bstr, { type: "binary" });
    //   /* Get first worksheet */
    //   const wsname = wb.SheetNames[0];
    //   const ws = wb.Sheets[wsname];
    //   /* Convert array of arrays */
    //   const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
    //   onDropedFileReadAsJSON(processTabularData(data));
    // };
    // reader.readAsBinaryString(file);
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogContent>
        <Box minWidth={350}>
          <DropzoneArea
            acceptedFiles={[".csv", ".xlsx"]}
            filesLimit={1}
            onChange={handleFileDropAreaChange}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImportJSONFromTabularFileDialog;
