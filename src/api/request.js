import axios from "axios";

/**
 * Prefer `REACT_APP_API_URL` (origin only, e.g. http://localhost:4000).
 * If it is missing from the bundle (forgot restart, wrong .env location), development
 * on localhost still targets port 4000 on the same host so login/API calls bypass a broken CRA proxy.
 */
function resolveApiOrigin() {
  const rawUrl =
    import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "";
  const fromEnv =
    typeof rawUrl === "string" ? rawUrl.trim().replace(/\/+$/, "") : "";

  if (fromEnv) return fromEnv;

  const rawPort =
    import.meta.env.VITE_API_PORT || import.meta.env.REACT_APP_API_PORT || "4000";
  const devFallbackPort =
    typeof rawPort === "string" ? rawPort.trim() : String(rawPort);

  if (
    import.meta.env.DEV &&
    typeof window !== "undefined" &&
    window.location &&
    ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)
  ) {
    const { protocol, hostname } = window.location;
    const safeHost = hostname === "[::1]" ? "127.0.0.1" : hostname;
    return `${protocol}//${safeHost}:${devFallbackPort}`;
  }

  return "";
}

const apiOrigin = resolveApiOrigin();

export const apiURL = apiOrigin ? `${apiOrigin}/api/v1` : "/api/v1";

const getAuth = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

const persistAuth = (session) => {
  localStorage.setItem("auth", JSON.stringify(session));
};

const refreshAccessToken = async () => {
  const auth = getAuth();
  if (!auth?.refreshToken) return null;
  try {
    const response = await axios.post(`${apiURL}/users/refresh`, {
      refreshToken: auth.refreshToken,
    }, {
      headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
    });
    const body = response.data;
    if (body?.success && body.token) {
      const session = {
        ...auth,
        token: body.token,
        refreshToken: body.refreshToken || auth.refreshToken,
      };
      persistAuth(session);
      return session.token;
    }
  } catch (e) {
    console.warn("Token refresh failed", e);
  }
  return null;
};

const getOrg = () => {
  const org = localStorage.getItem("org");
  if (!org) return null;
  try {
    return JSON.parse(org);
  } catch {
    return null;
  }
};

/** Resolve org id for X-Organization (persisted string or `{ id }` objects). */
const getOrgIdForHeader = () => {
  const raw = getOrg();
  if (raw == null) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object") {
    const id =
      raw.id ?? raw._id ?? raw.currentOrg ?? raw.orgId ?? raw.organizationId;
    return id != null ? String(id) : "";
  }
  return "";
};

const getURLPath = (url) => {
  if (typeof url !== "string" || url.length === 0) {
    return apiURL;
  }
  const path = url.replace(/^\/+/, "");
  return `${apiURL}/${path}`;
};

const makeRequest = async (url, method, params, data, options = {}) => {
  const auth = getAuth();
  const headers = {
    "Content-Type": "application/json",
    Authorization: auth && auth.token ? `Bearer ${auth.token}` : "",
    "X-Requested-With": "XMLHttpRequest",
    /** Avoid conditional GET / 304 — axios often gets an empty body on 304 and drops JSON payloads. */
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };
  const orgHeaderId = getOrgIdForHeader();
  if (orgHeaderId) {
    headers["X-Organization"] = orgHeaderId;
  }
  const config = {
    method,
    url: getURLPath(url),
    headers,
    params,
    data,
  };

  try {
    const response = await axios(config);
    console.log(
      "%c API SUCCESS: ",
      "background: teal; color: white; font-weight: bold; font-size: 12px",
      response.data.success
    );

    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    const isLoginAttempt =
      method === "POST" &&
      typeof url === "string" &&
      url.endsWith("login");

    // Session expired on authenticated calls — try refresh once, then redirect
    if (status === 401 && !isLoginAttempt && !options.skipAuthRedirect) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        try {
          const retry = await axios(config);
          return retry.data;
        } catch (retryErr) {
          console.error(retryErr);
        }
      }
      console.log(error?.response?.data?.error);
      localStorage.removeItem("auth");
      localStorage.removeItem("org");
      window.location.href = "/login";
    }

    console.error(
      "%c API ERROR: ",
      "background: red; color: white; font-weight: bold; font-size: 12px",
      data ?? error.message ?? error
    );

    // Let callers handle API error bodies (axios rejects on 4xx/5xx by default)
    if (data !== undefined) {
      return data;
    }
    throw error;
  }
};

const makeRequestFileUpload = async (url, method, params, data) => {
  const auth = getAuth();
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: auth && auth.token ? `Bearer ${auth.token}` : "",
    "X-Requested-With": "XMLHttpRequest",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };
  const orgHeaderId = getOrgIdForHeader();
  if (orgHeaderId) {
    headers["X-Organization"] = orgHeaderId;
  }
  const config = {
    method,
    url: getURLPath(url),
    headers,
    params,
    data,
  };

  try {
    const response = await axios(config);
    console.log(
      "%c API SUCCESS: ",
      "background: teal; color: white; font-weight: bold; font-size: 12px",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "%c API ERROR: ",
      "background: red; color: white; font-weight: bold; font-size: 12px",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

export const postRequestFileUpload = (url, data) =>
  makeRequestFileUpload(url, "POST", null, data);

export const putRequestFileUpload = (url, data) =>
  makeRequestFileUpload(url, "PUT", null, data);

export const getRequest = (url, params, options) =>
  makeRequest(url, "GET", params, null, options);

export const postRequest = (url, data, options) =>
  makeRequest(url, "POST", null, data, options);

export const putRequest = (url, data) => makeRequest(url, "PUT", null, data);

export const deleteRequest = (url, data) =>
  makeRequest(url, "DELETE", null, data);

export const patchRequest = (url, data) =>
  makeRequest(url, "PATCH", null, data);

export const getQueryParams = (search) => {
  const params = {};
  const query = search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

export const queryObjectToString = (obj) => {
  let query = "";
  Object.keys(obj).forEach((key) => {
    const raw = obj[key];
    if (raw === undefined) return;
    const val =
      raw !== null && typeof raw === "object"
        ? JSON.stringify(raw)
        : String(raw);
    query = `${encodeURIComponent(key)}=${encodeURIComponent(val)}&${query}`;
  });

  return query;
};
