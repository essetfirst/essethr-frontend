import { styled } from "@mui/material/styles";
import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const StyledRoot = styled("div")(({ theme }) => ({
  height: "100vh",
}));

const StyledImage = styled("div")(({ theme }) => ({
  backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
}));

const StyledPaper = styled("div")(({ theme }) => ({
  margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

const StyledAvatar = styled("div")(({ theme }) => ({
  margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
}));

const StyledForm = styled("div")(({ theme }) => ({
  width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
}));

const StyledSubmit = styled("div")(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const SignInSide = () => {

  return (
    <Grid container component={StyledRoot}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} component={StyledImage} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <StyledPaper>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form component={StyledForm} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <StyledSubmit
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
             >
            >
              Sign In
            </StyledSubmit>
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
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignInSide;
