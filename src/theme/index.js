import { createMuiTheme, colors } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

export const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    background: {
      default: "#F4F6F8",
      paper: colors.common.white,
    },
    primary: {
      main: colors.teal[500],
    },
    secondary: {
      main: colors.deepOrange[800],
    },

    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600],
    },

    divider: colors.grey[200],
  },
  shape: {
    borderRadius: 8,
  },

  responsiveFontSizes: true,

  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      },
    },
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: colors.blueGrey[100],
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: colors.blueGrey[100],
          "@media (hover: none)": {
            borderColor: colors.blueGrey[100],
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
      main: colors.blueGrey[600],
    },
    secondary: {
      main: colors.deepOrange[50],
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

    MuiButton: {
      //change outliend button color to white
      outlinedPrimary: {
        color: colors.blueGrey[100],
        borderColor: colors.blueGrey[400],
        "&:hover": {
          borderColor: "#fff",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
  },

  shadows,
  typography,
});
