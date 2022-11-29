import React from "react";
import PropTypes from "prop-types";

import { useParams, useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  // makeStyles,
  Typography,
} from "@material-ui/core";

import {
  // EditOutlined as EditIcon,
  LocationOnOutlined as AddressIcon,
  MailOutlineOutlined as MailIcon,
  PhoneOutlined as PhoneIcon,
} from "@material-ui/icons";

import { Edit as EditIcon, ArrowDown as ArrowDownIcon } from "react-feather";

import PageView from "../../../components/PageView";
import LoadingComponent from "../../../components/LoadingComponent";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";
import TabbedComponent from "../../../components/TabbedComponent";

import API from "../../../api";

import useAuth from "../../../providers/auth";
import useOrg from "../../../providers/org";
import arrayToMap from "../../../utils/arrayToMap";

import DepartmentList from "./DepartmentList";
import PositionList from "./PositionList";
import AttendancePolicy from "./AttendancePolicy";
import LeaveTypeList from "./LeaveTypeList";
import HolidayList from "./HolidayList";
import BranchList from "./BranchList";

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_ERROR: "REQUEST_ERROR",
};
const getInitialState = (org) => ({ org, requesting: false, error: null });
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, requesting: true, error: null };
    case types.REQUEST_SUCCESS:
      return { ...state, org: payload, requesting: false, error: null };
    case types.REQUEST_ERROR:
      return { ...state, requesting: false, error };
    default:
      return state;
  }
};

const OrganizationView = ({ id }) => {
  // const classes = useStyles();
  const navigate = useNavigate();

  const params = useParams();
  const { auth } = useAuth();
  const {
    currentOrg,
    org,

    addDepartment,
    updateDepartment,
    deleteDepartment,

    addPosition,
    updatePosition,
    deletePosition,

    addLeaveType,
    updateLeaveType,
    deleteLeaveType,

    addHoliday,
    updateHoliday,
    deleteHoliday,
  } = useOrg();

  const [state, dispatch] = React.useReducer(reducer, getInitialState(org));

  const orgId = id || params.id || currentOrg;
  const fetchOrg = React.useCallback((orgId) => {
    dispatch({ type: types.REQUESTING });
    API.orgs
      .getById(orgId)
      .then(({ success, org, error }) => {
        success
          ? dispatch({ type: types.REQUEST_SUCCESS, payload: org })
          : dispatch({ type: types.REQUEST_ERROR, error });
      })
      .catch((e) => {
        console.error(e.message);
        dispatch({ type: types.REQUEST_ERROR, error: "Something went wrong." });
      });
  }, []);

  React.useEffect(() => {
    console.log("Hellooooooooooooooooooooo", org);
    if (org) {
      dispatch({ type: types.REQUEST_SUCCESS, payload: org });
    }

    if ((orgId && !org) || (org && orgId !== org._id)) {
      fetchOrg(orgId);
    }
  }, [orgId, org, fetchOrg]);

  const handleEditOrgClick = () => {
    navigate("/app/orgs/edit", orgId);
  };

  const departmentsMap = arrayToMap(
    state.org ? state.org.departments : [],
    "_id"
  );
  const positionsMap = arrayToMap(state.org ? state.org.positions : [], "_id");
  const leaveTypesMap = arrayToMap(
    state.org ? state.org.leaveTypes : [],
    "_id"
  );
  const holidaysMap = arrayToMap(state.org ? state.org.holidays : [], "_id");

  const handleCreateDepartment = (departmentInfo) => {
    // console.log("We are in createDepartment");
    // console.log(departmentInfo);
    API.orgs.departments
      .create(currentOrg, departmentInfo)
      .then(({ success, department, error }) => {
        // console.log("We are in createDepartment", department);
        success ? addDepartment(department) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleUpdateDepartment = (departmentInfo) => {
    // console.log("We are in updateDepartment");
    // console.log(departmentInfo);
    API.orgs.departments
      .editById(currentOrg, departmentInfo._id, departmentInfo)
      .then(({ success, error }) => {
        // console.log("We are in updateDepartment");
        success ? updateDepartment(departmentInfo) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleDeleteDepartment = (departmentId) => {
    // console.log(departmentId);
    API.orgs.departments
      .deleteById(currentOrg, departmentId)
      .then(({ success, error }) => {
        success ? deleteDepartment(departmentId) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleCreatePosition = (positionInfo) => {
    API.orgs.positions
      .create(currentOrg, positionInfo)
      .then(({ success, position, error }) => {
        success ? addPosition(position) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const handleUpdatePosition = (positionInfo) => {
    API.orgs.positions
      .editById(currentOrg, positionInfo._id, positionInfo)
      .then(({ success, error }) => {
        success ? updatePosition(positionInfo) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleDeletePosition = (positionId) => {
    console.log(positionId);
    API.orgs.positions
      .deleteById(currentOrg, positionId)
      .then(({ success, error }) => {
        success ? deletePosition(positionId) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleAddLeaveType = (leaveTypeInfo) => {
    // console.log("We are in addLeaveType");
    // console.log(leaveTypeInfo);
    API.orgs.leaveTypes
      .add(currentOrg, leaveTypeInfo)
      .then(({ success, leaveType, error }) => {
        // console.log("We are in addLeaveType", leaveType);
        success ? addLeaveType(leaveType) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleUpdateLeaveType = (leaveInfo) => {
    // console.log("We are in updateLeave");
    // console.log(leaveInfo);
    API.orgs.leaveTypes
      .editById(currentOrg, leaveInfo._id, leaveInfo)
      .then(({ success, error }) => {
        // console.log("We are in updateLeaveType");
        success ? updateLeaveType(leaveInfo) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleDeleteLeaveType = (leaveTypeId) => {
    // console.log(leaveTypeId);
    API.orgs.leaveTypes
      .deleteById(currentOrg, leaveTypeId)
      .then(({ success, error }) => {
        success ? deleteLeaveType(leaveTypeId) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleAddHoliday = (holidayInfo) => {
    // console.log("We are in addHoliday");
    // console.log(holidayInfo);
    API.orgs.holidays
      .add(currentOrg, holidayInfo)
      .then(({ success, holiday, error }) => {
        // console.log("We are in addholiday", holiday);
        success ? addHoliday(holiday) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleUpdateHoliday = (holidayInfo) => {
    // console.log("We are in updateHoliday");
    // console.log(leaveInfo);
    API.orgs.holidays
      .editById(currentOrg, holidayInfo._id, holidayInfo)
      .then(({ success, error }) => {
        // console.log("We are in updateHoliday");
        success ? updateHoliday(holidayInfo) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleDeleteHoliday = (holidayId) => {
    // console.log(holidayId);
    API.orgs.holidays
      .deleteById(currentOrg, holidayId)
      .then(({ success, error }) => {
        success ? deleteHoliday(holidayId) : console.error(error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <PageView
      pageTitle={"Organization"}
      // backPath={
      //   auth.user && auth.user.role === "ADMIN" ? "/app/orgs" : "/app/dashboard"
      // }
    >
      <Container>
        {state.requesting && <LoadingComponent />}
        {state.error && (
          <ErrorBoxComponent error={state.error} onRetry={() => fetchOrg()} />
        )}
        {state.org && Object.keys(state.org).length > 0 && (
          <Grid container>
            <Grid item sm={8}>
              <Typography variant="h3" color="primary">
                {`${state.org.name} (${state.org.branch})`}
              </Typography>
              <Box mt={3} />
              {[
                {
                  label: state.org.phone,
                  icon: <PhoneIcon fontSize="small" />,
                },
                { label: state.org.email, icon: <MailIcon fontSize="small" /> },
                {
                  label: state.org.address,
                  icon: <AddressIcon fontSize="small" />,
                },
              ].map(({ icon, label }, index) => (
                <Typography
                  key={index}
                  variant="subtitle1"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <Typography
                    component="span"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "10px",
                    }}
                  >
                    {icon}
                  </Typography>
                  <Typography variant="body2" component="span">
                    {label}
                  </Typography>
                </Typography>
              ))}
              <Box mb={3} />
            </Grid>
            <Grid item sm={4}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleEditOrgClick}
                  endIcon={<EditIcon />}
                  aria-label="edit org"
                  title="Edit branch details"
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditOrgClick}
                  endIcon={<ArrowDownIcon />}
                  aria-label="other actions"
                  title="Do other actions"
                  style={{ marginLeft: "16px" }}
                >
                  Actions
                </Button>
              </Box>
            </Grid>
            <Grid item sm={12}>
              <Divider />
              {currentOrg === orgId && (
                <TabbedComponent
                  key={3}
                  tabsProps={{
                    textColor: "primary",
                    indicatorColor: "primary",
                  }}
                  tabs={[
                    {
                      label: "Branches",
                      panel: <BranchList />,
                    },
                    {
                      label: "Departments",
                      panel: (
                        <DepartmentList
                          departments={state.org.departments}
                          departmentsMap={departmentsMap}
                          onCreateDepartment={handleCreateDepartment}
                          onUpdateDepartment={handleUpdateDepartment}
                          onDeleteDepartment={handleDeleteDepartment}
                        />
                      ),
                    },
                    {
                      label: "Positions",
                      panel: (
                        <PositionList
                          positions={state.org.positions}
                          positionsMap={positionsMap}
                          departmentsMap={departmentsMap}
                          onCreatePosition={handleCreatePosition}
                          onUpdatePosition={handleUpdatePosition}
                          onDeletePosition={handleDeletePosition}
                        />
                      ),
                    },
                    {
                      label: "Attendance Policy",
                      panel: (
                        <AttendancePolicy
                          orgId={state.org._id}
                          attendancePolicy={state.org.attendancePolicy}
                        />
                      ),
                    },
                    {
                      label: "Leave Types",
                      panel: (
                        <LeaveTypeList
                          leaveTypes={state.org.leaveTypes}
                          leaveTypesMap={leaveTypesMap}
                          onAddLeaveType={handleAddLeaveType}
                          onUpdateLeaveType={handleUpdateLeaveType}
                          onDeleteLeaveType={handleDeleteLeaveType}
                        />
                      ),
                    },
                    {
                      label: "Holidays",
                      panel: (
                        <HolidayList
                          holidays={state.org.holidays}
                          holidaysMap={holidaysMap}
                          onAddHoliday={handleAddHoliday}
                          onUpdateHoliday={handleUpdateHoliday}
                          onDeleteHoliday={handleDeleteHoliday}
                        />
                      ),
                    },
                  ]}
                />
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </PageView>
  );
};

OrganizationView.propTypes = {
  id: PropTypes.any,
};

export default OrganizationView;
