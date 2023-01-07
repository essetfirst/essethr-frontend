import axios from "axios";

const apiURL = "/api/v1";

const getAuth = () => {
  return JSON.parse(localStorage.getItem("auth"));
};
const getOrg = () => {
  return JSON.parse(localStorage.getItem("org"));
};

const getURLPath = (url) => `${apiURL}/${url}`;

const makeRequest = async (url, method, params, data) => {
  const auth = getAuth();
  const org = getOrg();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.token}`,
  };
  if (org) {
    headers["X-Organization"] = org.id;
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
      "%c Success: 👉",
      "background: #2bb956; color: white",
      response.data
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "%c Error: 👉",
        "background: #26a69a; color: white",
        error.response.data
      );

      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem("auth");
        window.location.href = "/login";
      }
      throw data;
    }
    throw error;
  }
};

export const postRequest = (url, data) => {
  return makeRequest(url, "POST", null, data);
};

export const getRequest = (url, params) => {
  return makeRequest(url, "GET", params, null);
};

export const putRequest = (url, data) => {
  return makeRequest(url, "PUT", null, data);
};

export const deleteRequest = (url, data) => {
  return makeRequest(url, "DELETE", null, data);
};

export const patchRequest = (url, data) => {
  return makeRequest(url, "PATCH", null, data);
};

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
    if (obj[key] !== undefined) {
      query = `${key}=${obj[key]}&${query}`;
    }
  });
  return query;
};
