import React from "react";
import { Typography, Button, Box, Grid, IconButton } from "@material-ui/core";
import { SentimentVeryDissatisfied } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import PageView from "./PageView";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    this.setState({ ...this.state, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI

      return (
        <PageView>
          <Grid container spacing={2} justify="center">
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
                  style={{ fontSize: "15rem", color: "#fa2345" }}
                />
                <Typography
                  variant="h1"
                  style={{ marginLeft: "1rem", color: "#fa2345" }}
                  gutterBottom
                >
                  Oops!
                  <br />
                  Something went wrong.
                  <br />
                  Please try again later.
                  <br />
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius={8}
              >
                <Fab
                  variant="extended"
                  color="primary"
                  aria-label="add"
                  style={{
                    margin: "1rem",
                    backgroundColor: "#fa2345",
                    color: "white",
                  }}
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <AutorenewIcon />
                  {"    "}
                  Reload Page
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
