import { create } from "zustand";
import API from "api";

const PERSIST_KEY = "auth";

function parseJwtPayload(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    return JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

export function readStoredSession(key = PERSIST_KEY) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function persistSession(session, key = PERSIST_KEY) {
  localStorage.setItem(key, JSON.stringify(session));
}

function clearSession(key = PERSIST_KEY) {
  localStorage.removeItem(key);
  localStorage.removeItem("org");
}

/** Read persisted session synchronously so protected routes don't flash to /login on reload. */
function initialAuthState(key = PERSIST_KEY) {
  const stored = readStoredSession(key);
  if (!stored?.token || isTokenExpired(stored.token)) {
    if (stored?.token) clearSession(key);
    return {
      user: null,
      token: null,
      refreshToken: null,
      permissions: [],
      isAuth: false,
      loading: false,
      error: null,
      bootstrapping: false,
    };
  }
  return {
    ...stored,
    permissions: stored.permissions || stored.user?.permissions || [],
    isAuth: true,
    loading: false,
    error: null,
    bootstrapping: true,
  };
}

export const useAuthStore = create((set, get) => ({
  ...initialAuthState(),

  hydrateFromStorage(key = PERSIST_KEY) {
    const stored = readStoredSession(key);
    if (!stored?.token || isTokenExpired(stored.token)) {
      clearSession(key);
      set({ bootstrapping: false, isAuth: false });
      return;
    }
    set({
      ...stored,
      isAuth: true,
      bootstrapping: true,
      loading: false,
      error: null,
    });
  },

  async bootstrap(key = PERSIST_KEY) {
    const { token } = get();
    if (!token) {
      set({ bootstrapping: false });
      return;
    }
    if (isTokenExpired(token)) {
      clearSession(key);
      set({ bootstrapping: false, isAuth: false, token: null, user: null });
      return;
    }
    try {
      const body = await API.auth.me({ skipAuthRedirect: true });
      if (body?.success) {
        set({ bootstrapping: false });
        return;
      }
      clearSession(key);
      set({
        bootstrapping: false,
        isAuth: false,
        token: null,
        user: null,
        permissions: [],
      });
    } catch {
      clearSession(key);
      set({
        bootstrapping: false,
        isAuth: false,
        token: null,
        user: null,
        permissions: [],
      });
    }
  },

  async login(credentials, key = PERSIST_KEY) {
    set({ loading: true, error: null });
    try {
      const body = await API.auth.login(credentials);
      if (!body?.success || !body.token) {
        const err =
          body?.message ||
          body?.error ||
          "Could not sign in. Check your email and password.";
        set({ loading: false, error: err, isAuth: false });
        return { success: false, error: err };
      }
      const permissions = body.permissions || body.user?.permissions || [];
      const session = {
        user: { ...body.user, permissions },
        token: body.token,
        refreshToken: body.refreshToken || null,
        permissions,
      };
      persistSession(session, key);
      set({
        ...session,
        isAuth: true,
        loading: false,
        error: null,
        bootstrapping: false,
      });
      return { success: true };
    } catch (e) {
      const detail =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Something went wrong";
      const error =
        detail.includes("Network Error") || detail.includes("ECONNREFUSED")
          ? "Cannot reach the API. Start the backend and ensure MongoDB is running."
          : detail;
      set({ loading: false, error, isAuth: false });
      return { success: false, error };
    }
  },

  async logout(key = PERSIST_KEY) {
    try {
      await API.auth.logout();
    } catch {
      // ignore
    }
    clearSession(key);
    set({
      user: null,
      token: null,
      refreshToken: null,
      permissions: [],
      isAuth: false,
      loading: false,
      error: null,
      bootstrapping: false,
    });
  },
}));

export default useAuthStore;
