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
import { useTheme } from "./providers/theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import "react-perfect-scrollbar/dist/css/styles.css";

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
    // This code is used to initialize the application and provide context to the application.
    // This code is used to provide the application with the authentication provider, the organization provider, the attendance provider, and the notification provider.

    <React.Fragment>
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
                        maxSnack={3}
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
    </React.Fragment>
  );
};

export default App;
