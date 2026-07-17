import types from "./types";

export const initialState = {
  org: {},
  currentOrg: "",
  requesting: false,
  error: null,
};

export const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, requesting: true, error: null };
    case types.REQUEST_SUCCESS:
      return { ...state, requesting: false, error: null };
    case types.REQUEST_FAILURE:
      return { ...state, requesting: false, error: error };
    case types.SET_CURRENT_ORG:
      return {
        ...state,
        currentOrg: payload,

        requesting: false,
        error: null,
      };
    case types.SET_ORG:
      return {
        ...state,
        org: { ...payload },
        requesting: false,
        error: null,
      };
    case types.UPDATE_ORG:
      return {
        ...state,
        org: { ...state.org, ...payload },
        requesting: false,
        error: null,
      };

    /******* Employees state ************************/
    case types.ADD_EMPLOYEE:
      return {
        ...state,
        org: { ...state.org, employees: [...state.org.employees, payload] },
        requesting: false,
        error: null,
      };
    case types.UPDATE_EMPLOYEE:
      var eIndex = state.org.employees.findIndex((v) => v._id === payload._id);
      return {
        ...state,
        org: {
          ...state.org,
          employees:
            eIndex !== -1
              ? [
                  ...state.org.employees.slice(0, eIndex),
                  { ...(state.org.employees[eIndex] || {}), ...payload },
                  ...state.org.employees.slice(eIndex + 1),
                ]
              : state.org.employees,
        },
        requesting: false,
        error: null,
      };
    case types.DELETE_EMPLOYEE:
      eIndex = state.org.employees.findIndex((d) => d._id === payload);
      return {
        ...state,
        org: {
          ...state.org,
          employees:
            eIndex !== -1
              ? [
                  ...state.org.employees.slice(0, eIndex),
                  ...state.org.employees.slice(eIndex + 1),
                ]
              : state.org.employees,
        },
        requesting: false,
        error: null,
      };

    /******* Departments state ************************/
    case types.ADD_DEPARTMENT:
      return {
        ...state,
        org: { ...state.org, departments: [...state.org.departments, payload] },
        requesting: false,
        error: null,
      };

    case types.UPDATE_DEPARTMENT:
      var dIndex = state.org.departments.findIndex(
        (v) => v._id === payload._id
      );
      return {
        ...state,
        org: {
          ...state.org,
          departments:
            dIndex !== -1
              ? [
                  ...state.org.departments.slice(0, dIndex),
                  { ...(state.org.departments[dIndex] || {}), ...payload },
                  ...state.org.departments.slice(dIndex + 1),
                ]
              : state.org.departments,
        },
        requesting: false,
        error: null,
      };

    case types.DELETE_DEPARTMENT:
      dIndex = state.org.departments.findIndex((d) => d._id === payload);
      return {
        ...state,
        org: {
          ...state.org,
          departments:
            dIndex !== -1
              ? [
                  ...state.org.departments.slice(0, dIndex),
                  ...state.org.departments.slice(dIndex + 1),
                ]
              : state.org.departments,
        },
        requesting: false,
        error: null,
      };

    /******* Positions state ************************/
    case types.ADD_POSITION:
      return {
        ...state,
        org: { ...state.org, positions: [...state.org.positions, payload] },
        requesting: false,
        error: null,
      };

    case types.UPDATE_POSITION:
      var pIndex = state.org.positions.findIndex((v) => v._id === payload._id);
      return {
        ...state,
        org: {
          ...state.org,
          positions:
            pIndex !== -1
              ? [
                  ...state.org.positions.slice(0, pIndex),
                  { ...(state.org.positions[pIndex] || {}), ...payload },
                  ...state.org.positions.slice(pIndex + 1),
                ]
              : state.org.positions,
        },
        requesting: false,
        error: null,
      };

    case types.DELETE_POSITION:
      pIndex = state.org.positions.findIndex((v) => v._id === payload);
      return {
        ...state,
        org: {
          ...state.org,
          positions:
            pIndex !== -1
              ? [
                  ...state.org.positions.slice(0, pIndex),
                  ...state.org.positions.slice(pIndex + 1),
                ]
              : state.org.positions,
        },
        requesting: false,
        error: null,
      };

    /******* Attendance rule state ************************/
    case types.UPDATE_ATTENDANCE_POLICY:
      return {
        ...state,
        org: {
          ...state.org,
          attendancePolicy: {
            ...state.org.attendancePolicy,
            ...payload,
          },
        },
        requesting: false,
        error: null,
      };
    case types.RESET_ATTENDANCE_POLICY:
      return {
        ...state,
        org: {
          ...state.org,
          attendancePolicy: {
            ...[1, 2, 3, 4, 5, 6]
              .map((day) => ({
                [day]: {
                  workStartTime: "08:30",
                  breakStartTime: "12:00",
                  breakEndTime: "13:30",
                  workEndTime: "17:30",
                  workDuration: 8,
                  breakDuration: 1.5,
                },
              }))
              .reduce((prev, next) => Object.assign({}, prev, next), {}),
          },
        },
        requesting: false,
        error: null,
      };

    /******* Leave types state ************************/
    case types.ADD_LEAVE_TYPE:
      return {
        ...state,
        org: { ...state.org, leaveTypes: [...state.org.leaveTypes, payload] },
        requesting: false,
        error: null,
      };

    case types.UPDATE_LEAVE_TYPE:
      var ltIndex = state.org.leaveTypes.findIndex(
        (v) => v._id === payload._id
      );
      return {
        ...state,
        org: {
          ...state.org,
          leaveTypes:
            ltIndex !== -1
              ? [
                  ...state.org.leaveTypes.slice(0, ltIndex),
                  { ...(state.org.leaveTypes[ltIndex] || {}), ...payload },
                  ...state.org.leaveTypes.slice(ltIndex + 1),
                ]
              : state.org.leaveTypes,
        },
        requesting: false,
        error: null,
      };

    case types.DELETE_LEAVE_TYPE:
      ltIndex = state.org.leaveTypes.findIndex((v) => v._id === payload);
      return {
        ...state,
        org: {
          ...state.org,
          leaveTypes:
            ltIndex !== -1
              ? [
                  ...state.org.leaveTypes.slice(0, ltIndex),
                  ...state.org.leaveTypes.slice(ltIndex + 1),
                ]
              : state.org.leaveTypes,
        },
        requesting: false,
        error: null,
      };

    /******* Holidays state ************************/
    case types.ADD_HOLIDAY:
      return {
        ...state,
        org: { ...state.org, holidays: [...state.org.holidays, payload] },
        requesting: false,
        error: null,
      };

    case types.UPDATE_HOLIDAY:
      var hIndex = state.org.holidays.findIndex((v) => v._id === payload._id);
      return {
        ...state,
        org: {
          ...state.org,
          holidays:
            hIndex !== -1
              ? [
                  ...state.org.holidays.slice(0, hIndex),
                  { ...(state.org.holidays[hIndex] || {}), ...payload },
                  ...state.org.holidays.slice(hIndex + 1),
                ]
              : state.org.holidays,
        },
        requesting: false,
        error: null,
      };

    case types.DELETE_HOLIDAY:
      hIndex = state.org.holidays.findIndex((v) => v._id === payload);
      return {
        ...state,
        org: {
          ...state.org,
          holidays:
            hIndex !== -1
              ? [
                  ...state.org.holidays.slice(0, hIndex),
                  ...state.org.holidays.slice(hIndex + 1),
                ]
              : state.org.holidays,
        },
        requesting: false,
        error: null,
      };

    default:
      return state;
  }
};
