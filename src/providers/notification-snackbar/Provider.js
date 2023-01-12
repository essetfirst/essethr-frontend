import React from "react";

import { Box, IconButton, makeStyles } from "@material-ui/core";

import {
  CheckCircleOutlineOutlined as CheckIcon,
  CloseOutlined as CloseIcon,
  ErrorOutlineOutlined as WarningIcon,
  WarningOutlined as ErrorIcon,
  RefreshTwoTone as RetryIcon,
} from "@material-ui/icons";

import Context from "./Context";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 24,
    height: 24,
    margin: theme.spacing(1),
  },
}));

const Provider = ({ children }) => {
  const classes = useStyles();
  const notificationSnackbar =
    (enqueueSnackbar, closeSnackbar) =>
    ({ success, message, error, severe, retry }) => {
      const content = (
        <Box display="flex" alignItems="center">
          {
            <span
              className={classes.avatar}
              sizes="small"
              style={{ marginRight: "5px" }}
            >
              {success ? (
                <CheckIcon fontSize="small" color="inherit" />
              ) : severe ? (
                <ErrorIcon fontSize="small" color="inherit" />
              ) : (
                <WarningIcon fontSize="small" color="inherit" />
              )}
            </span>
          }
          {`${message || error}`}
        </Box>
      );
      const action = (key) => (
        <>
          {
            <IconButton
              aria-label="close"
              onClick={() => {
                !severe
                  ? closeSnackbar(key)
                  : typeof retry === "function" && retry();
              }}
            >
              {!severe ? (
                <CloseIcon fontSize="small" color="inherit" />
              ) : (
                <RetryIcon fontSize="small" color="inherit" />
              )}
            </IconButton>
          }
        </>
      );

      enqueueSnackbar(content, {
        variant: severe ? "error" : success ? "success" : "warning",
        action,
      });
    };

  return (
    <Context.Provider value={{ notificationSnackbar }}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
