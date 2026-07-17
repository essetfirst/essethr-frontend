import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Page from "components/Page";
import API from "api";
import signupSchema from "features/auth/schemas/signupSchema";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        Esset HR
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const StyledPaper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
  borderRadius: 10,
  height: "100%",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
}));

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(3),
}));

const StyledSubmit = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const SignUpView = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [submitState, setSubmitState] = React.useState({ loading: false, error: null, message: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      org_name: "",
      org_email: "",
      org_phone: "",
      org_address: "",
      firstName: "",
      lastName: "",
      user_email: "",
      password: "",
      c_password: "",
    },
  });

  const onSubmit = async (values) => {
    setSubmitState({ loading: true, error: null, message: null });
    const signupInfo = {
      org: {
        name: values.org_name,
        phone: values.org_phone,
        orgEmail: values.org_email,
        address: values.org_address,
      },
      user: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.user_email,
        password: values.password,
      },
    };

    try {
      const { success, message, error } = await API.auth.signup(signupInfo);
      if (success) {
        reset();
        navigate("/login");
      } else {
        setSubmitState({ loading: false, error: error || "Sign up failed", message: null });
      }
    } catch {
      setSubmitState({ loading: false, error: "Something went wrong.", message: null });
    }
  };

  return (
    <Page title="Sign up">
      <Container component="main">
        <CssBaseline />
        <StyledPaper>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h2">
            Sign up
          </Typography>
          <Typography component="p" variant="h6" gutterBottom>
            Create a new account to get access to all the cool features
          </Typography>

          {!submitState.loading && (submitState.message || submitState.error) && (
            <Box mt={3} width="100%">
              <Alert severity={submitState.error ? "error" : "info"}>
                {submitState.message || submitState.error}
              </Alert>
            </Box>
          )}

          <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box display="flex" flexWrap="wrap">
              <Box p={2} flex={1} minWidth={280}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                      Organization Info.
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("org_name")}
                      error={Boolean(errors.org_name)}
                      helperText={errors.org_name?.message}
                      variant="outlined"
                      required
                      fullWidth
                      label="Organization Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("org_email")}
                      error={Boolean(errors.org_email)}
                      helperText={errors.org_email?.message}
                      variant="outlined"
                      required
                      fullWidth
                      label="Organization Email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register("org_phone")}
                      error={Boolean(errors.org_phone)}
                      helperText={errors.org_phone?.message}
                      variant="outlined"
                      required
                      fullWidth
                      label="Phone"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register("org_address")}
                      variant="outlined"
                      fullWidth
                      label="Address"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box p={2} flex={1} minWidth={280}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                      User account Info.
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register("firstName")}
                      error={Boolean(errors.firstName)}
                      helperText={errors.firstName?.message}
                      variant="outlined"
                      required
                      fullWidth
                      label="First Name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register("lastName")}
                      error={Boolean(errors.lastName)}
                      helperText={errors.lastName?.message}
                      variant="outlined"
                      required
                      fullWidth
                      label="Last Name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("user_email")}
                      error={Boolean(errors.user_email)}
                      helperText={errors.user_email?.message}
                      variant="outlined"
                      required
                      fullWidth
                      label="Email Address"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      error={Boolean(errors.password)}
                      helperText={errors.password?.message}
                      variant="outlined"
                      required
                      fullWidth
                      label="Password"
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register("c_password")}
                      type={showConfirmPassword ? "text" : "password"}
                      error={Boolean(errors.c_password)}
                      helperText={errors.c_password?.message}
                      variant="outlined"
                      required
                      fullWidth
                      label="Confirm Password"
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => setShowConfirmPassword((v) => !v)} edge="end">
                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Grid container justifyContent="center">
              <Grid item xs={12} sm={4}>
                <StyledSubmit
                  type="submit"
                  size="medium"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={submitState.loading}
                >
                  {submitState.loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </StyledSubmit>
              </Grid>
            </Grid>

            <Box textAlign="center" mt={1}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </StyledForm>

          <Box mt={2}>
            <Copyright />
          </Box>
        </StyledPaper>
      </Container>
    </Page>
  );
};

export default SignUpView;
