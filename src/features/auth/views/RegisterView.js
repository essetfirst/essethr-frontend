import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormHelperText,
  Link,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Alert } from "@mui/lab";

import Page from "components/Page";
import API from "api";
import registerSchema from "features/auth/schemas/registerSchema";

const StyledRoot = styled(Page)(({ theme }) => ({
  backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
}));

const RegisterView = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      policy: false,
    },
  });

  const onSubmit = async (values) => {
    setSubmitError(null);
    try {
      const { success, error } = await API.auth.register(values);
      if (success) {
        navigate("/login", { replace: true });
      } else {
        setSubmitError(error || "Registration failed");
      }
    } catch (e) {
      setSubmitError(e.message || "Something went wrong");
    }
  };

  return (
    <StyledRoot title="Register">
      <Box display="flex" flexDirection="column" height="100%" justifyContent="center">
        <Container maxWidth="sm">
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3}>
              <Typography color="textPrimary" variant="h2">
                Create new account
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Use your email to create new account
              </Typography>
            </Box>

            {submitError && (
              <Box mb={2}>
                <Alert severity="error" onClose={() => setSubmitError(null)}>
                  {submitError}
                </Alert>
              </Box>
            )}

            <TextField
              {...register("firstName")}
              error={Boolean(errors.firstName)}
              fullWidth
              helperText={errors.firstName?.message}
              label="First name"
              margin="normal"
              variant="outlined"
            />
            <TextField
              {...register("lastName")}
              error={Boolean(errors.lastName)}
              fullWidth
              helperText={errors.lastName?.message}
              label="Last name"
              margin="normal"
              variant="outlined"
            />
            <TextField
              {...register("email")}
              error={Boolean(errors.email)}
              fullWidth
              helperText={errors.email?.message}
              label="Email Address"
              margin="normal"
              type="email"
              variant="outlined"
            />
            <TextField
              {...register("password")}
              error={Boolean(errors.password)}
              fullWidth
              helperText={errors.password?.message}
              label="Password"
              margin="normal"
              type="password"
              variant="outlined"
            />

            <Controller
              name="policy"
              control={control}
              render={({ field }) => (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label={
                      <Typography color="textSecondary" variant="body1">
                        I have read the{" "}
                        <Link color="primary" component={RouterLink} to="#" underline="always">
                          Terms and Conditions
                        </Link>
                      </Typography>
                    }
                  />
                  {errors.policy && (
                    <FormHelperText error>{errors.policy.message}</FormHelperText>
                  )}
                </>
              )}
            />

            <Box my={2}>
              <Button
                color="primary"
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Sign up now"}
              </Button>
            </Box>
            <Typography color="textSecondary" variant="body1">
              Have an account?{" "}
              <Link component={RouterLink} to="/login" variant="h6">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </StyledRoot>
  );
};

export default RegisterView;
