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

  // const navigate = useNavigate();
  // const { pathname } = useLocation();

  // const [alert, setAlert] = React.useState();

  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  // const startingUrl = "/";
  // const homeUrl = "/app/dashboard";
  // const paths = pathname.replace("/app/", "");
  // console.log(paths);
  // const pathList = [
  //   { url: homeUrl, label: "Home" },
  //   ...(pathname === homeUrl
  //     ? []
  //     : paths.split("/").map((path) => {
  //         console.log(path);
  //         return (
  //           path && {
  //             url: startingUrl + path,
  //             label: path || path[0].toUpperCase() + path.substring(1),
  //           }
  //         );
  //       })),
  // ];

  // const lastPathIndex = pathList.length - 1;

  return (
    <div className={classes.root}>
      {/* Start: this is a notification board from us developers to users */}
      {alert && <Alert>{alert}</Alert>}
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
              {/* <Container> */}
              {/* <div className={classes.breadcrumbs}>
                <Container>
                  <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                  >
                    {pathList.map(({ label, url }, index) =>
                      index !== lastPathIndex ? (
                        <Link
                          key={label}
                          color="inherit"
                          href={url}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(url);
                          }}
                        >
                          {label}
                        </Link>
                      ) : (
                        <Typography key={label} color="textPrimary">
                          {label}
                        </Typography>
                      )
                    )}
                  </Breadcrumbs>
                </Container>
              </div> */}
              <RegisterFromDevice />
              <Outlet />
              {/* </Container> */}
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
