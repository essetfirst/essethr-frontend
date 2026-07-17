/* eslint-disable default-case */
import React from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { combineReducers } from "providers";
import API from "api";
import categorizeError from "helpers/categorize-error";
import { leavesQueryKey } from "hooks/queries/useLeavesQuery";
import useOrg from "features/org/providers";
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
  registerLeave: { isLoading: false, message: "", error: "" },
  approveLeaves: { isLoading: false, message: "", error: "" },
  updateLeave: { isLoading: false, message: "", error: "" },
  deleteLeave: { isLoading: false, message: "", error: "" },
  deleteLeaveBalance: { isLoading: false, message: "", error: "" },
};

function sliceReducer(cases) {
  return (state, action) => {
    const handler = cases[action.type];
    return handler ? handler(state, action) : state;
  };
}

const reducer = combineReducers({
  fetchLeaves: sliceReducer({
    [types.FETCH_LEAVES_REQUEST]: (s) => ({ ...s, isLoading: true, error: "" }),
    [types.FETCH_LEAVES_SUCCESS]: (s, { payload }) => ({
      ...s,
      isLoading: false,
      leaves: payload,
    }),
    [types.FETCH_LEAVES_FAILURE]: (s, { error }) => ({
      ...s,
      isLoading: false,
      error,
    }),
  }),
  fetchLeaveAllowances: sliceReducer({
    [types.FETCH_LEAVE_ALLOWANCES_REQUEST]: (s) => ({ ...s, isLoading: true, error: "" }),
    [types.FETCH_LEAVE_ALLOWANCES_SUCCESS]: (s, { payload }) => ({
      ...s,
      isLoading: false,
      allowances: payload,
    }),
    [types.FETCH_LEAVE_ALLOWANCES_FAILURE]: (s, { error }) => ({
      ...s,
      isLoading: false,
      error,
    }),
  }),
  registerLeave: sliceReducer({
    [types.REGISTER_LEAVE_REQUEST]: (s) => ({ ...s, isLoading: true, error: "", message: "" }),
    [types.REGISTER_LEAVE_SUCCESS]: (s, { message }) => ({
      ...s,
      isLoading: false,
      message,
    }),
    [types.REGISTER_LEAVE_FAILURE]: (s, { error }) => ({
      ...s,
      isLoading: false,
      error,
    }),
  }),
  approveLeaves: sliceReducer({
    [types.APPROVE_LEAVES_REQUEST]: (s) => ({ ...s, isLoading: true, error: "", message: "" }),
    [types.APPROVE_LEAVES_SUCCESS]: (s, { message }) => ({
      ...s,
      isLoading: false,
      message,
    }),
    [types.APPROVE_LEAVES_FAILURE]: (s, { error }) => ({
      ...s,
      isLoading: false,
      error,
    }),
  }),
  updateLeave: sliceReducer({
    [types.UPDATE_LEAVE_REQUEST]: (s) => ({ ...s, isLoading: true, error: "", message: "" }),
    [types.UPDATE_LEAVE_SUCCESS]: (s, { message }) => ({
      ...s,
      isLoading: false,
      message,
    }),
    [types.UPDATE_LEAVE_FAILURE]: (s, { error }) => ({
      ...s,
      isLoading: false,
      error,
    }),
  }),
  deleteLeave: sliceReducer({
    [types.DELETE_LEAVE_REQUEST]: (s) => ({ ...s, isLoading: true, error: "", message: "" }),
    [types.DELETE_LEAVE_SUCCESS]: (s, { message }) => ({
      ...s,
      isLoading: false,
      message,
    }),
    [types.DELETE_LEAVE_FAILURE]: (s, { error }) => ({
      ...s,
      isLoading: false,
      error,
    }),
  }),
  deleteLeaveBalance: sliceReducer({
    [types.DELETE_LEAVE_ALLOWANCES_REQUEST]: (s) => ({ ...s, isLoading: true, error: "", message: "" }),
    [types.DELETE_LEAVE_ALLOWANCES_SUCCESS]: (s, { message }) => ({
      ...s,
      isLoading: false,
      message,
    }),
    [types.DELETE_LEAVE_ALLOWANCES_FAILURE]: (s, { error }) => ({
      ...s,
      isLoading: false,
      error,
    }),
  }),
});

const Provider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const { currentOrg } = useOrg();

  const invalidateLeaves = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["leaves"] });
  }, [queryClient]);

  const fetchLeaves = React.useCallback((startDate, endDate) => {
    dispatch({ type: types.FETCH_LEAVES_REQUEST });
    const query = {};
    if (startDate) query.from = startDate;
    if (endDate) query.to = endDate;
    API.leaves
      .getAll({ query })
      .then(({ success, leaves, error }) => {
        if (success) {
          dispatch({ type: types.FETCH_LEAVES_SUCCESS, payload: leaves || [] });
          queryClient.setQueryData(leavesQueryKey(currentOrg), leaves || []);
        } else {
          dispatch({ type: types.FETCH_LEAVES_FAILURE, error: error || "Failed" });
        }
      })
      .catch((e) => {
        dispatch({
          type: types.FETCH_LEAVES_FAILURE,
          error: categorizeError(e),
        });
      });
  }, [currentOrg, queryClient]);

  const fetchLeaveAllowances = React.useCallback(() => {
    dispatch({ type: types.FETCH_LEAVE_ALLOWANCES_REQUEST });
    API.leaves.allowances
      .getAll()
      .then(({ success, allowances, error }) => {
        if (success) {
          dispatch({
            type: types.FETCH_LEAVE_ALLOWANCES_SUCCESS,
            payload: allowances || [],
          });
        } else {
          dispatch({
            type: types.FETCH_LEAVE_ALLOWANCES_FAILURE,
            error: error || "Failed",
          });
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
          dispatch({ type: types.REGISTER_LEAVE_SUCCESS, message });
          invalidateLeaves();
          fetchLeaves();
          notify({ message: message || "Leave registered." });
        } else {
          dispatch({ type: types.REGISTER_LEAVE_FAILURE, error });
          notify({ message: error, variant: "error" });
        }
      })
      .catch((e) => {
        const err = categorizeError(e);
        dispatch({ type: types.REGISTER_LEAVE_FAILURE, error: err });
        notify({ message: err, variant: "error" });
      });
  };

  const approveLeaves = (notify) => (leaveIds) => {
    dispatch({ type: types.APPROVE_LEAVES_REQUEST });
    API.leaves
      .approve(leaveIds)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({ type: types.APPROVE_LEAVES_SUCCESS, message });
          invalidateLeaves();
          fetchLeaves();
          notify({ message: message || "Leaves approved." });
        } else {
          dispatch({ type: types.APPROVE_LEAVES_FAILURE, error });
          notify({ message: error, variant: "error" });
        }
      })
      .catch((e) => {
        const err = categorizeError(e);
        dispatch({ type: types.APPROVE_LEAVES_FAILURE, error: err });
        notify({ message: err, variant: "error" });
      });
  };

  const rejectLeaves = (notify) => (leaveIds) => {
    dispatch({ type: types.APPROVE_LEAVES_REQUEST });
    API.leaves
      .reject(leaveIds)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({ type: types.APPROVE_LEAVES_SUCCESS, message });
          invalidateLeaves();
          fetchLeaves();
          notify({ message: message || "Leaves rejected." });
        } else {
          dispatch({ type: types.APPROVE_LEAVES_FAILURE, error });
          notify({ message: error, variant: "error" });
        }
      })
      .catch((e) => {
        const err = categorizeError(e);
        dispatch({ type: types.APPROVE_LEAVES_FAILURE, error: err });
        notify({ message: err, variant: "error" });
      });
  };

  const updateLeave = (notify) => (leaveId, leaveUpdate) => {
    dispatch({ type: types.UPDATE_LEAVE_REQUEST });
    API.leaves
      .updateById(leaveId, leaveUpdate)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({ type: types.UPDATE_LEAVE_SUCCESS, message });
          invalidateLeaves();
          fetchLeaves();
          notify({ message: message || "Leave updated." });
        } else {
          dispatch({ type: types.UPDATE_LEAVE_FAILURE, error });
          notify({ message: error, variant: "error" });
        }
      })
      .catch((e) => {
        const err = categorizeError(e);
        dispatch({ type: types.UPDATE_LEAVE_FAILURE, error: err });
        notify({ message: err, variant: "error" });
      });
  };

  const deleteLeave = (notify) => (leaveId) => {
    dispatch({ type: types.DELETE_LEAVE_REQUEST });
    API.leaves
      .deleteById(leaveId)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({ type: types.DELETE_LEAVE_SUCCESS, message });
          invalidateLeaves();
          fetchLeaves();
          notify({ message: message || "Leave deleted." });
        } else {
          dispatch({ type: types.DELETE_LEAVE_FAILURE, error });
          notify({ message: error, variant: "error" });
        }
      })
      .catch((e) => {
        const err = categorizeError(e);
        dispatch({ type: types.DELETE_LEAVE_FAILURE, error: err });
        notify({ message: err, variant: "error" });
      });
  };

  const deleteLeaveBalance = (notify) => (allowanceId) => {
    dispatch({ type: types.DELETE_LEAVE_ALLOWANCES_REQUEST });
    API.leaves.allowances
      .deleteById(allowanceId)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({ type: types.DELETE_LEAVE_ALLOWANCES_SUCCESS, message });
          fetchLeaveAllowances();
          notify({ message: message || "Allowance deleted." });
        } else {
          dispatch({ type: types.DELETE_LEAVE_ALLOWANCES_FAILURE, error });
          notify({ message: error, variant: "error" });
        }
      })
      .catch((e) => {
        const err = categorizeError(e);
        dispatch({ type: types.DELETE_LEAVE_ALLOWANCES_FAILURE, error: err });
        notify({ message: err, variant: "error" });
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
        rejectLeaves,
        updateLeave,
        deleteLeave,
        deleteLeaveBalance,
      }}
    >
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.any,
};

export default Provider;
