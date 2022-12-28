import { createMuiTheme, colors } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

export const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
    primary: {
      main: colors.teal[500],
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

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
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
