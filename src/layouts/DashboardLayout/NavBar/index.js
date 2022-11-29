import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Link as RouterLink, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  // TextField,
  // MenuItem,
} from "@material-ui/core";

import {
  PaymentOutlined as PayrollIcon,
  TimeToLeaveOutlined as LeaveIcon,
  DashboardOutlined as DashboardIcon,
  ApartmentOutlined as OrganizationIcon,
} from "@material-ui/icons";

import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Clock as TimeIcon,
  Linkedin as OrgIcon,
  LogOut as LogoutIcon,
} from "react-feather";

import NavItem from "./NavItem";

import useAuth from "../../../providers/auth";

// const company = {
//   // logo: "/static/images/avatars/avatar_6.png",
//   logo:
//     "data:image/png;base64,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",
//   name: "Kuraz Inc.",
//   ceo: "Abraham Gebrekidan",
// };

const navItems = [
  {
    href: "/app/dashboard",
    icon: DashboardIcon,
    title: "Dashboard",
  },
  {
    href: "/app/org",
    icon: OrganizationIcon,
    title: "Admin",
  },
  {
    href: "/app/employees",
    icon: UsersIcon,
    title: "Employees",
  },
  {
    href: "/app/attendance",
    icon: TimeIcon,
    title: "Time management",
  },
  {
    href: "/app/leaves",
    icon: LeaveIcon,
    title: "Leaves and Time-off",
  },
  {
    href: "/app/payroll",
    icon: PayrollIcon,
    title: "Payroll",
  },
  {
    href: "/app/reports",
    icon: BarChartIcon,
    title: "Reports",
  },

  {
    href: "/app/settings",
    icon: SettingsIcon,
    title: "Settings",
  },
  // {
  //   href: "/app/account",
  //   icon: UserIcon,
  //   title: "Account",
  // },
];

const adminNavItems = [
  {
    href: "/app/orgs",
    icon: OrgIcon,
    title: "Organizations",
  },
  {
    href: "/app/users",
    icon: UsersIcon,
    title: "Users",
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 246,
  },
  desktopDrawer: {
    width: 246,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 54,
    height: 54,
    marginRight: "10px",
    borderRadius: 4,
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { auth, logout } = useAuth();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      {auth.isAuth && (
        <>
          <Box
            display="flex"
            // alignItems="center"
            // justifyContent="center"
            // p={1}
            p={1}
            mr={1}
            ml={1}
            component={RouterLink}
            to="/app/account"
          >
            <Avatar variant="square" className={classes.avatar} />
            <Box display="flex" flexDirection="column">
              <Typography
                className={classes.name}
                color="textPrimary"
                variant="h6"
              >
                {auth.user.name}
              </Typography>
              {/* <Typography color="textSecondary" variant="body2">
                {auth.user.email}
              </Typography> */}
              <Typography color="textSecondary" variant="body2">
                {auth.user.role}
              </Typography>
              <Box mt={1} />
              <Button
                // fullWidth
                variant="outlined"
                size="small"
                onClick={handleLogout}
                endIcon={<LogoutIcon fontSize="small" size="18" />}
                aria-label="logout"
              >
                Logout
              </Button>
            </Box>
          </Box>
          <Box p={1} mr={1} ml={1}></Box>
        </>
      )}
      <Divider />
      <Box height="100%" p={1}>
        <List>
          {navItems.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      {/* {auth && auth.user && auth.user.role === "ADMIN" && (
        <Box height="100%" p={2} pb={1}>
          <Typography variant="body2" color="textSecondary">
            ADMIN
          </Typography>

          <List>
            {adminNavItems.map((item) => (
              <NavItem
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
              />
            ))}
          </List>
        </Box>
      )} */}
      <Hidden mdDown>
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={1}
          ml={1}
          mr={1}
          bgcolor="background.dark"
        >
          <Typography align="center" color="textSecondary" variant="body2">
            Powered by{" "}
            <Typography align="center" component="span">
              FutureTech LLC
            </Typography>
          </Typography>

          <Box display="flex" justifyContent="center" mt={1}>
            <Button
              color="primary"
              component="a"
              href="https://futuretech.et"
              variant="contained"
              size="small"
            >
              Contact us
            </Button>
          </Box>
        </Box>
      </Hidden>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          <PerfectScrollbar>{content}</PerfectScrollbar>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          <PerfectScrollbar>{content}</PerfectScrollbar>
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default NavBar;
