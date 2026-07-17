import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import useAuth from "features/auth/providers";

/**
 * "/" — send authenticated users to the app dashboard, others to login.
 */
export default function RootIndexRedirect() {
  const { auth, bootstrapping } = useAuth();

  if (bootstrapping) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    );
  }

  if (auth?.isAuth) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
}
