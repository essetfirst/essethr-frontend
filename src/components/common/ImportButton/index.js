import React from "react";
import PropTypes from "prop-types";

import { DownloadCloud as ExportIcon } from "react-feather";

import ImportFIleDialog from "../ImportFileDialog";

const ImportButton = ({ onImportFinished, ButtonProps }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleDialogOpen = () => {}
  const handleDialogClose = () => { setDialogOpen(false)}
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Call onImportFinished somewhere
  };

  return (
    <div>
      <input type="file" accept={["csv"]} onClick={handleFileChange} hidden />{" "}
      <Button onClick={handleFileChange} {...ButtonProps}>
        {children}
      </Button>
      <ImportFIleDialog open={dialogOpen} onClose={handleDialogClose} />
    </div>
  );
};

ImportButton.propTypes = {
  onImportFinished: PropTypes.func,
  ButtonProps: PropTypes.object(),
};

ImportButton.defaultProps = {
  onImportFinished: () => null,
  ButtonProps: {
    variant: "outlined",
    startIcon: <ExportIcon fontSize="small" />,
  },
};

export default ImportCSVButton;
