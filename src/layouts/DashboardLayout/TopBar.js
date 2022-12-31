import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../providers/theme";
import { Menu as MenuIcon } from "@material-ui/icons";
import BusinessIcon from "@material-ui/icons/Business";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import useAuth from "../../providers/auth";
import useOrg from "../../providers/org";
import API from "../../api";
import clsx from "clsx";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import {
  makeStyles,
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.20)",
    zIndex: theme.zIndex.drawer + 100,

    [theme.breakpoints.up("lg")]: {
      width: "100%",
    },
  },

  text: {
    fontFamily: "Poppins",
    fontWeight: 800,
    fontSize: "1.1rem",
  },
  avatar: {
    borderRadius: 50,
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const { darkMode, toggleDarkMode } = useTheme();
  const { auth, logout } = useAuth();
  const { setCurrentOrg } = useOrg();
  const [, setOrgs] = React.useState([]);
  const [, setOrgName] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
  }, [auth, setCurrentOrg]);

  React.useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

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
        <Hidden smDown>
          <RouterLink to="/">
            <BusinessIcon
              style={{ color: "#fff", fontSize: "2rem", marginRight: "10px" }}
            />
          </RouterLink>
          <RouterLink to="/app/dashboard">
            <Typography
              component="span"
              variant="h4"
              style={{ color: "#fff" }}
              className={classes.text}
            >
              Esset HR
            </Typography>
          </RouterLink>
        </Hidden>
        <Box flexGrow={1} />

        <Box alignItems="center" display="flex" ml={2}>
          <IconButton
            color="inherit"
            onClick={() => {
              toggleDarkMode();
            }}
          >
            {darkMode ? (
              <Brightness7Icon style={{ color: "#fff" }} />
            ) : (
              <Brightness4Icon style={{ color: "#fff" }} />
            )}
          </IconButton>
        </Box>
        <Box>
          <IconButton
            onClick={handleClick}
            color="inherit"
            title="menu"
            style={{ fontSize: "0.5rem" }}
          >
            <PersonIcon style={{ color: "#fff" }} />
          </IconButton>
          <Box alignItems="center" display="flex" ml={1}>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  navigate("/app/account");
                }}
              >
                {" "}
                <IconButton color="inherit" title="profile">
                  <PermIdentityIcon style={{ marginRight: "5px" }} />
                  <Typography color="inherit" variant="body2">
                    Profile
                  </Typography>
                </IconButton>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <IconButton color="inherit" title="logout">
                  <ExitToAppIcon style={{ marginRight: "5px" }} />
                  <Typography color="inherit" variant="body2">
                    Log out
                  </Typography>
                </IconButton>
              </MenuItem>
            </Menu>
          </Box>
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
