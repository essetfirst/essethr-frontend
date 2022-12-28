import React, { useState } from "react";
import {
  // useNavigate,
  Outlet,
  // useLocation
} from "react-router-dom";

import PerfectScrollbar from "react-perfect-scrollbar";

import {
  makeStyles,
  // Breadcrumbs,
  // Container,
  // Link,
  // Typography,
} from "@material-ui/core";

// import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import TopBar from "./TopBar";
import NavBar from "./NavBar";

import RegisterFromDevice from "../../views/attendance/RegisterFromDevice";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    paddingTop: 64,
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 246,
    },
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
  breadcrumbs: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const DashboardLayout = () => {
  const classes = useStyles();

  const [alert, setAlert] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAlert(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [alert]);

  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={classes.root}>
      {/* Start: this is a notification board from us developers to users */}
      {alert && (
        <Alert
          severity="info"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            zIndex: "9999",
          }}
        >
          <strong>Hi there!</strong> We are still working on this feature. We
          will notify you when it's ready.
        </Alert>
      )}

      {/* End */}
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <PerfectScrollbar>
              <RegisterFromDevice />
              <Outlet />
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
