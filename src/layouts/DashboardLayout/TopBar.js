import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "../../providers/theme";

import clsx from "clsx";
import {
  makeStyles,
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";

import { Menu as MenuIcon } from "@material-ui/icons";
import BusinessIcon from "@material-ui/icons/Business";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

import { LogOut as LogoutIcon } from "react-feather";

import useAuth from "../../providers/auth";
import useOrg from "../../providers/org";

import API from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    width: 32,
    height: 32,
    marginRight: 5,
  },
  text: {
    fontFamily: "Poppins",
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const { darkMode, toggleDarkMode } = useTheme();

  const { auth, logout } = useAuth();
  const { currentOrg, setCurrentOrg, setOrg } = useOrg();
  const [orgs, setOrgs] = React.useState([]);
  const [orgName, setOrgName] = React.useState("");

  const fetchOrganizations = React.useCallback(() => {
    API.orgs
      .getAll({ query: { createdBy: auth && auth.user && auth.user.email } })
      .then(({ success, orgs, error }) => {
        if (success) {
          if (Array.isArray(orgs) && orgs.length > 0) {
            setOrgs(orgs);
            setCurrentOrg(orgs[0]._id);
            setOrgName(orgs[0].branch || orgs[0].name);
          }
        } else {
          console.warn(error);
        }
      })
      .catch((e) => {
        console.warn(e.message);
      });
  }, [auth]);

  React.useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleOrgChange = (e) => {
    const { value } = e.target;
    setCurrentOrg(value);
    const org = orgs.filter((o) => o._id === value);
    setCurrentOrg(value);
    setOrg(org);
    setOrgName(org.branch);
  };

  const handleLogout = () => {
    logout(() => {
      localStorage.clear();
    });
  };

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>

        <RouterLink to="/">
          <BusinessIcon
            style={{ color: "#fff", fontSize: "2rem", marginRight: "10px" }}
          />
        </RouterLink>
        <RouterLink to="/">
          <Typography
            component="span"
            variant="h4"
            style={{ color: "#fff" }}
            className={classes.text}
          >
            Esset HR
          </Typography>
        </RouterLink>

        <Box flexGrow={1} />
        {/* <Hidden smDown>
          {auth.isAuth &&
            Array.isArray(orgs) &&
            orgs.length > 0 &&
            (auth.user.role === "ADMIN" ? (
              <TextField
                select
                label="Branch"
                name="currentOrg"
                onChange={handleOrgChange}
                value={currentOrg}
                variant="outlined"
                size="small"
              >
                {orgs.map(({ _id, name, branch }) => (
                  <MenuItem style={{ color: "#fff" }} value={_id} key={_id}>
                    {branch || name}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Typography variant="subtitle1">{orgName}</Typography>
            ))}
        </Hidden> */}
        {/* <Box alignItems="center" display="flex" mr={1}>
          <IconButton
            component={RouterLink}
            to={"/app/account"}
            color="inherit"
          >
            <UserIcon />
          </IconButton>
          <Hidden smDown>
            <Typography
              className={classes.name}
              color="inherit"
              variant="body2"
              component={RouterLink}
              to={"/app/account"}
            >
              {orgs.user}
            </Typography>
          </Hidden>
        </Box> */}

        {/* <Hidden smDown>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography
              className={classes.text}
              color="inherit"
              variant="body2"
            >
              {moment().format("ddd, h:mm:ss a")}{" "}
            </Typography>
          </Box>
        </Hidden> */}

        <Box alignItems="center" display="flex" ml={2}>
          <IconButton
            color="inherit"
            onClick={() => {
              toggleDarkMode();
            }}
          >
            {darkMode ? (
              <Brightness7Icon fontSize="medium" />
            ) : (
              <Brightness4Icon fontSize="medium" />
            )}
          </IconButton>
        </Box>
        <Box alignItems="center" display="flex" ml={2}>
          <IconButton onClick={handleLogout} color="inherit" title="logout">
            <LogoutIcon />
            <Hidden smDown>
              <Typography
                className={classes.text}
                color="inherit"
                variant="body2"
                component={RouterLink}
                to={"/app/account"}
                style={{ marginLeft: "7px", fontWeight: "bolder" }}
              >
                LogOut
              </Typography>
            </Hidden>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;
