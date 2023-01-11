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
} from "@material-ui/icons";

import ContactlessIconOutlined from "@material-ui/icons/ContactlessOutlined";
import GroupIconOutlined from "@material-ui/icons/GroupOutlined";
import TimerIconOutlined from "@material-ui/icons/TimerOutlined";
import AssessmentIconOutlined from "@material-ui/icons/AssessmentOutlined";
import SettingsIconOutlined from "@material-ui/icons/SettingsOutlined";
import VerifiedUserIconOutlined from "@material-ui/icons/VerifiedUserOutlined";
import NavItem from "./NavItem";
import RecentActorsIconOutlined from "@material-ui/icons/RecentActorsOutlined";
import useAuth from "../../../providers/auth";
import MenuIcon from "@material-ui/icons/Menu";

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

const adminNavItems = [
  {
    href: "/app/orgs",
    icon: OrganizationIcon,
    title: "Organizations",
  },
  {
    href: "/app/users",
    icon: RecentActorsIconOutlined,
    title: "Users",
  },
];

const useStyles = makeStyles((theme) => ({
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
    fontFamily: "Poppins",
    fontWeight: 200,
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
  },
  menuIcon: {
    cursor: "pointer",
    position: "absolute",
    left: 220,
    top: 1,
  },
}));

const NavBar = ({
  onMobileClose,
  openMobile,
  onMinimize,
  minimized,
  onLogout,
}) => {
  const classes = useStyles();
  const location = useLocation();
  const { auth } = useAuth();

  const [minimize, setMinimize] = React.useState(false);

  const handleMinimize = () => {
    setMinimize(!minimize);
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (minimized) {
      setMinimize(true);
    }
  }, [minimized]);

  const minContent = (
    <Hidden mdDown>
      <div onClick={handleMinimize}>
        <MenuIcon className={classes.menuIcon} />
      </div>
    </Hidden>
  );
  const content = itemsNav();

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
                <MenuIcon />
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
                    alt="Person"
                  />
                </Box>
              </Box>

              {navItems.map((item) => (
                <NavItem
                  href={item.href}
                  key={item.title}
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

  function itemsNav() {
    return (
      <Box height="100%" display="flex" flexDirection="column">
        {minContent}

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
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={1}
            mb={2}
          >
            <Typography
              color="textSecondary"
              variant="body2"
              className={classes.name}
            >
              Powered by
              <strong> Esset HR</strong>
            </Typography>
            <Box mt={1} />
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<ContactlessIconOutlined size="large" />}
              onClick={() => {
                window.open(
                  "https://essethr-fron-dev-kch2mcb4lukj4.herokuapp.com/home",
                  "_blank"
                );
              }}
              style={{
                backgroundColor: "#648dae",
                color: "white",
                "&:hover": {
                  backgroundColor: "#f50057",
                },
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Hidden>
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
