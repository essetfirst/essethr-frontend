import React from "react";
import { useNavigate } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Link,
  CircularProgress,
  Typography,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  makeStyles,
  Container,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import {
  Check as CheckIcon,
  LockOutlined as LockOutlinedIcon,
} from "@material-ui/icons";

import useAuth from "../../providers/auth";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        esset HR
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// const types = {
//   REQUESTING: "REQUESTING",
//   REQUEST_SUCCESS: "REQUEST_SUCCESS",
//   REQUEST_ERROR: "REQUEST_ERROR",
// };

// const initialState = {
//   token: null,
//   requesting: false,
//   error: null,
// };
// const reducer = (state, action) => {
//   const { type, payload, error } = action;
//   switch (type) {
//     case types.REQUESTING:
//       return { ...state, message: "", requesting: true, error: null };
//     case types.REQUEST_SUCCESS:
//       return {
//         ...state,
//         message: payload,
//         token: payload,
//         requesting: false,
//         error: null,
//       };
//     case types.REQUEST_ERROR:
//       return { ...state, message: "", requesting: false, error };
//     default:
//       return state;
//   }
// };

const SignIn = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { auth, login } = useAuth();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box mb={3}>
          {!auth.loading && auth.error && (
            <Box mt={3}>
              <Alert
                variant={"outlined"}
                color="error"
                severity="error"
                onClose={() => {}}
              >
                {auth.error}
              </Alert>
            </Box>
          )}
        </Box>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Enter a valid email")
              .required("Email is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={(values) => {
            login(values, () => {
              navigate("/");
            });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
              <TextField
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
              />
              <TextField
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {auth.loading ? (
                  <CircularProgress />
                ) : !auth.error ? (
                  "Sign In"
                ) : (
                  <CheckIcon />
                )}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default SignIn;
