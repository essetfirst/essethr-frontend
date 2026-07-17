import { GlobalStyles as MuiGlobalStyles } from "@mui/material";

const globalStyles = {
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  html: {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    height: "100%",
    width: "100%",
  },
  body: {
    backgroundColor: "#f4f6f8",
    height: "100%",
    width: "100%",
  },
  a: {
    textDecoration: "none",
  },
  "#root": {
    height: "100%",
    width: "100%",
  },
};

const GlobalStyles = () => <MuiGlobalStyles styles={globalStyles} />;

export default GlobalStyles;
