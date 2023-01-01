import React from "react";
import PropTypes from "prop-types";

import { Typography, makeStyles, Button } from "@material-ui/core";

import { RefreshTwoTone as RetryIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    fontFamily: "Poppins",
    marginLeft: "-10rem",
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const ErrorBoxComponent = ({ error, onRetry }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h2" color="error" align="left">
        {String(error)}
      </Typography>

      <Button
        className={classes.button}
        variant="outlined"
        color="default"
        size="small"
        onClick={onRetry}
        startIcon={<RetryIcon fontSize="small" />}
      >
        Retry
      </Button>
    </div>
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
