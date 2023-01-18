import React from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";

import Context from "./Context";

const Provider = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(false);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  // Check if the user has already set a preference in localStorage
  React.useEffect(() => {
    const lastTheme = localStorage.getItem("theme");
    const isDarkMode = prefersDarkMode;
    if (lastTheme === "dark") {
      setDarkMode(true);
    } else if (lastTheme === "light") {
      setDarkMode(false);
    } else if (isDarkMode) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [prefersDarkMode]);

  // When the user clicks the dark mode toggle, set the theme to dark or light
  const toggleDarkMode = () => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    } else if (theme === "dark") {
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      // If the theme is not light or dark, set it to dark by default.
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <Context.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.any,
};

export default Provider;
