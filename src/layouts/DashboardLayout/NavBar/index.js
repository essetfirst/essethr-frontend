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
  ApartmentOutlined as OrganizationIcon,
  MenuBookOutlined as MenuBookIcon,
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import GroupIcon from "@material-ui/icons/Group";
import TimerIcon from "@material-ui/icons/Timer";
import AssessmentIcon from "@material-ui/icons/Assessment";
import SettingsIcon from "@material-ui/icons/Settings";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import NavItem from "./NavItem";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import useAuth from "../../../providers/auth";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

const navItems = [
  {
    href: "/app/dashboard",
    icon: DashboardIcon,
    title: "Dashboard",
  },
  {
    href: "/app/org",
    icon: VerifiedUserIcon,
    title: "Admin",
  },
  {
    href: "/app/employees",
    icon: GroupIcon,
    title: "Employees",
  },
  {
    href: "/app/attendance",
    icon: TimerIcon,
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
    icon: AssessmentIcon,
    title: "Reports",
  },

  {
    href: "/app/settings",
    icon: SettingsIcon,
    title: "Settings",
  },
];

const adminNavItems = [
  {
    href: "/app/orgs",
    icon: OrganizationIcon,
    title: "Organizations",
  },
  {
    href: "/app/users",
    icon: RecentActorsIcon,
    title: "Users",
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 206,
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
    borderRadius: 50,
  },
  name: {
    fontSize: "1rem",
    fontFamily: "Poppins",
  },
  minimize: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  contactUsButton: {
    cursor: "pointer",
    fontFamily: "Poppins",
  },
  minimizedDrawer: {
    width: 50,
    top: 64,
    height: "calc(100% - 64px)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    scrollbarHeight: "none",
    scrollBehavior: "smooth",
    scrollbarColor: "transparent transparent",
    "&::-webkit-scrollbar": {
      display: "none",
    },

    "& .MuiSvgIcon-root": {
      fontSize: "1.8rem",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  },
  menuIcon: {
    cursor: "pointer",
    position: "absolute",
    left: 220,
    top: 10,
    zIndex: 100,

    "& .MuiSvgIcon-root": {
      fontSize: "2rem",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      color: "grey",
    },
  },
}));

const NavBar = ({
  onMobileClose,
  openMobile,
  onMinimize,
  minimized,
  onLogout,
  ...rest
}) => {
  const classes = useStyles();
  const location = useLocation();
  const { auth } = useAuth();

  const [minimize, setMinimize] = React.useState(false);

  const handleMinimize = () => {
    setMinimize(!minimize);
    onMinimize();
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (minimized) {
      setMinimize(true);
    }
  }, [minimized]);

  const minContent = (
    <Box
      onClick={handleMinimize}
      style={{
        cursor: "pointer",
        "& .MuiSvgIcon-root": {
          fontSize: "0.5rem",
        },

        "& .MuiTypography-root": {
          fontSize: "1rem",
          fontFamily: "Poppins",
        },

        transition: "width 2.5s",
      }}
      className={classes.menuIcon}
    >
      {minimize ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </Box>
  );
  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      {auth.isAuth && (
        <>
          {minContent}
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
                className={classes.name}
                color="textSecondary"
                variant="body2"
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
      {auth && auth.user && auth.user.role === "ADMIN" && (
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
      )}
      <Divider />
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
        >
          <Typography
            align="center"
            color="textSecondary"
            variant="body2"
            className={classes.name}
          >
            Powered by{" "}
            <Typography align="center" component="span">
              FutureTech LLC
            </Typography>
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            mt={1}
            className={classes.name}
          >
            <Button
              color="primary"
              href="https://futuretech.et"
              variant="contained"
              size="small"
              className={classes.contactUsButton}
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
      {!minimize && (
        <Hidden mdDown>
          <Drawer
            anchor={minimize ? "bottom" : "top"}
            classes={{ paper: classes.desktopDrawer }}
            open
            variant="persistent"
          >
            <PerfectScrollbar>{content}</PerfectScrollbar>
          </Drawer>
        </Hidden>
      )}
      <Hidden mdDown>
        <Drawer
          anchor={minimize ? "bottom" : "bottom"}
          classes={{
            paper: classes.minimizedDrawer,
            paperAnchorBottom: classes.minimizedDrawer,

            paperAnchorDockedBottom: classes.minimizedDrawer,
          }}
          open={minimize}
          variant="persistent"
        >
          <PerfectScrollbar>
            <List>
              <Box
                onClick={handleMinimize}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {minimize ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                component={RouterLink}
                to="/app/account"
                mt={2}
                mb={10}
              >
                <Box>
                  <Avatar
                    variant="rounded"
                    src={require("../../../assets/images/hope.jpg")}
                    style={{
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      border: "1px solid #fff",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
              </Box>

              {navItems.map((item) => (
                <NavItem
                  href={item.href}
                  // key={item.title}
                  // title={item.title}
                  icon={item.icon}
                />
              ))}
            </List>
          </PerfectScrollbar>
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
