import useAuth from "features/auth/providers";

export default function usePermissions() {
  const { auth } = useAuth();
  const permissions = auth?.user?.permissions || auth?.permissions || [];

  const can = (permission) => {
    if (!permission) return true;
    return permissions.includes(permission);
  };

  const canAny = (...perms) => perms.some((p) => can(p));
  const canAll = (...perms) => perms.every((p) => can(p));

  return {
    permissions,
    can,
    canAny,
    canAll,
    role: auth?.user?.role,
  };
}
