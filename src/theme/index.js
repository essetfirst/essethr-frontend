import { createMuiTheme, colors, responsiveFontSizes } from "@material-ui/core";
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
      main: colors.teal[400],
    },
    secondary: {
      main: colors.deepOrange[500],
    },
  },
  shape: {
    borderRadius: 8,
  },

  responsiveFontSizes: true,

  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
      },
    },
  },

  shadows,
  typography,
});

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: colors.blueGrey[900],
      paper: colors.blueGrey[800],
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

  responsiveFontSizes: true,
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
      },
    },
  },

  shadows,
  typography,
});
