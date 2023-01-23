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
  Avatar,
} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  iconButton: {
    padding: theme.spacing(1),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  card: {
    maxWidth: 400,
    margin: "auto",
    marginTop: theme.spacing(9),
    paddingBottom: theme.spacing(2),
    borderRadius: "10px",
  },

  form: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: "60vh",
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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <strong>
        <Link color="inherit" href="/">
          esset HR
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </strong>
    </Typography>
  );
}

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { auth, login } = useAuth();
  const [open, setOpen] = React.useState(true);

  return (
    <Page className={classes.root} title="Login">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: "",
              password: "",
              showPassword: false,
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string("Must be a valid email").email().required(),
              password: Yup.string().max(255).required("Password is required"),
            })}
            onSubmit={(values) => {
              login(values, () => {
                navigate("/app/dashboard", { replace: true });
              });
            }}
          >
            {({
              errors,
              touched,
              values,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit} className={classes.form}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar className={classes.avatar}>
                    <LockOutlinedIcon style={{ color: "#fff" }} />
                  </Avatar>
                  <Typography color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                    gutterBottom
                  >
                    Sign in on the internal platform.
                  </Typography>

                  {!auth.loading && auth.error && (
                    <Box mt={3}>
                      <Collapse in={open}>
                        <Alert
                          severity="error"
                          action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => {
                                setOpen(!open);
                              }}
                            >
                              <CloseIcon fontSize="inherit" />
                            </IconButton>
                          }
                        >
                          {auth.error}
                        </Alert>
                      </Collapse>
                    </Box>
                  )}
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email "
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
                    color="primary"
                    disabled={auth.loading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    style={{ fontFamily: "Ubuntu" }}
                  >
                    {auth.loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography color="textSecondary" variant="body1">
                    Don&apos;t have an account?{" "}
                    <Link component={RouterLink} to="/signup" variant="h6">
                      Sign up
                    </Link>
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Copyright />
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
