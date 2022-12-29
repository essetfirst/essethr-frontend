import React from "react";
import { Typography, Button, Box, Grid, IconButton } from "@material-ui/core";
import { SentimentVeryDissatisfied } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import PageView from "./PageView";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },

  SentimentVeryDissatisfied: {
    //aniimate the icon
  },
}));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ ...this.state, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <PageView>
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            style={{ marginTop: "2rem" }}
          >
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="row"
                marginTop={15}
                p={1}
                m={1}
                borderRadius={8}
              >
                <SentimentVeryDissatisfied
                  //aniimate the icon
                  style={{
                    fontSize: "15rem",
                  }}
                />
                <Typography
                  variant="h1"
                  style={{
                    marginLeft: "1rem",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  gutterBottom
                >
                  {/* only oops will be red color */}
                  <span style={{ color: "#f44336" }}>Oops!</span>
                  <br />
                  Something went wrong.
                  <br />
                  Please try again later.
                  <br />
                </Typography>
              </Box>
              {/* show error info with a button to reload the page */}

              {/* {this.state.errorInfo && (
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                  gutterBottom
                >
                  {this.state.errorInfo.componentStack}
                </Typography>
              )} */}

              <Box display="flex" justifyContent="center" alignItems="center">
                <Fab
                  variant="extended"
                  aria-label="add"
                  onClick={() => {
                    window.location.reload();
                  }}
                  style={{
                    borderRadius: "50px",
                  }}
                >
                  <AutorenewIcon />
                  {"    "}
                  Reload
                </Fab>
              </Box>
            </Grid>
          </Grid>
        </PageView>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
