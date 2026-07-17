import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Visibility,
  VisibilityOff,
  GroupsOutlined,
  ScheduleOutlined,
  InsightsOutlined,
} from "@mui/icons-material";
import { Alert } from "@mui/lab";
import Page from "components/Page";
import useAuth from "features/auth/providers";
import loginSchema from "features/auth/schemas/loginSchema";
import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Collapse,
  Paper,
  Checkbox,
  FormControlLabel,
  useTheme,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const REMEMBER_KEY = "essehr_remember_email";

const Root = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "1fr",
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "1.05fr 0.95fr",
  },
}));

const BrandPanel = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "none",
  overflow: "hidden",
  padding: theme.spacing(6),
  color: "#fff",
  background: `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 45%, ${theme.palette.secondary.main} 100%)`,
  [theme.breakpoints.up("md")]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

const GlowOrb = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(60px)",
  opacity: 0.35,
  background: alpha("#ffffff", 0.5),
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 0),
}));

const FormPanel = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4, 3),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(6, 4),
  },
}));

const FormCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: 420,
  padding: theme.spacing(4),
  borderRadius: 14,
  border: `1px solid ${theme.palette.mode === "light" ? alpha("#0f172a", 0.08) : alpha("#fff", 0.08)}`,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 16px 48px rgba(15, 23, 42, 0.08)"
      : "0 16px 48px rgba(0, 0, 0, 0.32)",
}));

const features = [
  {
    icon: GroupsOutlined,
    title: "Workforce management",
    text: "Employees, org structure, and lifecycle in one place.",
  },
  {
    icon: ScheduleOutlined,
    title: "Time & attendance",
    text: "Track presence, shifts, and leave with clarity.",
  },
  {
    icon: InsightsOutlined,
    title: "Operational insights",
    text: "Dashboards and analytics built for HR teams.",
  },
];

const LoginView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { auth, login } = useAuth();
  const [open, setOpen] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  const savedEmail = React.useMemo(() => {
    try {
      return localStorage.getItem(REMEMBER_KEY) || "";
    } catch {
      return "";
    }
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedEmail,
      password: "",
      remember: Boolean(savedEmail),
    },
  });

  const onSubmit = (values) => {
    try {
      if (values.remember) {
        localStorage.setItem(REMEMBER_KEY, values.email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
    } catch {
      /* ignore storage errors */
    }

    login({ email: values.email, password: values.password }, () => {
      navigate("/app/dashboard", { replace: true });
    });
  };

  return (
    <Page title="Login">
      <Root>
        <BrandPanel>
          <GlowOrb sx={{ width: 280, height: 280, top: -80, right: -40 }} />
          <GlowOrb sx={{ width: 220, height: 220, bottom: 40, left: -60 }} />

          <Box position="relative" zIndex={1}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              EsseHR
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 360 }}>
              Modern HR operations for growing teams — payroll, attendance, performance, and more.
            </Typography>
          </Box>

          <Box position="relative" zIndex={1} mt={4}>
            {features.map(({ icon: Icon, title, text }) => (
              <FeatureItem key={title}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#fff", 0.16),
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    {text}
                  </Typography>
                </Box>
              </FeatureItem>
            ))}
          </Box>

          <Typography variant="caption" sx={{ opacity: 0.7, position: "relative", zIndex: 1 }}>
            © {new Date().getFullYear()} Esset HR. All rights reserved.
          </Typography>
        </BrandPanel>

        <FormPanel>
          <FormCard elevation={0}>
            <Box mb={3}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your EsseHR workspace
              </Typography>
            </Box>

            {!auth.loading && auth.error && (
              <Box mb={2}>
                <Collapse in={open}>
                  <Alert
                    severity="error"
                    action={
                      <IconButton size="small" onClick={() => setOpen(false)} aria-label="dismiss">
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    {auth.error}
                  </Alert>
                </Collapse>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                fullWidth
                label="Work email"
                margin="normal"
                autoComplete="email"
                autoFocus
              />
              <TextField
                {...register("password")}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                fullWidth
                label="Password"
                margin="normal"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      aria-label={showPassword ? "hide password" : "show password"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />

              <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          size="small"
                          color="primary"
                        />
                      }
                      label={<Typography variant="body2">Remember me</Typography>}
                    />
                  )}
                />
              </Box>

              <Button
                color="primary"
                disabled={auth.loading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mt: 2, py: 1.25, borderRadius: 2 }}
              >
                {auth.loading ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" align="center" mt={3}>
              Don&apos;t have an account?{" "}
              <Link component={RouterLink} to="/signup" color="primary" fontWeight={600}>
                Create account
              </Link>
            </Typography>

            <Box
              sx={{
                display: { xs: "block", md: "none" },
                mt: 4,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                © {new Date().getFullYear()} Esset HR
              </Typography>
            </Box>
          </FormCard>
        </FormPanel>
      </Root>
    </Page>
  );
};

export default LoginView;
