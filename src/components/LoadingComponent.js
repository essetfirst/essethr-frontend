import React from "react";

import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledRoot = styled("div")(({ theme }) => ({
  height: "100%",
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    margin: theme.spacing(2),
}));

const LoadingComponent = ({ color = "primary", ...rest }) => {
  return (
    <StyledRoot>
      <CircularProgress color={color} {...rest} />
    </StyledRoot>
  );
};

export default LoadingComponent;
