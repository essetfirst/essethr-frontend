import React from "react";
import PropTypes from "prop-types";
import Context from "./Context";
import useAuthStore, { readStoredSession } from "stores/authStore";

/** Auth provider — Zustand store + backward-compatible Context API. */
const Provider = ({ children, persistKey = "auth" }) => {
  const store = useAuthStore();

  React.useEffect(() => {
    store.hydrateFromStorage(persistKey);
    const stored = readStoredSession(persistKey);
    if (stored?.token) {
      store.bootstrap(persistKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistKey]);

  const auth = {
    user: store.user,
    token: store.token,
    refreshToken: store.refreshToken,
    permissions: store.permissions,
    isAuth: store.isAuth,
    loading: store.loading,
    error: store.error,
    bootstrapping: store.bootstrapping,
  };

  const login = (payload, cb) => {
    store.login(payload, persistKey).then((result) => {
      if (result.success) cb?.();
    });
  };

  const logout = (cb) => {
    store.logout(persistKey).then(() => cb?.());
  };

  return (
    <Context.Provider value={{ auth, login, logout, bootstrapping: auth.bootstrapping }}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.any,
  persistKey: PropTypes.string,
};

export default Provider;
