import React from "react";
import PropTypes from "prop-types";

import { useParams, useNavigate } from "react-router-dom";
import useNotificationSnackbar from "../../../providers/notification-snackbar";
import { useSnackbar } from "notistack";
import sort from "../../../helpers/sort";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
  makeStyles,
  Avatar,
} from "@material-ui/core";

import {
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
import VerifiedUserRoundedIcon from "@material-ui/icons/VerifiedUserRounded";
import DialogDelete from "./DialogDelete";

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
const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
  },
  card: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: "100%",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#fbfbfb",
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  editButton:
    theme.direction === "rtl"
      ? {
          float: "left",
        }
      : {
          float: "right",
        },
}));

const OrganizationView = ({ id }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const params = useParams();
  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

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
  const [sortParamss, setSortParamss] = React.useState("firstName");
  const [orderDir, setOrdirDir] = React.useState("asc");
  const [tabLabel, setTabLabel] = React.useState("Departments");
  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    id: null,
  });
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
        dispatch({
          type: types.REQUEST_ERROR,
          error: "Something went wrong.",
        });
      });
  }, []);

  React.useEffect(() => {
    if (org) {
      dispatch({ type: types.REQUEST_SUCCESS, payload: org });
    }

    // if (orgId) {
    //   fetchOrg(orgId);
    // }
  }, [orgId, org, fetchOrg]);

  const handleEditOrgClick = () => {
    navigate("/app/orgs/edit", orgId);
  };

  const { departmentsMap, positionsMap, leaveTypesMap, holidaysMap } =
    mapper(state);

  const {
    handleDeleteDepartment,
    handleDeletePosition,
    handleDeleteLeaveType,
    handleDeleteHoliday,
    handleCreateDepartment,
    handleUpdateDepartment,
    handleCreatePosition,
    handleUpdatePosition,
    handleAddLeaveType,
    handleUpdateLeaveType,
    handleAddHoliday,
    handleUpdateHoliday,
  } = orgsCrud();

  const {
    handleSortRequest,
    handleSortRequestPosition,
    handleSortRequestLeaveType,
    handleSortRequestHoliday,
  } = sortingOrgs();

  const {
    handleDeleteDialogClose,
    handleDeleteDialogConfirm,
    handleDeleteDialogOpen,
  } = deleteDialogs();

  const getSortedList = React.useCallback(
    (departments = [], sortBy, sortOrder) => {
      return sort(departments, sortBy, sortOrder);
    },
    []
  );
  return (
    <PageView
      className={classes.root}
      title={`${state.org.name}`}
      icon={
        <span style={{ verticalAlign: "middle", marginLeft: "16px" }}>
          <VerifiedUserRoundedIcon fontSize="large" />
        </span>
      }
    >
      <Container>
        {state.requesting && <LoadingComponent />}
        {state.error && (
          <ErrorBoxComponent error={state.error} onRetry={() => fetchOrg()} />
        )}
        {state.org && Object.keys(state.org).length > 0 && (
          <Grid container>
            <DialogDelete
              open={deleteDialog.open}
              onClose={handleDeleteDialogClose}
              onDelete={handleDeleteDialogConfirm}
            />

            <Card className={classes.card} style={{ marginBottom: "20px" }}>
              <CardContent>
                <Box display="flex" alignItems="center" mr={1}>
                  <Grid item sm={8}>
                    <Box mt={1} />
                    {[
                      {
                        label: state.org.phone,
                        icon: <PhoneIcon fontSize="small" />,
                      },
                      {
                        label: state.org.email,
                        icon: <MailIcon fontSize="small" />,
                      },
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
                          marginBottom: "20px",
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
                        <Typography
                          variant="body2"
                          component="span"
                          className={classes.root}
                        >
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
                        endIcon={<EditIcon size={15} />}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
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
                      label: "Departments",
                      panel: (
                        <DepartmentList
                          departments={state.org.departments}
                          onSortParamsChange={handleSortRequest}
                          departmentsMap={departmentsMap}
                          onCreateDepartment={handleCreateDepartment}
                          onUpdateDepartment={handleUpdateDepartment}
                          onDeleteDepartment={handleDeleteDialogOpen}
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
                          onSortParamsChange={handleSortRequestPosition}
                          onCreatePosition={handleCreatePosition}
                          onUpdatePosition={handleUpdatePosition}
                          onDeletePosition={handleDeleteDialogOpen}
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
                          onSortParamsChange={handleSortRequestLeaveType}
                          onUpdateLeaveType={handleUpdateLeaveType}
                          onDeleteLeaveType={handleDeleteDialogOpen}
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
                          onSortParamsChange={handleSortRequestHoliday}
                          onUpdateHoliday={handleUpdateHoliday}
                          onDeleteHoliday={handleDeleteDialogOpen}
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

  function deleteDialogs() {
    const handleDeleteDialogOpen = (id) => {
      const tabLabel = document.querySelector(".Mui-selected").innerText;
      console.log(tabLabel);
      setTabLabel(tabLabel);
      setDeleteDialog({
        open: true,
        id,
      });
    };

    const handleDeleteDialogClose = () => {
      setDeleteDialog({
        open: false,
        id,
      });
    };

    //switch case for delete dialog confirm using tab label
    const handleDeleteDialogConfirm = () => {
      switch (tabLabel) {
        case "DEPARTMENTS":
          handleDeleteDepartment(deleteDialog.id);
          break;
        case "POSITIONS":
          handleDeletePosition(deleteDialog.id);
          break;
        case "LEAVE TYPES":
          handleDeleteLeaveType(deleteDialog.id);
          break;
        case "HOLIDAYS":
          handleDeleteHoliday(deleteDialog.id);
          break;
        default:
          break;
      }
      setDeleteDialog({
        open: false,
      });
    };
    return {
      handleDeleteDialogClose,
      handleDeleteDialogConfirm,
      handleDeleteDialogOpen,
    };
  }

  function orgsCrud() {
    const handleCreateDepartment = (departmentInfo) => {
      API.orgs.departments
        .create(currentOrg, departmentInfo)
        .then(({ success, department, error }) => {
          if (success) {
            addDepartment(
              {
                _id: department._id,
                ...departmentInfo,
                org: currentOrg,
              },
              currentOrg
            );
            notify({
              message: "Department created successfully.",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: error,
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const handleUpdateDepartment = (departmentInfo) => {
      console.log(departmentInfo);
      API.orgs.departments
        .editById(currentOrg, departmentInfo._id, departmentInfo)
        .then(({ success, error }) => {
          if (success) {
            updateDepartment(departmentInfo);
            notify({
              message: "Department updated successfully.",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: error,
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const handleDeleteDepartment = (departmentId) => {
      API.orgs.departments
        .deleteById(currentOrg, departmentId)
        .then(({ success, error, message }) => {
          if (success) {
            deleteDepartment(departmentId);
            notify({
              message: message,
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: error,
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
          notify({
            message: "Something went wrong.",
            type: "error",
            success: false,
          });
        });
    };

    const handleCreatePosition = (positionInfo) => {
      API.orgs.positions
        .create(currentOrg, positionInfo)
        .then(({ success, position, error }) => {
          if (success) {
            addPosition(position);
            notify({
              message: "Position created successfully.",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: error,
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };
    const handleUpdatePosition = (positionInfo) => {
      API.orgs.positions
        .editById(currentOrg, positionInfo._id, positionInfo)
        .then(({ success, error }) => {
          if (success) {
            updatePosition(positionInfo);
            notify({
              message: "Position updated successfully.",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: error,
              type: "error",
              success: false,
            });
          }
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
          if (success) {
            deletePosition(positionId);
            notify({
              message: "Position deleted successfully.",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: error,
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const handleAddLeaveType = (leaveTypeInfo) => {
      API.orgs.leaveTypes
        .add(currentOrg, leaveTypeInfo)
        .then(({ success, leaveType, error }) => {
          if (success) {
            addLeaveType(leaveType);
            notify({
              message: "Success record Leave type",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: "Error record Leave type",
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const handleUpdateLeaveType = (leaveInfo) => {
      API.orgs.leaveTypes
        .editById(currentOrg, leaveInfo._id, leaveInfo)
        .then(({ success, error }) => {
          if (success) {
            updateLeaveType(leaveInfo);
            notify({
              message: "Leave type updated successfully.",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: "Leave type updated error",
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const handleDeleteLeaveType = (leaveTypeId) => {
      API.orgs.leaveTypes
        .deleteById(currentOrg, leaveTypeId)
        .then(({ success, error }) => {
          if (success) {
            deleteLeaveType(leaveTypeId);
            notify({
              message: "Leave type deleted successfully.",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: "Leave type deleted error",
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const handleAddHoliday = (holidayInfo) => {
      API.orgs.holidays
        .add(currentOrg, holidayInfo)
        .then(({ success, holiday, error }) => {
          if (success) {
            addHoliday(holiday);
            notify({
              message: "Success record Holiday",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: "Error record Holiday",
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const handleUpdateHoliday = (holidayInfo) => {
      console.log(holidayInfo);
      API.orgs.holidays
        .editById(currentOrg, holidayInfo._id, holidayInfo)
        .then(({ success, error }) => {
          if (success) {
            updateHoliday(holidayInfo);
            notify({
              message: "Success update Holiday",
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: "Error update Holiday",
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const handleDeleteHoliday = (holidayId) => {
      console.log(holidayId);
      API.orgs.holidays
        .deleteById(currentOrg, holidayId)
        .then(({ success, message, error }) => {
          if (success) {
            deleteHoliday(holidayId);
            notify({
              message: message,
              type: "success",
              success: true,
            });
          } else {
            notify({
              message: message,
              type: "error",
              success: false,
            });
          }
        })
        .catch((e) => {
          console.error(e);
          notify({
            message: "Error delete Holiday",
            type: "error",
            success: false,
          });
        });
    };
    return {
      handleDeleteDepartment,
      handleDeletePosition,
      handleDeleteLeaveType,
      handleDeleteHoliday,
      handleCreateDepartment,
      handleUpdateDepartment,
      handleCreatePosition,
      handleUpdatePosition,
      handleAddLeaveType,
      handleUpdateLeaveType,
      handleAddHoliday,
      handleUpdateHoliday,
    };
  }

  function sortingOrgs() {
    const onSortParamsChange = (sortParams, orderDir) => {
      setSortParamss(sortParams);
      setOrdirDir(orderDir);

      dispatch({
        type: types.SORT_REQUEST,
        payload: {
          sortParams,
          orderDir,
        },
      });

      const sortedList = getSortedList(
        state.org.departments,
        sortParams,
        orderDir
      );

      dispatch({
        type: types.REQUEST_SUCCESS,
        payload: {
          ...state.org,
          departments: sortedList,
        },
      });
    };

    const handleSortRequest = (sortParams) => {
      const isAsc = sortParamss === sortParams && orderDir === "asc";
      onSortParamsChange(sortParams, isAsc ? "desc" : "asc");
    };

    const onSortParamsChangePosition = (sortParams, orderDir) => {
      setSortParamss(sortParams);
      setOrdirDir(orderDir);
      dispatch({
        type: types.SORT_REQUEST,
        payload: {
          sortParams,
          orderDir,
        },
      });

      const sortedList = getSortedList(
        state.org.positions,
        sortParams,
        orderDir
      );

      dispatch({
        type: types.REQUEST_SUCCESS,
        payload: {
          ...state.org,
          positions: sortedList,
        },
      });
    };

    const handleSortRequestPosition = (sortParams) => {
      const isAsc = sortParamss === sortParams && orderDir === "asc";
      onSortParamsChangePosition(sortParams, isAsc ? "desc" : "asc");
    };

    const onSortParamsChangeLeaveType = (sortParams, orderDir) => {
      setSortParamss(sortParams);
      setOrdirDir(orderDir);
      dispatch({
        type: types.SORT_REQUEST,
        payload: {
          sortParams,
          orderDir,
        },
      });

      const sortedList = getSortedList(
        state.org.leaveTypes,
        sortParams,
        orderDir
      );

      dispatch({
        type: types.REQUEST_SUCCESS,
        payload: {
          ...state.org,
          leaveTypes: sortedList,
        },
      });
    };

    const handleSortRequestLeaveType = (sortParams) => {
      const isAsc = sortParamss === sortParams && orderDir === "asc";
      onSortParamsChangeLeaveType(sortParams, isAsc ? "desc" : "asc");
    };

    const onSortParamsChangeHoliday = (sortParams, orderDir) => {
      setSortParamss(sortParams);
      setOrdirDir(orderDir);
      dispatch({
        type: types.SORT_REQUEST,
        payload: {
          sortParams,
          orderDir,
        },
      });

      const sortedList = getSortedList(
        state.org.holidays,
        sortParams,
        orderDir
      );

      dispatch({
        type: types.REQUEST_SUCCESS,
        payload: {
          ...state.org,
          holidays: sortedList,
        },
      });
    };

    const handleSortRequestHoliday = (sortParams) => {
      const isAsc = sortParamss === sortParams && orderDir === "asc";
      onSortParamsChangeHoliday(sortParams, isAsc ? "desc" : "asc");
    };
    return {
      handleSortRequest,
      handleSortRequestPosition,
      handleSortRequestLeaveType,
      handleSortRequestHoliday,
    };
  }
};

OrganizationView.propTypes = {
  id: PropTypes.any,
};

export default OrganizationView;
function mapper(state) {
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
  return { departmentsMap, positionsMap, leaveTypesMap, holidaysMap };
}
