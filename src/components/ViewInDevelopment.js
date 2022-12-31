import React from "react";

import { Typography } from "@material-ui/core";

const ViewInDevelopment = ({ viewName, customText }) => {
  return (
    <Typography variant="h6" align="center">
      <strong>{viewName}</strong> {customText || "is still in development"}
    </Typography>
  );
};

export default ViewInDevelopment;
