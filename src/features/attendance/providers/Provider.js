import React from "react";
import PropTypes from "prop-types";
import Context from "./Context";
import { useAttendanceQuery, useInvalidateAttendance } from "hooks/queries/useAttendanceQuery";
import API from "api";
import categorizeError from "helpers/categorize-error";

/** Attendance — TanStack Query with legacy Context shape. */
const Provider = ({ children }) => {
  const invalidate = useInvalidateAttendance();
  const { attendanceByDate, isLoading, error, refetch } = useAttendanceQuery({});

  const fetchAttendance = React.useCallback(
    (fromDate, toDate, attendanceDate) => {
      refetch();
    },
    [refetch],
  );

  const approveAttendance = (employees, date, notify) => {
    API.attendance
      .approveAttendance({ employees, date })
      .then(({ success, message, error: err }) => {
        if (success) {
          invalidate();
          notify({ message });
        } else {
          notify({ message: err });
        }
      })
      .catch((e) => {
        notify({ message: categorizeError(e) });
      });
  };

  const state = {
    isLoading,
    attendanceByDate,
    error,
  };

  return (
    <Context.Provider value={{ state, fetchAttendance, approveAttendance }}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.any,
};

export default Provider;
