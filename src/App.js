import React from "react";
import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SnackbarProvider } from "notistack";
import AuthProvider from "features/auth/providers/Provider";
import ConfigProvider from "./providers/config/Provider";
import OrgProvider from "features/org/providers/Provider";
import AttendanceProvider from "features/attendance/providers/Provider";
import LeaveProvider from "features/leaves/providers/Provider";
import NotificationSnackbarProvider from "./providers/notification-snackbar/Provider";
import defaultConfig from "./config";
import { lightTheme, darkTheme } from "./theme";
import ErrorBoundary from "./components/ErrorBoundary";
import RoutesComponent from "./Routes";
import { useTheme } from "./providers/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

const App = ({ config: appConfig }) => {
  const config = { ...defaultConfig, ...appConfig };
  const { auth } = config;
  const { persistKey } = auth || {};

  const { darkMode } = useTheme();

  const mode = React.useMemo(
    () => (darkMode ? darkTheme : lightTheme),
    [darkMode]
  );

  return (
    <React.Fragment>
      <ThemeProvider theme={mode}>
        <CssBaseline />
        <ErrorBoundary>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ConfigProvider appConfig={config}>
              <AuthProvider persistKey={persistKey}>
                <OrgProvider>
                  <AttendanceProvider>
                    <LeaveProvider>
                      <PerfectScrollbar>
                        <SnackbarProvider
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          autoHideDuration={2000}
                          hideIconVariant={true}
                          maxSnack={3}
                          preventDuplicate
                        >
                          <NotificationSnackbarProvider>
                            <RoutesComponent />
                          </NotificationSnackbarProvider>
                        </SnackbarProvider>
                      </PerfectScrollbar>
                    </LeaveProvider>
                  </AttendanceProvider>
                </OrgProvider>
              </AuthProvider>
            </ConfigProvider>
          </LocalizationProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
