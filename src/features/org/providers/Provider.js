import React from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";

import API from "api";

import useAuth from "features/auth/providers";
import { orgQueryKey } from "hooks/queries/useOrgQuery";

import Context from "./Context";

import types from "./types";
import { reducer, initialState } from "./reducer";

const Provider = ({ persistKey = "org", children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const fetchOrg = React.useCallback(
    async (currentOrg) => {
      if (!currentOrg) return;
      dispatch({ type: types.REQUESTING });
      try {
        const org = await queryClient.fetchQuery({
          queryKey: orgQueryKey(currentOrg),
          queryFn: async () => {
            const res = await API.orgs.getById(currentOrg);
            if (!res?.success) {
              throw new Error(res?.error || "Failed to load organization");
            }
            return res.org;
          },
          staleTime: 60_000,
        });
        dispatch({ type: types.SET_CURRENT_ORG, payload: org._id });
        dispatch({ type: types.SET_ORG, payload: org });
      } catch (e) {
        console.error(e.message);
        dispatch({ type: types.REQUEST_FAILURE, error: e.message });
      }
    },
    [queryClient],
  );

  // React.useEffect(() => {
  //   readOrg();
  //   fetchOrg(state.currentOrg);
  //   return () => saveOrg();
  // }, [state, readOrg, saveOrg]);

  React.useEffect(() => {
    if (auth && auth.user && auth.token) {
      let initialOrg = auth.user.org;
      try {
        const stored = localStorage.getItem(persistKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (typeof parsed === "string" && parsed) {
            initialOrg = parsed;
          }
        }
      } catch (e) {
        console.warn(e);
      }
      fetchOrg(initialOrg);
    }
  }, [auth, fetchOrg, persistKey]);

  React.useEffect(() => {
    if (state.currentOrg) {
      fetchOrg(state.currentOrg);
    }
  }, [state.currentOrg, fetchOrg]);

  React.useEffect(() => {
    try {
      // If user is of role ADMIN then last time he chose as org has to be saved
      localStorage.setItem(persistKey, JSON.stringify(state.currentOrg));
    } catch (e) {
      console.warn(e);
    }
  }, [state.currentOrg, persistKey]);

  const setRequesting = () => {
    dispatch({ type: types.REQUESTING });
  };
  const requestSuccess = () => {
    dispatch({ type: types.REQUEST_SUCCESS });
  };
  const requestFailure = (error) => {
    dispatch({ type: types.REQUEST_FAILURE, error });
  };

  const setCurrentOrg = (org) => {
    dispatch({ type: types.SET_CURRENT_ORG, payload: org });
  };
  const setOrg = (org) => {
    dispatch({ type: types.SET_ORG, payload: org });
  };
  const updateOrg = (org) => {
    dispatch({ type: types.UPDATE_ORG, payload: org });
  };

  /*************** Employee handlers *********************************/
  const addEmployee = (employeeInfo) => {
    dispatch({ type: types.ADD_EMPLOYEE, payload: employeeInfo });
  };
  const updateEmployee = (employeeInfo) => {
    dispatch({ type: types.UPDATE_EMPLOYEE, payload: employeeInfo });
  };
  const deleteEmployee = (employeeId) => {
    dispatch({ type: types.DELETE_EMPLOYEE, payload: employeeId });
  };

  /*************** Department handlers *********************************/
  const addDepartment = (deptInfo) => {
    dispatch({ type: types.ADD_DEPARTMENT, payload: deptInfo });
  };
  const updateDepartment = (deptInfo) => {
    dispatch({ type: types.UPDATE_DEPARTMENT, payload: deptInfo });
  };
  const deleteDepartment = (deptId) => {
    dispatch({ type: types.DELETE_DEPARTMENT, payload: deptId });
  };

  /*************** Position handlers *********************************/
  const addPosition = (positionInfo) => {
    dispatch({ type: types.ADD_POSITION, payload: positionInfo });
  };
  const updatePosition = (positionInfo) => {
    dispatch({ type: types.UPDATE_POSITION, payload: positionInfo });
  };
  const deletePosition = (positionId) => {
    dispatch({ type: types.DELETE_POSITION, payload: positionId });
  };

  /*************** Attendance policyy handlers *********************************/
  const updateAttendancePolicy = (attendancePolicyInfo) => {
    dispatch({
      type: types.UPDATE_ATTENDANCE_POLICY,
      payload: attendancePolicyInfo,
    });
  };

  const resetAttendancePolicy = () => {
    dispatch({ type: types.RESET_ATTENDANCE_POLICY });
  };

  /*************** Leave Type handlers *********************************/
  const addLeaveType = (leaveTypeInfo) => {
    dispatch({ type: types.ADD_LEAVE_TYPE, payload: leaveTypeInfo });
  };
  const updateLeaveType = (leaveTypeInfo) => {
    dispatch({ type: types.UPDATE_LEAVE_TYPE, payload: leaveTypeInfo });
  };
  const deleteLeaveType = (leaveTypeId) => {
    dispatch({ type: types.DELETE_LEAVE_TYPE, payload: leaveTypeId });
  };

  /*************** Leave Type handlers *********************************/
  const addHoliday = (holidayInfo) => {
    dispatch({ type: types.ADD_HOLIDAY, payload: holidayInfo });
  };
  const updateHoliday = (holidayInfo) => {
    dispatch({ type: types.UPDATE_HOLIDAY, payload: holidayInfo });
  };
  const deleteHoliday = (holidayId) => {
    dispatch({ type: types.DELETE_HOLIDAY, payload: holidayId });
  };
  return (
    <Context.Provider
      value={{
        ...state,

        setRequesting,
        requestSuccess,
        requestFailure,

        setCurrentOrg,

        fetchOrg,
        setOrg,
        updateOrg,

        addEmployee,
        updateEmployee,
        deleteEmployee,

        addDepartment,
        updateDepartment,
        deleteDepartment,

        addPosition,
        updatePosition,
        deletePosition,

        updateAttendancePolicy,
        resetAttendancePolicy,

        addLeaveType,
        updateLeaveType,
        deleteLeaveType,

        addHoliday,
        updateHoliday,
        deleteHoliday,
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
