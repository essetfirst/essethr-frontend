import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import BusinessIcon from "@mui/icons-material/Business";

const StyledAppBar = styled(AppBar)({});

const StyledToolbar = styled(Toolbar)({
  fontFamily: "Poppins",
  fontWeight: "bold",
});

const TopBar = ({ className, ...rest }) => {
  return (
    <StyledAppBar className={clsx(className)} elevation={0} {...rest}>
      <StyledToolbar>
        <RouterLink to="/">
          <BusinessIcon
            style={{ color: "#fff", fontSize: "2rem", marginRight: "10px" }}
          />
        </RouterLink>
        <RouterLink to="/">
          <Typography
            component="span"
            variant="h4"
            style={{ color: "#fff", fontFamily: "Poppins", fontWeight: "bold" }}
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
      </StyledToolbar>
    </StyledAppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
};

export default TopBar;
