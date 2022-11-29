import React from "react";
import PropTypes from "prop-types";

import Context from "./Context";

const Provider = ({ appConfig, children }) => {
  return <Context.Provider value={{ appConfig }}>{children}</Context.Provider>;
};

Provider.propTypes = {
  appConfig: PropTypes.any,
  children: PropTypes.any,
};

export default Provider;
