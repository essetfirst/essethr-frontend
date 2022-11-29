import { createMuiTheme, colors } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

export { theme as customTheme } from "./customTheme";

export const defaultTheme = createMuiTheme({
  palette: {
    background: {
      dark: "#F4F6F8",
      default: colors.common.white,
      paper: colors.common.white,
    },
    primary: {
      // main: colors.indigo[500],
      main: colors.teal[500],
    },
    secondary: {
      main: colors.deepOrange[500],
    },
    success: {
      main: colors.green[500],
    },
    error: {
      main: colors.red[500],
    },
    warning: {
      main: colors.deepPurple[500],
    },
    text: {
      primary: colors.blueGrey[800],
      secondary: colors.blueGrey[600],
    },
  },
  shadows,
  typography,
});
