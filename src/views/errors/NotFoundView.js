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
            <Typography variant="h1" color="textPrimary">
              404: The page you are looking for isn’t here
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              You either tried some shady route or you came here by mistake.
              Whichever it is, try using the navigation
            </Typography>
            <img
              alt="Under development"
              className={classes.image}
              src={require("../../assets/icons/404.png")}
            />
          </Box>
          <Box textAlign="center" marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/app/dashboard", { replace: true })}
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
