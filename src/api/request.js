import axios from "axios";
import { Link, Navigate } from "react-router-dom";

const apiURL = "/api/v1";

const getAuth = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

const getOrg = () => {
  const org = localStorage.getItem("org");
  return org ? JSON.parse(org) : null;
};

const getURLPath = (url) => `${apiURL}/${url}`;

const makeRequest = async (url, method, params, data) => {
  const auth = getAuth();
  const org = getOrg();
  const headers = {
    "Content-Type": "application/json",
    Authorization: auth && auth.token ? `Bearer ${auth.token}` : "",
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
      "%c API SUCCESS: ",
      "background: teal; color: white; font-weight: bold; font-size: 12px",
      response.data.success
    );

    return response.data;

  } catch (error) {
    if (error.response.status === 401) {
      console.log(error?.response?.data?.error );
      localStorage.removeItem("auth");
      localStorage.removeItem("org");
      window.location.href = "/login";
    }
    console.error(
      "%c API ERROR: ",
      "background: red; color: white; font-weight: bold; font-size: 12px",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

const makeRequestFileUpload = async (url, method, params, data) => {
  const auth = getAuth();
  const org = getOrg();
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: auth && auth.token ? `Bearer ${auth.token}` : "",
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

export const postRequest = (url, data) => makeRequest(url, "POST", null, data);

export const getRequest = (url, params) =>
  makeRequest(url, "GET", params, null);

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
    if (obj[key] !== undefined) {
      query = `${key}=${obj[key]}&${query}`;
    }
  });

  return query;
};
