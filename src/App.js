import "react-perfect-scrollbar/dist/css/styles.css";
import React from "react";

import { ThemeProvider } from "@material-ui/core";

import { LocalizationProvider } from "@material-ui/pickers";
// pick an adapter for your date library
import MomentUtils from "@material-ui/pickers/adapter/moment";

import { SnackbarProvider } from "notistack";

// import "./mixins/chartjs";
import AuthProvider from "./providers/auth/Provider";
import ConfigProvider from "./providers/config/Provider";
// import OnlineProvider from "./providers/online/Provider";
import OrgProvider from "./providers/org/Provider";
import AttendanceProvider from "./providers/attendance/Provider";
import LeaveProvider from "./providers/leave/Provider";
import NotificationSnackbarProvider from "./providers/notification-snackbar/Provider";

import defaultConfig from "./config";
import { defaultTheme, customTheme } from "./theme";

import ErrorBoundary from "./components/ErrorBoundary";
import RoutesComponent from "./Routes";

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
                        vertical: "bottom",
                        horizontal: "left",
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
