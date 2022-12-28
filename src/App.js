import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { LocalizationProvider } from "@material-ui/pickers";
import MomentUtils from "@material-ui/pickers/adapter/moment";
import { SnackbarProvider } from "notistack";
import AuthProvider from "./providers/auth/Provider";
import ConfigProvider from "./providers/config/Provider";
import OrgProvider from "./providers/org/Provider";
import AttendanceProvider from "./providers/attendance/Provider";
import LeaveProvider from "./providers/leave/Provider";
import NotificationSnackbarProvider from "./providers/notification-snackbar/Provider";
import defaultConfig from "./config";
import { lightTheme, darkTheme } from "./theme";
import ErrorBoundary from "./components/ErrorBoundary";
import RoutesComponent from "./Routes";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useTheme } from "./providers/theme";
import CssBaseline from "@material-ui/core/CssBaseline";

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
    <ThemeProvider theme={mode}>
      <CssBaseline />
      <ErrorBoundary>
        <LocalizationProvider dateAdapter={MomentUtils}>
          <ConfigProvider appConfig={config}>
            <AuthProvider persistKey={persistKey}>
              <OrgProvider>
                <AttendanceProvider>
                  <LeaveProvider>
                    <SnackbarProvider
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      autoHideDuration={2000}
                      hideIconVariant={true}
                      maxSnack={4}
                    >
                      <NotificationSnackbarProvider>
                        <RoutesComponent />
                      </NotificationSnackbarProvider>
                    </SnackbarProvider>
                  </LeaveProvider>
                </AttendanceProvider>
              </OrgProvider>
            </AuthProvider>
          </ConfigProvider>
        </LocalizationProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
