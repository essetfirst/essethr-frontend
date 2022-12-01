import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import CheckIcon from "@material-ui/icons/Check";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Page from "../../components/Page";
import API from "../../api/auth";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
  IconButton,
} from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        essetHR
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(9),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "75vh",
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  iconButton: {
    padding: 5,
  },
}));
const LoginIcon = ({ icon, ...props }) => {
  const classes = useStyles();
  return (
    <IconButton className={classes.iconButton} {...props}>
      {icon}
    </IconButton>
  );
};

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_ERROR: "REQUEST_ERROR",
};

const initialState = {
  token: null,
  message: "",
  requesting: false,
  error: null,
};
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, message: "", requesting: true, error: null };
    case types.REQUEST_SUCCESS:
      return {
        ...state,
        message: payload,
        token: payload,
        requesting: false,
        error: null,
      };
    case types.REQUEST_ERROR:
      return { ...state, message: "", requesting: false, error };
    default:
      return state;
  }
};

const SignUp = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleSignup = (info) => {
    dispatch({ type: types.REQUESTING });
    API.signup(info)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({ type: types.REQUEST_SUCCESS, payload: message });
          navigate("/login");
        } else {
          console.error(error);
          dispatch({ type: types.REQUEST_ERROR, error });
        }
      })
      .catch((e) => {
        console.error(e);
        dispatch({ type: types.REQUEST_ERROR, error: "Something went wrong." });
      });
  };

  return (
    <Page title="Sign up">
      <Container component="main">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h2">
            Sign up
          </Typography>
          <Typography component="h1" variant="h6" gutterBottom>
            Create a new account to get access to all the cool features
          </Typography>

          {!state.requesting && (state.message || state.error) && (
            <Box mt={3}>
              <Alert
                variant={"outlined"}
                color={state.error ? "error" : "success"}
                severity={state.error ? "error" : "success"}
                onClose={() => {
                  navigate("/signup/success");
                }}
              >
                {state.message || state.error}
              </Alert>
            </Box>
          )}
          <Formik
            initialValues={{
              org_name: "",
              org_email: "",
              org_phone: "",
              org_address: "",
              firstName: "",
              lastName: "",
              user_email: "",
              password: "",
              showPassword: false,
            }}
            validationSchema={Yup.object({
              org_name: Yup.string()
                .min(3, "Organization name must be at least 3 characters long")
                .required("Organization name is required"),
              org_email: Yup.string()
                .email("Enter a valid email")
                .required("Organization email is required"),
              org_phone: Yup.string().required(
                "Organization Phone is required"
              ),
              org_address: Yup.string(),

              firstName: Yup.string()
                .min(3)
                .max(40)
                .required("First name is required"),
              lastName: Yup.string()
                .min(3)
                .max(40)
                .required("Last name is required"),
              user_email: Yup.string()
                .email("Enter a valid email")
                .required("Email is required"),
              password: Yup.string().min(6).required("Password is required"),
            })}
            onSubmit={(values) => {
              const signupInfo = {
                org: {
                  name: values.org_name,
                  phone: values.org_phone,
                  email: values.org_email,
                  address: values.org_address,
                },
                user: {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.user_email,
                  password: values.password,
                },
              };
              console.log(signupInfo);
              handleSignup(signupInfo);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <form className={classes.form} onSubmit={handleSubmit} noValidate>
                <Box display="flex">
                  <Box p={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography varaint="h5" gutterBottom>
                          Organization Info.
                        </Typography>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.org_name && errors.org_name)}
                          helperText={touched.org_name && errors.org_name}
                          name="org_name"
                          variant="outlined"
                          required
                          fullWidth
                          id="org-name"
                          label="Organization Name"
                          value={values.org_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoFocus
                          autoComplete="org_name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.org_email && errors.org_email)}
                          helperText={touched.org_email && errors.org_email}
                          name="org_email"
                          variant="outlined"
                          required
                          fullWidth
                          id="org-email"
                          label="Organization Email"
                          value={values.org_email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="org_email"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          error={Boolean(touched.org_phone && errors.org_phone)}
                          helperText={touched.org_phone && errors.org_phone}
                          name="org_phone"
                          variant="outlined"
                          required
                          fullWidth
                          id="org-phone"
                          label="Phone"
                          value={values.org_phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="org_phone"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="org_address"
                          variant="outlined"
                          required
                          fullWidth
                          id="org-address"
                          label="Address"
                          value={values.org_address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box flexGrow={1} mb={2} style={{ marginBottom: "auto" }} />
                  <Divider orientation="vertical" />
                  <Box p={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography varaint="h5" gutterBottom>
                          User account Info.
                        </Typography>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                          name="firstName"
                          variant="outlined"
                          required
                          fullWidth
                          id="firstName"
                          label="First Name"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                          name="lastName"
                          variant="outlined"
                          required
                          fullWidth
                          id="lastName"
                          label="Last Name"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.user_email && errors.user_email
                          )}
                          helperText={touched.user_email && errors.user_email}
                          name="user_email"
                          variant="outlined"
                          required
                          fullWidth
                          id="user-email"
                          label="Email Address"
                          value={values.user_email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          InputProps={{
                            endAdornment: (
                              <LoginIcon
                                onClick={() =>
                                  setFieldValue(
                                    "showPassword",
                                    !values.showPassword
                                  )
                                }
                                icon={
                                  values.showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )
                                }
                              />
                            ),
                          }}
                          type={values.showPassword ? "text" : "password"}
                          error={Boolean(touched.password && errors.password)}
                          helperText={touched.password && errors.password}
                          name="password"
                          variant="outlined"
                          required
                          fullWidth
                          label="Password"
                          id="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                <Grid container xl={12} justify="center">
                  <Grid item xs={6} sm={3}>
                    <Button
                      type="submit"
                      size="medium"
                      fullWidth
                      variant="contained"
                      color={
                        !state.requesting
                          ? state.message
                            ? "success"
                            : "primary"
                          : "primary"
                      }
                      className={classes.submit}
                      disabled={state.requesting}
                    >
                      {state.requesting ? (
                        <CircularProgress color="inherit" />
                      ) : state.message ? (
                        <CheckIcon color="inherit" />
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </Grid>
                </Grid>
                <Grid container xl={12} justify="center">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
                <Grid container xl={12} justify="flex-end">
                  {/* <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox value="allowExtraEmails" color="primary" />
                      }
                      label="Subscribe our news later."
                      name="allowExtraEmails"
                      value={values.allowExtraEmails}
                      onChange={handleChange}
                    />
                  </Grid> */}
                </Grid>
              </form>
            )}
          </Formik>
          <Box>
            <Copyright />
          </Box>
        </div>
      </Container>
    </Page>
  );
};

export default SignUp;
