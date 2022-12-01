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
import { defaultTheme } from "./theme";
import ErrorBoundary from "./components/ErrorBoundary";
import RoutesComponent from "./Routes";
import "react-perfect-scrollbar/dist/css/styles.css";

const App = ({ config: appConfig }) => {
  const config = { ...defaultConfig, ...appConfig };
  const { auth } = config;
  const { persistKey } = auth || {};
  return (
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={MomentUtils}>
        <ThemeProvider theme={defaultTheme}>
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
                      autoHideDuration={10000}
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
        </ThemeProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  );
};

export default App;
