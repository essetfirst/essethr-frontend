import React from "react";
import PropTypes from "prop-types";

import Context from "./Context";

import API from "../../api";

function getInitialState(persistKey = "auth") {
  let auth;
  try {
    auth = JSON.parse(localStorage.getItem(persistKey));
    // console.log("Auth initialization: ", auth);
  } catch (e) {
    console.warn(e);
  }

  return {
    ...auth,
    isAuth: auth !== null,
    loading: false,
    error: null,
  };
}

const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case "RESET":
      return getInitialState();
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        ...payload,
        isAuth: true,
        loading: false,
        error: null,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        token: "",
        isAuth: false,
        loading: false,
        error: null,
      };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error };
    default:
      return state;
  }
};

const Provider = ({ children, persistKey = "auth" }) => {
  const [auth, dispatch] = React.useReducer(
    reducer,
    getInitialState(persistKey)
  );

  const login = (payload, cb) => {
    dispatch({ type: "LOGIN_REQUEST" });
    API.auth
      .login(payload)
      .then(({ success, user, token, message, error }) => {
        if (success) {
          localStorage.setItem(persistKey, JSON.stringify({ user, token }));
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token },
          });
        } else {
          dispatch({ type: "LOGIN_ERROR", error: message || error });
        }
      })
      .catch((e) => {
        console.error(e.response.data.message);
        dispatch({ type: "LOGIN_ERROR", error: e.response.data.message });
      })
      .finally(() => cb && cb());
  };

  const logout = (cb) => {
    API.auth
      .logout()
      .then(({ success }) => {
        if (success) {
          localStorage.clear();
          dispatch({ type: "LOGOUT_SUCCESS" });
        } else {
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => cb && cb());
  };

  return (
    <Context.Provider value={{ auth, login, logout }}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.any,
  persistKey: PropTypes.string,
};

export default Provider;
