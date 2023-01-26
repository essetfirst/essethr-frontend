/* eslint-disable default-case */
import React from "react";
import { combineReducers } from "..";
import API from "../../api";
import categorizeError from "../../helpers/categorize-error";
import Context from "./Context";

const types = {
  FETCH_LEAVES_REQUEST: "FETCH_LEAVES_REQUEST",
  FETCH_LEAVES_SUCCESS: "FETCH_LEAVES_SUCCESS",
  FETCH_LEAVES_FAILURE: "FETCH_LEAVES_FAILURE",

  FETCH_LEAVE_ALLOWANCES_REQUEST: "FETCH_LEAVE_ALLOWANCES_REQUEST",
  FETCH_LEAVE_ALLOWANCES_SUCCESS: "FETCH_LEAVE_ALLOWANCES_SUCCESS",
  FETCH_LEAVE_ALLOWANCES_FAILURE: "FETCH_LEAVE_ALLOWANCES_FAILURE",

  DELETE_LEAVE_ALLOWANCES_REQUEST: "DELETE_LEAVE_ALLOWANCES_REQUEST",
  DELETE_LEAVE_ALLOWANCES_SUCCESS: "DELETE_LEAVE_ALLOWANCES_SUCCESS",
  DELETE_LEAVE_ALLOWANCES_FAILURE: "DELETE_LEAVE_ALLOWANCES_FAILURE",

  REGISTER_LEAVE_REQUEST: "REGISTER_LEAVE_REQUEST",
  REGISTER_LEAVE_SUCCESS: "REGISTER_LEAVE_SUCCESS",
  REGISTER_LEAVE_FAILURE: "REGISTER_LEAVE_FAILURE",

  APPROVE_LEAVES_REQUEST: "APPROVE_LEAVES_REQUEST",
  APPROVE_LEAVES_SUCCESS: "APPROVE_LEAVES_SUCCESS",
  APPROVE_LEAVES_FAILURE: "APPROVE_LEAVES_FAILURE",

  UPDATE_LEAVE_REQUEST: "UPDATE_LEAVE_REQUEST",
  UPDATE_LEAVE_SUCCESS: "UPDATE_LEAVE_SUCCESS",
  UPDATE_LEAVE_FAILURE: "UPDATE_LEAVE_FAILURE",

  DELETE_LEAVE_REQUEST: "DELETE_LEAVE_REQUEST",
  DELETE_LEAVE_SUCCESS: "DELETE_LEAVE_SUCCESS",
  DELETE_LEAVE_FAILURE: "DELETE_LEAVE_FAILURE",
};

const initialState = {
  fetchLeaves: { leaves: [], isLoading: false, error: "" },
  fetchLeaveAllowances: { allowances: [], isLoading: false, error: "" },
  registerLeave: {
    isLoading: false,
    message: "",
    error: "",
  },

  approveLeaves: {
    isLoading: false,
    message: "",
    error: "",
  },

  updateLeave: {
    isLoading: false,
    message: "",
    error: "",
  },
  deleteLeave: {
    isLoading: false,
    message: "",
    error: "",
  },

  deleteLeaveBalance: {
    isLoading: false,
    message: "",
    error: "",
  },
};

const fetchLeavesReducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.FETCH_LEAVES_REQUEST:
      return { ...state, isLoading: true, error: "" };
    case types.FETCH_LEAVES_SUCCESS:
      return { ...state, isLoading: false, leaves: payload };
    case types.FETCH_LEAVES_FAILURE:
      return { ...state, isLoading: false, error };
  }
};
const fetchAllowancesReducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.FETCH_LEAVE_ALLOWANCES_REQUEST:
      return { ...state, isLoading: true, error: "" };
    case types.FETCH_LEAVE_ALLOWANCES_SUCCESS:
      return { ...state, isLoading: false, allowances: payload };
    case types.FETCH_LEAVE_ALLOWANCES_FAILURE:
      return { ...state, isLoading: false, error };
  }
};

const allowancesDeleteReducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.DELETE_LEAVE_ALLOWANCES_REQUEST:
      return { ...state, isLoading: true, error: "" };
    case types.DELETE_LEAVE_ALLOWANCES_SUCCESS:
      return { ...state, isLoading: false, message: payload.message };
    case types.DELETE_LEAVE_ALLOWANCES_FAILURE:
      return { ...state, isLoading: false, error };
  }
};

const registerLeaveReducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REGISTER_LEAVE_REQUEST:
      return { ...state, isLoading: true, error: "" };
    case types.REGISTER_LEAVE_SUCCESS:
      return { ...state, isLoading: false, message: payload };
    case types.REGISTER_LEAVE_FAILURE:
      return { ...state, isLoading: false, error };
  }
};

const approveLeavesReducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.APPROVE_LEAVES_REQUEST:
      return { ...state, isLoading: true, error: "" };
    case types.APPROVE_LEAVES_SUCCESS:
      return { ...state, isLoading: false, message: payload };
    case types.APPROVE_LEAVES_FAILURE:
      return { ...state, isLoading: false, error };
  }
};

const updateLeaveReducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.UPDATE_LEAVE_REQUEST:
      return { ...state, isLoading: true, error: "" };
    case types.UPDATE_LEAVE_SUCCESS:
      return { ...state, isLoading: false, message: payload };
    case types.UPDATE_LEAVE_FAILURE:
      return { ...state, isLoading: false, error };
  }
};
const deleteLeaveReducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.DELETE_LEAVE_REQUEST:
      return { ...state, isLoading: true, error: "" };
    case types.DELETE_LEAVE_SUCCESS:
      return { ...state, isLoading: false, message: payload };
    case types.DELETE_LEAVE_FAILURE:
      return { ...state, isLoading: false, error };
  }
};

const reducer = combineReducers({
  fetchLeaves: fetchLeavesReducer,
  fetchLeaveAllowances: fetchAllowancesReducer,
  registerLeave: registerLeaveReducer,
  approveLeaves: approveLeavesReducer,
  updateLeave: updateLeaveReducer,
  deleteLeave: deleteLeaveReducer,
  allowancesDeleteReducer: allowancesDeleteReducer,
});

const Provider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const fetchLeaves = React.useCallback(() => {
    dispatch({ type: types.FETCH_LEAVES_REQUEST });
    API.leaves
      .getAll()
      .then(({ success, leaves, error }) => {
        if (success) {
          dispatch({
            type: types.FETCH_LEAVES_SUCCESS,
            payload: leaves,
            error: "",
          });
        } else {
          dispatch({ type: types.FETCH_LEAVES_FAILURE, error });
        }
      })
      .catch((e) => {
        dispatch({
          type: types.FETCH_LEAVES_FAILURE,
          error: categorizeError(e),
        });
      });
  }, []);

  const fetchLeaveAllowances = React.useCallback((fromDate, toDate) => {
    dispatch({ type: types.FETCH_LEAVE_ALLOWANCES_REQUEST });
    API.leaves.allowances
      .getAll({ query: { from: fromDate, to: toDate } })
      .then(({ success, allowances, error }) => {
        if (success) {
          dispatch({
            type: types.FETCH_LEAVE_ALLOWANCES_SUCCESS,
            payload: allowances,
          });
        } else {
          dispatch({ type: types.FETCH_LEAVE_ALLOWANCES_FAILURE, error });
        }
      })
      .catch((e) => {
        dispatch({
          type: types.FETCH_LEAVE_ALLOWANCES_FAILURE,
          error: categorizeError(e),
        });
      });
  }, []);

  const addLeave = (notify) => (leaveInfo) => {
    dispatch({ type: types.REGISTER_LEAVE_REQUEST });
    API.leaves
      .add(leaveInfo)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({
            ...state,
            type: types.REGISTER_LEAVE_SUCCESS,
            payload: message,
          });
          notify({ success: true, message });
          fetchLeaves();
        } else {
          dispatch({ type: types.REGISTER_LEAVE_FAILURE, error });
          notify({ success: false, error });
        }
      })
      .catch((e) => {
        console.log(e.response.data.error);
        dispatch({ type: types.REGISTER_LEAVE_FAILURE, error: String(e) });
        notify({ success: false, error: e.response.data.error });
      });
  };

  const approveLeaves = (notify) => (leaveIds) => {
    dispatch({ type: types.APPROVE_LEAVES_REQUEST });
    API.leaves
      .approve(leaveIds)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({
            type: types.APPROVE_LEAVES_SUCCESS,
            payload: message,
          });
          fetchLeaves();
        } else {
          dispatch({ type: types.APPROVE_LEAVES_FAILURE, error });
        }
        notify({ success, message, error });
      })
      .catch((e) => {
        const error = String(e);
        dispatch({ type: types.APPROVE_LEAVES_FAILURE, error });
        notify({ success: false, error: categorizeError(e) });
      });
  };

  const updateLeave = (notify) => (leaveId, leaveInfo) => {
    dispatch({ type: types.UPDATE_LEAVE_REQUEST });
    API.leaves
      .updateById(leaveId, leaveInfo)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({
            type: types.UPDATE_LEAVE_SUCCESS,
            payload: message,
          });
          fetchLeaves();
        } else {
          dispatch({ type: types.UPDATE_LEAVE_FAILURE, error });
        }
        notify({ success, message, error });
      })
      .catch((e) => {
        const error = String(e);
        dispatch({ type: types.UPDATE_LEAVE_FAILURE, error });
        notify({ success: false, error: categorizeError(e) });
      });
  };

  const deleteLeave = (notify) => (leaveId) => {
    dispatch({ type: types.DELETE_LEAVE_REQUEST });
    API.leaves
      .deleteById(leaveId)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({
            type: types.DELETE_LEAVE_SUCCESS,
            payload: message,
          });
          fetchLeaves();
        } else {
          dispatch({ type: types.DELETE_LEAVE_FAILURE, error });
        }
        notify({ success, message, error });
      })
      .catch((e) => {
        const error = String(e);
        dispatch({ type: types.DELETE_LEAVE_FAILURE, error });
        notify({ success: false, error: categorizeError(e) });
      });
  };

  const deleteLeaveBalance = (notify) => (leaveBalanceId) => {
    dispatch({ type: types.DELETE_LEAVE_ALLOWANCES_REQUEST });
    API.leaves.allowances
      .deleteById(leaveBalanceId)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({
            type: types.DELETE_LEAVE_ALLOWANCES_SUCCESS,
            payload: message,
          });
        } else {
          dispatch({
            type: types.DELETE_LEAVE_ALLOWANCES_FAILURE,
            error,
          });
        }
        notify({ success, message, error });
      })
      .catch((e) => {
        const error = String(e);
        dispatch({
          type: types.DELETE_LEAVE_ALLOWANCES_FAILURE,
          error,
        });
        notify({ success: false, error: categorizeError(e) });
      });
  };

  return (
    <Context.Provider
      value={{
        state,
        fetchLeaves,
        fetchLeaveAllowances,
        addLeave,
        approveLeaves,
        updateLeave,
        deleteLeave,
        deleteLeaveBalance,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Provider;
