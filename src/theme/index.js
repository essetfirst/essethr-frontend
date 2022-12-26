import { createMuiTheme, colors } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

export { theme as customTheme } from "./customTheme";

export const defaultTheme = createMuiTheme({
  palette: {
    type: "light",
    background: {
      dark: "#F4F6F8",
      default: colors.common.white,
      paper: colors.common.white,
    },
    primary: {
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
  shape: {
    borderRadius: 8,
  },
  shadows,
  typography,
});

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      dark: "#1F2937",
      default: "#1F2937",
      paper: "#353d4a",
    },

    primary: {
      main: colors.blueGrey[500],
    },
    secondary: {
      main: colors.deepOrange[500],
    },
  },
  shape: {
    borderRadius: 8,
  },

  shadows,
  typography,
});

export default defaultTheme;
