import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import { SentimentVeryDissatisfied } from "@mui/icons-material";
import Fab from "@mui/material/Fab";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PageView from "./PageView";

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
            justifyContent="center"
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
                  <span style={{ color: "#f44336", fontSize: "3rem" }}>
                    Oops!
                  </span>
                  <br />
                  Something went wrong.
                  <br />
                  Please try again later.
                  <br />
                </Typography>
              </Box>
              {import.meta.env.DEV && this.state.errorInfo && (
                <Typography
                  component="pre"
                  variant="body2"
                  style={{
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    padding: "1rem",
                    maxWidth: "90vw",
                    overflow: "auto",
                    backgroundColor: "#fafafa",
                  }}
                  gutterBottom
                >
                  {this.state.errorInfo.componentStack}
                </Typography>
              )}

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
