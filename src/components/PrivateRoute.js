import React from "react";
import PropTypes from "prop-types";

import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({
  element: Element,
  component: Component,
  redirectTo,
  isAuth,
  path,
  exact,
  ...props
}) =>
  !isAuth ? (
    <Navigate to={redirectTo} />
  ) : (
    <Route exact={exact} path={path} element={Element} component={Component} />
  );

PrivateRoute.propTypes = {
  element: PropTypes.element,
  component: PropTypes.node,
  isAuth: PropTypes.bool.isRequired,
  redirectTo: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default PrivateRoute;
