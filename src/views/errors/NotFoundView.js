import React from "react";
import Page from "../../components/Page";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    fontFamily: "Poppins",
  },
  image: {
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },

  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const NotFoundView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page className={classes.root} title="404">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="row"
        height="70%"
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <div className="notfound">
              <div className="notfound-404">
                <Typography
                  variant="h1"
                  style={{ fontSize: "150px", color: "#002626" }}
                >
                  <span>4</span>
                  <span>0</span>
                  <span>4</span>
                </Typography>
                <h3>Oops! Page not found</h3>
              </div>
            </div>
          </Box>
          <Box textAlign="center" marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default NotFoundView;
