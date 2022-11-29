import React from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import ExportFileDialog from "../ExportFileDialog";

const ExportButton = ({
  exportButtonLabel = "Export",
  data,
  formats,
  ButtonProps,
  onExportFinished,
}) => {
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  //   const handleExportClick = () => {};
  const handleExportDialogOpen = () => setExportDialogOpen(true);
  const handleExportDialogClose = () => setExportDialogOpen(false);
  return (
    <>
      <Button onClick={handleExportDialogOpen} {...ButtonProps}>
        {exportButtonLabel || "Export"}
      </Button>
      <ExportFileDialog
        open={exportDialogOpen}
        onClose={handleExportDialogClose}
        data={data}
        formats={formats}
        onExportFinished={onExportFinished}
      />
    </>
  );
};

ExportButton.propTypes = {
  exportButtonLabel: PropTypes.string,
  data: PropTypes.array,
  formats: PropTypes.array,
  onExportFinished: PropTypes.func,
  ButtonProps: PropTypes.object,
};

export default ExportButton;
