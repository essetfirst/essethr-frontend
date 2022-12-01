import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import Page from "../../components/Page";
import useAuth from "../../providers/auth";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles,
  CircularProgress,
  IconButton,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
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

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { auth, login } = useAuth();

  return (
    <Page className={classes.root} title="Login">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: "",
              password: "",
              showPassword: false,
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string("Must be a valid email")
                .max(255)
                .required("Email is required"),
              password: Yup.string().max(255).required("Password is required"),
            })}
            onSubmit={(values) => {
              login(values, () => {
                navigate("/");
              });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              setFieldValue,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h1">
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body1"
                  >
                    Sign in on the internal platform.
                  </Typography>

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
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email or Phone Number"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  InputProps={{
                    endAdornment: (
                      <LoginIcon
                        onClick={() =>
                          setFieldValue("showPassword", !values.showPassword)
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
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2} display="flex" justifyContent="center">
                  <Button
                    color={auth.isAuth ? "secondary" : "primary"}
                    disabled={auth.loading}
                    fullWidth
                    size="md"
                    type="submit"
                    variant="contained"
                  >
                    {!auth.loading ? "LOGIN" : <CircularProgress />}
                  </Button>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography color="textSecondary" variant="body1">
                    Don&apos;t have an account?{" "}
                    <Link component={RouterLink} to="/signup" variant="h5">
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
