import React from "react";

import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
}));

const LoadingComponent = ({ color = "primary", ...rest }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress color={color} {...rest} />
    </div>
  );
};

export default LoadingComponent;
