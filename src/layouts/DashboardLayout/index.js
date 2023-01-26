import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { makeStyles } from "@material-ui/core";
import TopBar from "./TopBar";
import NavBar from "./NavBar";

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

  const [openMinimize, setOpenMinimize] = useState(false);

  return (
    <>
      <TopBar
        onMobileNavOpen={() => setMobileNavOpen(true)}
        openMinimize={openMinimize}
        setOpenMinimize={setOpenMinimize}
      />

      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        openMinimize={openMinimize}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <PerfectScrollbar>
              <Outlet />
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
