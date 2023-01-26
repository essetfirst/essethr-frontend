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
} from "@material-ui/core";

import {
  PaymentOutlined as PayrollIcon,
  TimeToLeaveOutlined as LeaveIcon,
  DashboardOutlined as DashboardIcon,
  // ApartmentOutlined as OrganizationIcon,
} from "@material-ui/icons";

import ContactlessIconOutlined from "@material-ui/icons/ContactlessOutlined";
import GroupIconOutlined from "@material-ui/icons/GroupOutlined";
import TimerIconOutlined from "@material-ui/icons/TimerOutlined";
import AssessmentIconOutlined from "@material-ui/icons/AssessmentOutlined";
import SettingsIconOutlined from "@material-ui/icons/SettingsOutlined";
import VerifiedUserIconOutlined from "@material-ui/icons/VerifiedUserOutlined";
import NavItem from "./NavItem";
// import RecentActorsIconOutlined from "@material-ui/icons/RecentActorsOutlined";
import useAuth from "../../../providers/auth";

const navItems = [
  {
    href: "/app/dashboard",
    icon: DashboardIcon,
    title: "Dashboard",
  },
  {
    href: "/app/org",
    icon: VerifiedUserIconOutlined,
    title: "Admin",
  },
  {
    href: "/app/employees",
    icon: GroupIconOutlined,
    title: "Employees",
  },
  {
    href: "/app/attendance",
    icon: TimerIconOutlined,
    title: "Attendance",
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
    icon: AssessmentIconOutlined,
    title: "Reports",
  },

  {
    href: "/app/settings",
    icon: SettingsIconOutlined,
    title: "Settings",
  },
];

// const adminNavItems = [
//   {
//     href: "/app/orgs",
//     icon: OrganizationIcon,
//     title: "Organizations",
//   },
//   {
//     href: "/app/users",
//     icon: RecentActorsIconOutlined,
//     title: "Users",
//   },
// ];

// console.log("navItems", adminNavItems);

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 206,
  },
  desktopDrawer: {
    width: 246,
    top: 64,
    height: "calc(100% - 64px)",
    borderRight: "none",
  },
  avatar: {
    cursor: "pointer",
    width: 54,
    height: 54,
    marginRight: "10px",
    borderRadius: 50,
  },
  name: {
    fontFamily: "Poppins",
    fontWeight: 200,
  },
  contactUsButton: {
    cursor: "pointer",
  },

  min: {
    width: 70,
    top: 64,
    height: "calc(100% - 64px)",
    overflow: "hidden",
    animation: "slideIn 5.5s ease-in-out",
  },
}));

const NavBar = ({ onMobileClose, openMobile, openMinimize }) => {
  const classes = useStyles();
  const location = useLocation();
  const { auth } = useAuth();

  const content = itemsNav();
  const min = itemsMin();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
          classes={
            openMinimize
              ? { paper: classes.min }
              : { paper: classes.desktopDrawer }
          }
          open
          variant="persistent"
        >
          {openMinimize ? (
            <>{min}</>
          ) : (
            <PerfectScrollbar>{content}</PerfectScrollbar>
          )}
        </Drawer>
      </Hidden>
    </>
  );

  function itemsNav() {
    return (
      <Box height="100%" display="flex" flexDirection="column">
        {auth.isAuth && (
          <>
            <Box
              display="inline-block"
              alignItems="center"
              justifyContent="center"
              p={1}
              mr={1}
              ml={1}
              component={RouterLink}
              to="/app/account"
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                mt={1}
              >
                <Avatar
                  variant="rounded"
                  className={classes.avatar}
                  src={require("../../../assets/images/hope.jpg")}
                  alt="Person"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                mt={1}
              >
                <Typography
                  color="textSecondary"
                  variant="h5"
                  className={classes.name}
                >
                  {auth.user.name}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  className={classes.name}
                >
                  {auth.user.role}
                </Typography>
                <Box mt={1} />
              </Box>
            </Box>
            <Box p={1} mr={1} ml={1} mb={1}></Box>
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
        <Divider />
        {/* {auth && auth.user && auth.user.role === "ADMIN" && (
          <Box height="100%" p={1} pb={1}>
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
        {/* <Divider /> */}
        <Hidden mdDown>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={25}
            mb={2}
          >
            <Button
              variant="outlined"
              color="primary"
              className={classes.contactUsButton}
              startIcon={<ContactlessIconOutlined size="small" />}
              onClick={() => {
                window.open(
                  "https://essethr-fron-dev-kch2mcb4lukj4.herokuapp.com/home",
                  "_blank"
                );
              }}
            >
              Contact Us
            </Button>
            <Box mt={1} />
            <Typography
              color="textSecondary"
              variant="body2"
              className={classes.name}
            >
              Powered by
              <strong> Esset HR</strong>
            </Typography>
          </Box>
        </Hidden>
      </Box>
    );
  }

  function itemsMin() {
    return (
      <Box height="100%" display="flex" flexDirection="column" mt={1}>
        {auth.isAuth && (
          <>
            <Box
              display="inline-block"
              alignItems="center"
              justifyContent="center"
              p={1}
              mr={1}
              ml={1}
              component={RouterLink}
              to="/app/account"
              mt={1}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                mt={1}
              >
                <Avatar
                  variant="rounded"
                  width="50px"
                  height="50px"
                  src={require("../../../assets/images/hope.jpg")}
                  alt="Person"
                />
              </Box>
            </Box>
            <Box p={1} mr={1} ml={1} mt={10} />
            <Divider />
            <Box height="100%" p={1}>
              <List>
                {navItems.map((item) => (
                  <NavItem href={item.href} key={item.title} icon={item.icon} />
                ))}
              </List>
            </Box>
            <Divider />
            {/* {auth && auth.user && auth.user.role === "ADMIN" && (
              <Box height="100%" p={1} pb={1} mt={15}>
                <List>
                  {adminNavItems.map((item) => (
                    <NavItem
                      href={item.href}
                      key={item.title}
                      icon={item.icon}
                    />
                  ))}
                </List>
              </Box>
            )}
            <Divider /> */}
          </>
        )}
      </Box>
    );
  }
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
