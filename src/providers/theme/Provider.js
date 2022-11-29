import React from "react";
import PropTypes from "prop-types";

import Context from "./Context";

const Provider = ({
  children,
  defaultTheme = "dark",
  persistKey = "theme",
}) => {
  const persistTheme = localStorage.getItem(persistKey);
  const [theme, setTheme] = React.useState(persistTheme || defaultTheme);
  React.useEffect(() => {
    try {
      localStorage.setItem(persistKey, theme);
    } catch (e) {
      console.warn(e);
    }
  }, [theme, persistKey]);
  return (
    <Context.Provider value={{ theme, setTheme }}>{children}</Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.any,
  defaultTheme: PropTypes.string,
  persistKey: PropTypes.string,
};

export default Provider;
