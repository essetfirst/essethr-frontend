import React from "react";

import { useSnackbar } from "notistack";

import { Grid } from "@material-ui/core";

import API from "../../../api";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import useAuth from "../../../providers/auth";
import useNotificationSnackbar from "../../../providers/notification-snackbar";

import PageView from "../../../components/PageView";

import Profile from "./Profile";
import ProfileDetails from "./ProfileDetails";

const initialValues = {
  user: null,
  isLoading: false,
  error: null,
};

const getInitialState = (user) => ({ ...initialValues, user });

const types = {
  ACCOUNT_EDIT_REQUEST: "ACCOUNT_EDIT_REQUEST",
  ACCOUNT_EDIT_SUCCESS: "ACCOUNT_EDIT_SUCCESS",
  ACCOUNT_EDIT_FAILURE: "ACCOUNT_EDIT_FAILURE",
};
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.ACCOUNT_EDIT_REQUEST:
      return { ...state, isLoading: true, error: null };
    case types.ACCOUNT_EDIT_SUCCESS:
      return { ...state, isLoading: false, user: payload };
    case types.ACCOUNT_EDIT_FAILURE:
      return { ...state, isLoading: false, error };
    default:
      return state;
  }
};

const Account = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { notificationSnackbar } = useNotificationSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  const { auth } = useAuth();
  const [state, dispatch] = React.useReducer(
    reducer,
    getInitialState(auth.user)
  );

  const handleUpdateAccount = (accountInfo) => {
    dispatch({ type: types.ACCOUNT_EDIT_REQUEST });
    API.users
      .editById(accountInfo._id, accountInfo)
      .then(({ success, user, error }) => {
        if (success) {
          dispatch({ type: types.ACCOUNT_EDIT_SUCCESS, payload: user });
          notify({ success, message: "User account updated", error });
          return true;
        } else {
          dispatch({ type: types.ACCOUNT_EDIT_FAILURE, error });
          notify({ success: false, error });
          return false;
        }
      })
      .catch((e) => {
        const error =
          String(e).includes("Unexpected token P") ||
          String(e).includes("JSON.parse") ||
          String(e).includes("NetworkError")
            ? "Something went wrong. Please check connection and retry."
            : String(e);
        dispatch({
          type: types.ACCOUNT_EDIT_FAILURE,
          error,
        });
        notify({ success: false, error, severe: true });
        return false;
      });
  };

  const handleUploadImage = (image) => {
    dispatch({ type: types.ACCOUNT_EDIT_REQUEST });
    API.users
      .uploadImage(image)
      .then(({ success, user, error }) => {
        if (success) {
          dispatch({ type: types.ACCOUNT_EDIT_SUCCESS, payload: user });
          notify({ success, message: "User account updated", error });
          return true;
        } else {
          dispatch({ type: types.ACCOUNT_EDIT_FAILURE, error });
          notify({ success: false, error });
          return false;
        }
      })
      .catch((e) => {
        const error =
          String(e).includes("Unexpected token P") ||
          String(e).includes("JSON.parse") ||
          String(e).includes("NetworkError")
            ? "Something went wrong. Please check connection and retry."
            : String(e);
        dispatch({
          type: types.ACCOUNT_EDIT_FAILURE,
          error,
        });
        notify({ success: false, error, severe: true });
        return false;
      });
  };

  return (
    <React.Fragment>
      <PageView
        title="Account"
        icon={
          <span style={{ verticalAlign: "middle" }}>
            <AccountBoxIcon fontSize="large" />
          </span>
        }
      >
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <Profile user={state.user} onUploadImage={handleUploadImage} />
          </Grid>
          <Grid item lg={8} md={6} xs={12}>
            <ProfileDetails
              isUpdating={state.isLoading}
              user={state.user}
              onUpdateAccount={handleUpdateAccount}
            />
          </Grid>
        </Grid>
      </PageView>
    </React.Fragment>
  );
};

export default Account;
