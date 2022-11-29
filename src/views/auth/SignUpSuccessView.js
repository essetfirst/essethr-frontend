import React from "react";

import {
  Avatar,
  Box,
  Container,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";

import Page from "../../components/Page";
import SignupSuccessImg from "../../assets/images/registeration_success.jpg";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const SignUpSuccess = ({ resendEmail }) => {
  const classes = useStyles();

  // TODO: Sending email

  return (
    <Page title="Sign up success" className={classes.root}>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
        alignItems="center"
        p={2}
        mt={2}
      >
        <Container maxWidth="md">
          <Avatar>
            <img
              src={SignupSuccessImg}
              style={{ width: 128 }}
              alt={"Signup Successful"}
            />{" "}
          </Avatar>
          <Typography
            color="success"
            variant="body1"
            style={{ fontSize: "36px" }}
            gutterBottom
          >
            Registeration successful! Thank you for registering.
          </Typography>
          <Typography variant="body2">
            You have created new account successfully. We have sent you a
            verification email, follow the link inside to successfully verify
            your account. <br />
            If you can not find email <Link>Resend email</Link>.
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <Typography variant="body1" component={Link} href="/home">
              Back
            </Typography>
            <Typography variant="body1" component={Link} href="/signin">
              Sign in
            </Typography>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default SignUpSuccess;
