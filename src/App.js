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
          <LocalizationProvider dateAdapter={MomentUtils}>
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
