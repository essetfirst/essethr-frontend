import React from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@mui/material";
import { useThemeStore } from "stores/themeStore";
import Context from "./Context";

/** Bridges Zustand theme store with legacy Context API consumers. */
const Provider = ({ children }) => {
  const darkMode = useThemeStore((s) => s.darkMode);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);
  const setDarkMode = useThemeStore((s) => s.setDarkMode);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  React.useEffect(() => {
    const lastTheme = localStorage.getItem("theme");
    if (lastTheme === "dark") setDarkMode(true);
    else if (lastTheme === "light") setDarkMode(false);
    else if (prefersDarkMode) setDarkMode(true);
  }, [prefersDarkMode, setDarkMode]);

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
