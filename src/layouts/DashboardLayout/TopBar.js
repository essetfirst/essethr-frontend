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
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},

  text: {
    fontFamily: "Poppins",
    fontWeight: 800,
    fontSize: "1.1rem",
  },
  avatar: {
    borderRadius: 50,
  },
  icon: {
    animation: `$myEffect 1000ms ${theme.transitions.easing.easeInOut}`,
  },
  "@keyframes myEffect": {
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  setOpenMinimize,
  openMinimize,
  ...rest
}) => {
  const classes = useStyles();
  const { darkMode, toggleDarkMode } = useTheme();
  const { auth, logout } = useAuth();
  const [orgs, setOrgs] = React.useState([]);
  const [orgName, setOrgName] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentOrg, setCurrentOrg } = useOrg();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(() => navigate("/login"));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  React.useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
            aria-label="open drawer"
            edge="start"
            title="menu"
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            title="menu"
            onClick={() => {
              setOpenMinimize(!openMinimize);
            }}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Hidden smDown>
          <RouterLink to="/" aria-label="home" name="home">
            <BusinessIcon
              aria-label="home"
              style={{ color: "#fff", fontSize: "2rem", marginRight: "10px" }}
            />
          </RouterLink>
          <RouterLink to="/app/dashboard">
            <Typography
              color="inherit"
              variant="h5"
              style={{
                fontFamily: "Poppins",
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "#fff",
              }}
            >
              Esset HR
            </Typography>
          </RouterLink>
        </Hidden>
        <Box flexGrow={1} />

        <Box alignItems="center" display="flex" ml={2}>
          <IconButton
            color="inherit"
            aria-label="dark mode"
            title="dark mode"
            onClick={() => {
              toggleDarkMode();
            }}
          >
            {darkMode ? (
              <Brightness7Icon className={classes.icon} />
            ) : (
              <Brightness4Icon className={classes.icon} />
            )}
          </IconButton>
        </Box>
        <Box>
          <IconButton
            onClick={handleClick}
            color="inherit"
            title="menu"
            style={{ fontSize: "0.8rem" }}
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
                    LogOut
                  </Typography>
                </IconButton>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        <Hidden smDown>
          {auth.isAuth &&
            Array.isArray(orgs) &&
            orgs.length > 0 &&
            (auth.user.role === "ADMIN" ? (
              <TextField
                select
                value={currentOrg}
                onChange={(e) => {
                  setCurrentOrg(e.target.value);
                  const org = orgs.find((o) => o._id === e.target.value);
                  setOrgName(org.branch || org.name);
                }}
                variant="outlined"
                size="small"
                style={{
                  marginLeft: "20px",
                  borderRadius: "8px",
                }}
                InputProps={{
                  style: {
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#000",

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff",

                        "&:hover": {
                          borderColor: "#fff",
                        },
                      },
                    },
                  },
                }}
              >
                {orgs.map((org) => (
                  <MenuItem key={org._id} value={org._id}>
                    {org.branch || org.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Typography variant="subtitle1">{orgName}</Typography>
            ))}
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;
