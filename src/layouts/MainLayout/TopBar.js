import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  makeStyles,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import BusinessIcon from "@material-ui/icons/Business";

const useStyles = makeStyles({
  root: {},
  toolbar: {
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
});

const TopBar = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/">
          <BusinessIcon
            style={{ color: "#fff", fontSize: "2rem", marginRight: "10px" }}
          />
        </RouterLink>
        <RouterLink to="/">
          <Typography
            component="span"
            className={classes.toolbar}
            variant="h4"
            style={{ color: "#fff" }}
          >
            Esset HR
          </Typography>
        </RouterLink>
        <Box flexGrow={1} />

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button
            color="primary"
            component={RouterLink}
            to="/login"
            style={{ color: "#fff" }}
            variant="outlined"
          >
            <Typography component="span" style={{ color: "#fff" }}>
              Login
            </Typography>
          </Button>
          <Button
            color="primary"
            component={RouterLink}
            to="/signup"
            variant="outlined"
            style={{ color: "#fff" }}
          >
            <Typography component="span" style={{ color: "#fff" }}>
              Sign Up
            </Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
};

export default TopBar;
