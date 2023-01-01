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
  const options = {
    method,
    params: { org },
    headers: {
      "Content-Type": "application/json",
      Authorization: auth && auth.token ? `Bearer ${auth.token}` : "",
    },
  };
  if (params) {
    options["params"] = JSON.stringify(params);
  }
  if (data) {
    options["data"] = data;
  }

  try {
    const res = await axios(getURLPath(url), options);
    console.log(
      "%c Response: 👉",
      "background: #009688; color: white",
      res.data
    );
    return res.data;
  } catch (error) {
    console.error("%c Error: 👉", "background: #f44336; color: white", error);

    return error;
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

export const deleteRequest = (url, params) => {
  return makeRequest(url, "DELETE", params, null);
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
