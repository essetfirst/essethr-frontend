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

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      // main: colors.indigo[500],
      main: colors.teal[400],
    },
    //   action: {
    //     active: colors.common.white,
    //     hover: colors.blueGrey[900],
    //     selected: colors.blueGrey[900],
    //     disabled: colors.blueGrey[600],
    //     disabledBackground: colors.blueGrey[900],
    //     disabledText: colors.blueGrey[600],
    //     selectedText: colors.blueGrey[900],
    //     text: colors.common.white,
    //     hoverText: colors.blueGrey[900],
    //     focus: colors.blueGrey[900],
    //     focusText: colors.blueGrey[900],
    //     selectedFocus: colors.blueGrey[900],
    //     selectedHover: colors.blueGrey[900],
    //     selectedHoverText: colors.blueGrey[900],
    //     icon: colors.common.white,
    //   },
    //   background: {
    //     dark: "#1c1f1d",
    //     default: "#1c1f1d",
    //     paper: "#070807",
    //   },
    //   primary: {
    //     main: colors.teal[500],
    //   },
    //   secondary: {
    //     main: colors.deepOrange[100],
    //     light: colors.deepOrange[200],
    //     dark: colors.deepOrange[700],
    //     contrastText: "#fff",
    //   },
    //   success: {
    //     main: colors.green[100] || colors.green[500] || colors.green[600],
    //     light: colors.green[200],
    //     dark: colors.green[700],
    //     contrastText: "#fff",
    //   },
    //   error: {
    //     main: colors.red[100] || colors.red[500] || colors.red[600],
    //     light: colors.red[200],
    //     dark: colors.red[700],
    //     contrastText: "#fff",
    //   },
    //   warning: {
    //     main: colors.deepPurple[100] || colors.deep[500],
    //     dark: colors.deepPurple[700],
    //     contrastText: "#fff",
    //   },
    //   text: {
    //     primary: colors.common.white,
    //     secondary: colors.blueGrey[200],
    //     disabled: colors.blueGrey[500],
    //     hint: colors.blueGrey[500],
    //     icon: colors.blueGrey[500],
    //     divider: colors.blueGrey[200],
    //     light: colors.blueGrey[100],
    //     dark: colors.blueGrey[900],
    //     white: "#fff",
    //   },
    // },

    // components: {
    //   MuiButton: {
    //     defaultProps: {
    //       disableElevation: true,
    //     },
    //     styleOverrides: {
    //       root: {
    //         textTransform: "none",
    //       },
    //       sizeSmall: {
    //         padding: "6px 16px",
    //       },
    //       sizeMedium: {
    //         padding: "8px 20px",
    //       },
    //       sizeLarge: {
    //         padding: "11px 24px",
    //       },
    //       textSizeSmall: {
    //         padding: "7px 12px",
    //       },
    //       textSizeMedium: {
    //         padding: "9px 16px",
    //       },
    //       textSizeLarge: {
    //         padding: "12px 16px",
    //       },
    //     },
    //   },
    //   MuiButtonBase: {
    //     defaultProps: {
    //       disableRipple: true,
    //     },
    //   },
    //   MuiCardContent: {
    //     styleOverrides: {
    //       root: {
    //         padding: "32px 24px",
    //         "&:last-child": {
    //           paddingBottom: "32px",
    //         },
    //       },
    //     },
    //   },
    //   MuiCardHeader: {
    //     defaultProps: {
    //       titleTypographyProps: {
    //         variant: "h6",
    //       },
    //       subheaderTypographyProps: {
    //         variant: "body2",
    //       },
    //     },
    //     styleOverrides: {
    //       root: {
    //         padding: "32px 24px",
    //       },
    //     },
    //   },
    //   MuiCssBaseline: {
    //     styleOverrides: {
    //       "*": {
    //         boxSizing: "border-box",
    //         margin: 0,
    //         padding: 0,
    //       },
    //       html: {
    //         MozOsxFontSmoothing: "grayscale",
    //         WebkitFontSmoothing: "antialiased",
    //         display: "flex",
    //         flexDirection: "column",
    //         minHeight: "100%",
    //         width: "100%",
    //       },
    //       body: {
    //         display: "flex",
    //         flex: "1 1 auto",
    //         flexDirection: "column",
    //         minHeight: "100%",
    //         width: "100%",
    //       },
    //       "#__next": {
    //         display: "flex",
    //         flex: "1 1 auto",
    //         flexDirection: "column",
    //         height: "100%",
    //         width: "100%",
    //       },
    //     },
    //   },
    //   MuiOutlinedInput: {
    //     styleOverrides: {
    //       notchedOutline: {
    //         borderColor: "#ffffff",
    //       },
    //     },
    //   },
    //   MuiTableHead: {
    //     styleOverrides: {
    //       root: {
    //         backgroundColor: "#F3F4F6",
    //         ".MuiTableCell-root": {
    //           color: "#374151",
    //         },
    //         borderBottom: "none",
    //         "& .MuiTableCell-root": {
    //           borderBottom: "none",
    //           fontSize: "12px",
    //           fontWeight: 600,
    //           lineHeight: 1,
    //           letterSpacing: 0.5,
    //           textTransform: "uppercase",
    //         },
    //         "& .MuiTableCell-paddingCheckbox": {
    //           paddingTop: 4,
    //           paddingBottom: 4,
    //         },
    //       },
    //     },
    //   },

    //   MuiTableCell: {
    //     styleOverrides: {
    //       root: {
    //         padding: "8px 24px",
    //         borderBottom: "1px solid #E6E8F0",
    //         "&.MuiTableSortLabel-icon": {
    //           color: "#374151",
    //           marginLeft: "8px",
    //         },
    //       },
    //       head: {
    //         fontSize: "12px",
    //         fontWeight: 600,
    //         lineHeight: 1,
    //         letterSpacing: 0.5,
    //         textTransform: "uppercase",
    //       },
    //       body: {
    //         fontSize: "12px",
    //         fontWeight: 400,
    //         lineHeight: 1.5,
    //         letterSpacing: 0.5,
    //         color: "#374151",
    //       },
    //     },
    //   },
    //   MuiTableRow: {
    //     styleOverrides: {
    //       root: {
    //         "&:nth-of-type(odd)": {
    //           backgroundColor: "#F3F4F6",
    //           "& .MuiTableCell-root": {
    //             borderBottom: "none",
    //             borderTop: "none",
    //           },
    //         },
    //       },
    //     },
    //   },
    //   MuiTextField: {
    //     styleOverrides: {
    //       root: {
    //         "& .MuiInputBase-input": {
    //           fontSize: "12px",
    //           fontWeight: 400,
    //           lineHeight: 1.5,
    //           letterSpacing: 0.5,
    //           borderColor: "#ffffff",
    //         },
    //         "& .MuiInputBase-input:focus": {
    //           borderColor: "#E6E8F0",
    //         },
    //         "& .MuiInputBase-input::placeholder": {
    //           color: "#374151",
    //         },
    //         "& .MuiInputBase-input::-webkit-input-placeholder": {
    //           color: "#374151",
    //         },
    //       },
    //     },
    //   },
    //   MuiToolbar: {
    //     styleOverrides: {
    //       root: {
    //         backgroundColor: "#F3F4F6",
    //         borderBottom: "1px solid #E6E8F0",
    //         "& .MuiToolbar-regular": { minHeight: "64px", padding: "0 24px" },
    //         "& .MuiToolbar-variant": {
    //           minHeight: "64px",
    //           padding: "0 24px",
    //         },
    //       },
    //     },
    //   },
  },

  shadows,
  typography,
});

export default defaultTheme;
