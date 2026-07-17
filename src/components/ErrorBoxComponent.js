import React from "react";
import PropTypes from "prop-types";

import { Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { RefreshTwoTone as RetryIcon } from "@mui/icons-material";

const StyledRoot = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  fontFamily: "Poppins",
  marginLeft: "-10rem",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
}));

const ErrorBoxComponent = ({ error, onRetry }) => {
  return (
    <StyledRoot>
      <Typography variant="h2" color="error" align="left">
        {String(error)}
      </Typography>

      <StyledButton
        variant="outlined"
        color="default"
        size="small"
        onClick={onRetry}
        startIcon={<RetryIcon fontSize="small" />}
      >
        Retry
      </StyledButton>
    </StyledRoot>
  );
};

ErrorBoxComponent.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

ErrorBoxComponent.defaultProps = {
  onRetry: () => {
    window.location.reload();
  },
};

export default ErrorBoxComponent;
