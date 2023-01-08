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
      main: colors.blueGrey[500],
    },
    secondary: {
      main: colors.deepOrange[800],
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
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: colors.blueGrey[400],
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: colors.blueGrey[400],
          "@media (hover: none)": {
            borderColor: colors.blueGrey[400],
          },
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: "#6e737a",

        "&$focused": {
          color: "#6e737a",
        },
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
      main: colors.grey[400],
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
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: colors.blueGrey[400],
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: colors.blueGrey[400],
          "@media (hover: none)": {
            borderColor: colors.blueGrey[400],
          },
        },
      },
    },

    MuiInputLabel: {
      root: {
        color: "#e4e4e4",

        "&$focused": {
          color: "#e4e4e4",
        },
      },
    },
  },

  shadows,
  typography,
});
