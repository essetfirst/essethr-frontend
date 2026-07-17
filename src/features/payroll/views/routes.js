import React from "react";

import { Route } from "react-router-dom";

import adminRoutes from "./adminRoutes";
import employeeRoutes from "./employeeRoutes";

const renderRoutes = (routesConfig) =>
  routesConfig.map(({ path, element, component, children }) => (
    <Route path={path} element={element} component={component}>
      {renderRoutes(children)}
    </Route>
  ));

const routesByRole = {
  admin: { routesConfig: adminRoutes, routes: renderRoutes(adminRoutes) },
  employee: {
    routesConfig: employeeRoutes,
    routes: renderRoutes(employeeRoutes),
  },
};

export default (role) => routesByRole[role];
