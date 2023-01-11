import React from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";

import Context from "./Context";

const Provider = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(false);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  // Check if the user has already set a preference in localStorage
  React.useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
    } else if (localStorage.getItem("theme") === "light") {
      setDarkMode(false);
    } else {
      setDarkMode(prefersDarkMode);
    }
  }, [prefersDarkMode]);

  // When the user clicks the dark mode toggle, set the theme to dark or light
  const toggleDarkMode = () => {
    if (darkMode) {
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
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
