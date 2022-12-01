import React, { useState } from "react";
import PropTypes from "prop-types";

import { Link as RouterLink } from "react-router-dom";

import clsx from "clsx";
import {
  makeStyles,
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  TextField,
  MenuItem,
} from "@material-ui/core";

import {
  Menu as MenuIcon,
  NotificationsOutlined as NotificationsIcon,
} from "@material-ui/icons";

import {
  // User as UserIcon,
  LogOut as LogoutIcon,
} from "react-feather";

import useAuth from "../../providers/auth";
import useOrg from "../../providers/org";

import API from "../../api";

import Logo from "../../components/Logo";

// const user = {
//   avatar: "/static/images/avatars/avatar_6.png",
//   jobTitle: "Senior Developer",
//   name: "Abraham Gebrekidan",
// };

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    width: 32,
    height: 32,
    marginRight: 5,
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  // const [notifications] = useState([]);

  const { auth, logout } = useAuth();
  const { currentOrg, setCurrentOrg, setOrg } = useOrg();

  const [orgs, setOrgs] = React.useState([]);
  const [orgName, setOrgName] = React.useState("");

  const fetchOrganizations = React.useCallback(() => {
    API.orgs
      .getAll({ query: { createdBy: auth && auth.user && auth.user.email } })
      .then(({ success, orgs, error }) => {
        if (success) {
          console.log(
            "[DashboardLayout-TopBar]: Line 67 -> fetched orgs: ",
            orgs
          );

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
    console.log("DashboardLayout => Selected org: ", org);
    setCurrentOrg(value);
    setOrg(org);
    // setOrgName((orgs.find((o) => o._id === value) || {}).branch);
    setOrgName(org.branch);
  };

  const handleLogout = () => {
    logout(() => {});
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
          <Logo />
        </RouterLink>
        <RouterLink to="/">
          <Typography component="span" variant="h4" style={{ color: "#fff" }}>
            EssetHR
          </Typography>
        </RouterLink>

        <Box flexGrow={1} />
        <Hidden smDown>
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
                  <MenuItem style={{color: '#fff'}} value={_id} key={_id}>
                    {branch || name}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Typography variant="subtitle1">{orgName}</Typography>
            ))}
          {/* 
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="error"
              variant="standard"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
        </Hidden>
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
          color="inherit"
            >
            {user.name}
            </Typography>
            </Hidden>
          </Box> */}
        {/*           
        <IconButton onClick={handleLogout} color="inherit" title="logout">
          <LogoutIcon />
        </IconButton> */}
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;