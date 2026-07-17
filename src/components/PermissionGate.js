import React from "react";
import PropTypes from "prop-types";
import usePermissions from "features/auth/hooks/usePermissions";

/**
 * Renders children only when the current user has the required permission(s).
 */
export default function PermissionGate({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}) {
  const { can, canAny, canAll } = usePermissions();

  let allowed = true;
  if (permission) allowed = can(permission);
  else if (anyOf?.length) allowed = canAny(...anyOf);
  else if (allOf?.length) allowed = canAll(...allOf);

  if (!allowed) return fallback;
  return <>{children}</>;
}

PermissionGate.propTypes = {
  permission: PropTypes.string,
  anyOf: PropTypes.arrayOf(PropTypes.string),
  allOf: PropTypes.arrayOf(PropTypes.string),
  fallback: PropTypes.node,
  children: PropTypes.node,
};
