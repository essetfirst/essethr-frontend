import React from "react";
import PropTypes from "prop-types";

import Context from "./Context";

const Provider = ({
  children,
  defaultLocale = "en",
  persistKey = "locale",
}) => {
  const persistLocale = localStorage.getItem(persistKey);
  const [locale, setLocale] = React.useState(persistLocale || defaultLocale);
  React.useEffect(() => {
    try {
      localStorage.setItem(persistKey, locale);
    } catch (e) {
      console.warn(e);
    }
  }, [locale, persistKey]);
  return (
    <Context.Provider value={{ locale, setLocale }}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.any,
  defaultLocale: PropTypes.string,
  persistKey: PropTypes.string,
};

export default Provider;
