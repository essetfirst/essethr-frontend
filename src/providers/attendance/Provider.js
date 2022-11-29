import React from "react";

import API from "../../api";

import useOrg from "../org";

import arrayToMap from "../../utils/arrayToMap";

import categorizeError from "../../helpers/categorize-error";
import getWeekDates from "../../helpers/get-week-dates";

import Context from "./Context";

const getDateString = (date) => {
  return new Date(date ? date : new Date()).toISOString().slice(0, 10);
};

const types = {
  FETCH_ATTENDANCE_REQUEST: "FETCH_ATTENDANCE_REQUEST",
  FETCH_ATTENDANCE_SUCCESS: "FETCH_ATTENDANCE_SUCCESS",
  FETCH_ATTENDANCE_FAILURE: "FETCH_ATTENDANCE_FAILURE",
};
const initialState = {
  isLoading: false,
  attendanceByDate: {},
  error: null,
};

const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.FETCH_ATTENDANCE_REQUEST:
      return { ...state, isLoading: true, error: null };
    case types.FETCH_ATTENDANCE_SUCCESS:
      return {
        ...state,
        attendanceByDate: {
          ...state.attendanceByDate,
          ...(Array.isArray(payload)
            ? arrayToMap(payload, "date")
            : typeof payload === "object"
            ? payload
            : {}),
        },
        isLoading: false,
        error: null,
      };
    case types.FETCH_ATTENDANCE_FAILURE:
      return { ...state, isLoading: false, error };
    default:
      return state;
  }
};

const Provider = ({ children }) => {
  const { currentOrg } = useOrg();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const fetchAttendance = React.useCallback(
    (fromDate, toDate, attendanceDate = new Date()) => {
      const isToday =
        new Date(attendanceDate).toLocaleDateString() ===
        new Date().toLocaleDateString();
      if (
        !isToday &&
        state.attendanceByDate &&
        state.attendanceByDate[attendanceDate]
      ) {
        return;
      }
      const weekDates = getWeekDates(attendanceDate);
      const from = getDateString(weekDates[0]);
      const to = getDateString(weekDates[weekDates.length - 1]);
      dispatch({ type: types.FETCH_ATTENDANCE_REQUEST });
      API.attendance
        .getAttendance({
          query: {
            from: fromDate || from,
            to: toDate || to,
          },
        })
        .then(({ success, attendance, error }) => {
          if (success) {
            dispatch({
              type: types.FETCH_ATTENDANCE_SUCCESS,
              payload: attendance,
            });
          } else {
            dispatch({ type: types.FETCH_ATTENDANCE_FAILURE, error });
          }
        })
        .catch((e) => {
          dispatch({
            type: types.FETCH_ATTENDANCE_FAILURE,
            error: categorizeError(e),
          });
        });
    },
    [currentOrg]
  );

  const approveAttendance = (employees, date, notify) => {
    API.attendance
      .approveAttendance({ employees, date })
      .then(({ success, message, error }) => {
        notify({ success, message, error });
        fetchAttendance(date, date);
      })
      .catch((e) => {
        // console.error(e);
        // Show notification of failure
        notify({
          severe: true,
          error: categorizeError(e),
          retry: () => approveAttendance(employees, date, notify),
        });
      });
  };

  React.useEffect(() => {
    //
  }, []);

  return (
    <Context.Provider value={{ state, fetchAttendance, approveAttendance }}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
