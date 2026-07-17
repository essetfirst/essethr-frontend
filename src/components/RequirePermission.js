import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import usePermissions from "features/auth/hooks/usePermissions";

/** Route guard — redirects to dashboard if permission missing. */
export default function RequirePermission({ permission, anyOf, children }) {
  const { can, canAny } = usePermissions();

  let allowed = true;
  if (permission) allowed = can(permission);
  else if (anyOf?.length) allowed = canAny(...anyOf);

  if (!allowed) return <Navigate to="/app/dashboard" replace />;
  return children;
}

RequirePermission.propTypes = {
  permission: PropTypes.string,
  anyOf: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};
