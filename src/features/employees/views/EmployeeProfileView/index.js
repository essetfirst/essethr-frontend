import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Menu, MenuItem, Chip, Grid, Button, Container, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useReactToPrint } from "react-to-print";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import CustomAvatar from "components/CustomAvatar";

import API from "api";
import arrayToMap from "utils/arrayToMap";
import useOrg from "features/org/providers";
import { useTheme } from "providers/theme";

import GeneralDetails from "./GeneralDetails";
import EmployeeActivity from "./EmployeeActivity";
import Paystubs from "./Paystubs";
import EmployeeDocuments from "features/documents/views/EmployeeDocuments";
import Leaves from "./Leaves";
import Attendance from "./Attendance";
import EmployeePrintableIDCard from "./EmployeeCard";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import PrintIcon from "@mui/icons-material/Print";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

import FemaleNoprofileImage from "assets/images/female_no_profile.png";
import MaleNoprofileImage from "assets/images/male_no_profile.png";
import EmployeeBranchTransferDialog from "./EmployeeBranchTransferDialog";
import useNotificationSnackbar from "providers/notification-snackbar";
import { useSnackbar } from "notistack";
import sort from "helpers/sort";
import LinearProgress from "@mui/material/LinearProgress";
import { DownloadCloud, Edit3 } from "react-feather";

const StyledRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
}));

const StyledImage = styled("div")(({ theme }) => ({
  marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
}));

const StyledAppBar = styled("div")(({ theme }) => ({
  borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: "8px",
}));

const StyledAvatar = styled("div")(({ theme }) => ({
  margin: theme.spacing(1),
    width: 84,
    height: 84,
}));

const StyledProgress = styled("div")(({ theme }) => ({
  width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
}));

const types = {
  FETCH_EMPLOYEE_REQUEST: "FETCH_EMPLOYEE_REQUEST",
  FETCH_EMPLOYEE_SUCCESS: "FETCH_EMPLOYEE_SUCCESS",
  FETCH_EMPLOYEE_FAILURE: "FETCH_EMPLOYEE_FAILURE",
};
const fetchInitialState = { employee: null, isFetching: false, error: null };
const fetchReducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.FETCH_EMPLOYEE_REQUEST:
      return { ...state, isFetching: true, error: null };
    case types.FETCH_EMPLOYEE_SUCCESS:
      return { ...state, employee: payload, isFetching: false, error: null };
    case types.FETCH_EMPLOYEE_FAILURE:
      return { ...state, isFetching: false, error };
    default:
      return state;
  }
};

const EmployeeProfileView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { org } = useOrg();
  const { darkMode } = useTheme();

  const [state, dispatch] = React.useReducer(fetchReducer, fetchInitialState);
  const employeePrintableCardRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => employeePrintableCardRef.current,
  });

  const fetchEmployee = React.useCallback(() => {
    dispatch({ type: types.FETCH_EMPLOYEE_REQUEST });
    API.employees
      .getDetails(params.id)
      .then(({ success, employee, error }) => {
        success
          ? dispatch({
              type: types.FETCH_EMPLOYEE_SUCCESS,
              payload: employee,
            })
          : dispatch({ type: types.FETCH_EMPLOYEE_FAILURE, error });
      })
      .catch((error) => {
        dispatch({ type: types.FETCH_EMPLOYEE_FAILURE, error });
      });
  }, [params.id]);

  React.useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  React.useEffect(() => {
    if (!params.id) return;
    API.employees.getProfileCompletion(params.id).then((res) => {
      setProfileCompletion(res?.completion || null);
    }).catch(() => setProfileCompletion(null));
  }, [params.id, state.employee?._id]);

  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = React.useState(null);
  const [profileCompletion, setProfileCompletion] = React.useState(null);

  const handleProfileMenuClick = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleEditProfileClick = () => {
    state.employee && navigate("/app/employees/edit/" + state.employee._id);
  };

  const [profileTab, setProfileTab] = React.useState(0);

  const handleSeeDetailsClick = () => {
    const cv = state.employee?.cv;
    if (cv) {
      window.open(cv, "_blank", "noopener,noreferrer");
      return;
    }
    setProfileTab(0);
    notify({ message: "No CV uploaded. Showing general details." });
  };

  const updateEmployeeStatus = async (nextStatus) => {
    if (!state.employee?._id) return;
    handleProfileMenuClose();
    const emp = state.employee;
    const payload = {
      _id: emp._id,
      employeeId: emp.employeeId,
      firstName: emp.firstName,
      surName: emp.surName,
      lastName: emp.lastName,
      gender: emp.gender,
      birthDay: emp.birthDay,
      nationalID: emp.nationalID,
      phone: emp.phone,
      phone2: emp.phone2,
      email: emp.email,
      address: emp.address,
      address2: emp.address2,
      department: emp.department,
      position: emp.position,
      contractType: emp.contractType,
      hireDate: emp.hireDate,
      startDate: emp.startDate,
      endDate: emp.endDate,
      isAttendanceRequired: emp.isAttendanceRequired,
      deductCostShare: emp.deductCostShare,
      status: nextStatus,
    };
    try {
      const { success, message, error } = await API.employees.editById(
        emp._id,
        payload,
      );
      if (success) {
        notify({ success, message: message || "Employee status updated." });
        fetchEmployee();
      } else {
        notify({ success: false, error: error || "Failed to update status." });
      }
    } catch (e) {
      notify({ success: false, error: e.message || "Failed to update status." });
    }
  };

  const handleTerminateClick = () => updateEmployeeStatus("inactive");

  const handleActivateClick = () => updateEmployeeStatus("active");

  const [transferBranchDialogOpen, setTransferBranchDialogOpen] =
    React.useState(false);
  const handleTransferBranchDialogClose = () =>
    setTransferBranchDialogOpen(false);

  const handleTransferBranchClick = () => setTransferBranchDialogOpen(true);

  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  const handleBranchTransfer = async (transferInfo) => {
    try {
      const { success, error, message } = await API.employees.transfer(
        transferInfo._id,
        transferInfo
      );
      if (success) {
        notify({ success, message: message || "Employee transferred." });
        handleTransferBranchDialogClose();
        fetchEmployee();
      } else {
        notify({ success: false, error: error || "Transfer failed." });
      }
    } catch (e) {
      notify({ success: false, error: e.message || "Transfer failed." });
    }
  };

  const name = state.employee
    ? `${state.employee.firstName} ${state.employee.surName}`
    : "";

  const getSortedList = React.useCallback((list, sortParams, orderDir) => {
    return sort(list, sortParams, orderDir);
  }, []);

  const [sortParamss, setSortParamss] = React.useState("checkin");
  const [orderDir, setOrdirDir] = React.useState("asc");

  const onSortParamsChange = (sortParams, orderDir) => {
    setSortParamss(sortParams);
    setOrdirDir(orderDir);
    dispatch({ type: types.FETCH_EMPLOYEE_REQUEST });

    const sortedEmployees = getSortedList(
      state.employee.attendance,
      sortParams,
      orderDir
    );

    dispatch({
      type: types.FETCH_EMPLOYEE_SUCCESS,
      payload: { ...state.employee, attendance: sortedEmployees },
    });
  };

  const handleSortRequest = (sortParams) => {
    const isAsc = sortParamss === sortParams && orderDir === "asc";
    onSortParamsChange(sortParams, isAsc ? "desc" : "asc");
  };

  return (
    <React.Fragment>
      {state.isFetching ? (
        <Box>
          <LinearProgress color="secondary" />
        </Box>
      ) : state.error ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <h1>Employee not found!</h1>
        </Box>
      ) : (
        <PageView>
          <Container maxWidth="md">
            <Box mb={4} display="flex" alignItems="center">
              <Box flexGrow={1}>
                <Box display="flex" alignItems="center">
                  <IconButton
                    onClick={() => navigate(-1)}
                    style={{ marginRight: 1 }}
                  >
                    <BackIcon />
                  </IconButton>
                  <Typography
                    style={{
                      fontWeight: 400,
                      fontSize: 18,
                    }}
                  >
                    Back
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box mb={1}>
              <Grid container spacing={2}>
                <Grid item sm={12} md={8}>
                  <Box display="flex">
                    <CustomAvatar
                      size="2"
                      src={state.employee ? state.employee.image : ""}
                      alt={`${name}`}
                      component={StyledAvatar}
                    />

                    <Box ml={2}>
                      <Typography variant="h1">{name}</Typography>
                      <Typography component={"span"} variant={"body2"}>
                        {state.employee
                          ? (state.employee.positionDetails || {}).title
                          : "Job Title"}
                        {" • "}
                        {state.employee
                          ? (state.employee.departmentDetails || {}).name
                          : "Department"}{" "}
                        <Chip
                          size="small"
                          style={
                            state.employee && state.employee.status === "active"
                              ? {
                                  backgroundColor: "#4caf50",
                                  color: "#fff",
                                  marginLeft: "10px",
                                }
                              : {
                                  backgroundColor: "#f44336",
                                  color: "#fff",
                                  marginLeft: "10px",
                                }
                          }
                          color={state.employee ? "primary" : "default"}
                          label={(state.employee || {}).status || "active"}
                        />
                      </Typography>
                      {profileCompletion && profileCompletion.percent < 100 && (
                        <Box mt={1} maxWidth={280}>
                          <Typography variant="caption" color="textSecondary">
                            Profile {profileCompletion.percent}% complete
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={profileCompletion.percent}
                            color="secondary"
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item md={4} sm={12}>
                  <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                    <Button
                      variant="text"
                      color="inherit"
                      onClick={handleEditProfileClick}
                      startIcon={<Edit3 />}
                      size="small"
                      style={{ padding: "1px 2px" , fontSize: "10px"}}
                    >
                      <span style={{ fontSize: "12px" }}>edit profile</span>
                    </Button>
                    <IconButton
                      size="small"
                      aria-label="more actions"
                      onClick={handleProfileMenuClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Button
                      variant="text"
                      color="secondary"
                      size="small"
                      startIcon={<DownloadCloud />}
                      style={{ padding: "1px 2px" , fontSize: "10px"}}
                      onClick={handleSeeDetailsClick}
                    >
                      <span style={{ fontSize: "12px" }}>see details</span>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Menu
              id="employee-profile-menu"
              anchorEl={profileMenuAnchorEl}
              keepMounted
              open={Boolean(profileMenuAnchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleEditProfileClick}>
                <EditIcon style={{ marginRight: "8px" }} />
                Edit Profile
              </MenuItem>
              <MenuItem onClick={handleTransferBranchClick}>
                <TransferWithinAStationIcon style={{ marginRight: "8px" }} />
                Transfer Branch
              </MenuItem>
              <MenuItem onClick={handlePrint}>
                <PrintIcon style={{ marginRight: "8px" }} />
                Print
              </MenuItem>

              <MenuItem onClick={handleTerminateClick} disabled={state.employee?.status === "inactive"}>
                <IndeterminateCheckBoxIcon style={{ marginRight: "8px" }} />
                Set inactive
              </MenuItem>
              <MenuItem onClick={handleActivateClick} disabled={state.employee?.status === "active"}>
                <IndeterminateCheckBoxIcon style={{ marginRight: "8px" }} />
                Set active
              </MenuItem>
            </Menu>
            {state.employee && (
              <EmployeeBranchTransferDialog
                open={transferBranchDialogOpen}
                onClose={handleTransferBranchDialogClose}
                employee={{
                  name,
                  firstName: state.employee.firstName,
                  surName: state.employee.surName,
                  _id: state.employee._id,
                  org: state.employee.org,
                  position: state.employee.position,
                }}
                onTransfer={handleBranchTransfer}
              />
            )}
            {/* </Card> */}
            <TabbedComponent
              tabIndex={profileTab}
              onTabChange={setProfileTab}
              tabsProps={{
                indicatorColor: !darkMode ? "primary" : "secondary",
                textColor: !darkMode ? "primary" : "secondary",
                variant: "fullWidth",
              }}
              tabs={[
                {
                  label: "General",
                  panel: state.employee ? (
                    <GeneralDetails
                      details={state.employee}
                      onStatusChange={updateEmployeeStatus}
                      onEdit={handleEditProfileClick}
                    />
                  ) : null,
                },
                {
                  label: "Attendance",
                  panel: (
                    <Attendance
                      attendanceByDate={arrayToMap(
                        state.employee ? state.employee.attendance : [],
                        "date"
                      )}
                      onSortParamsChange={handleSortRequest}
                    />
                  ),
                },
                {
                  label: "Leaves",
                  panel: (
                    <Leaves
                      leaves={state.employee ? state.employee.leaves : []}
                      allowance={state.employee?.leaveAllowance || []}
                    />
                  ),
                },
                {
                  label: "Payslips",
                  panel: (
                    <Paystubs
                      payslips={state.employee ? state.employee.payslips : []}
                    />
                  ),
                },
                {
                  label: "Activity",
                  panel: (
                    <EmployeeActivity employeeId={state.employee?._id || params.id} />
                  ),
                },
                {
                  label: "Documents",
                  panel: (
                    <EmployeeDocuments
                      employeeId={state.employee?._id || params.id}
                    />
                  ),
                },
              ]}
            />
          </Container>
          <Box style={{ display: "none" }}>
            <EmployeePrintableIDCard
              ref={employeePrintableCardRef}
              employee={{
                id: state.employee ? state.employee.employeeId : params.id,
                org: org.name,
                name: `${state.employee ? `${name}` : "Employee "}`,
                image:
                  (state.employee && state.employee.gender === "Male"
                    ? MaleNoprofileImage
                    : FemaleNoprofileImage) || MaleNoprofileImage,
                department: state.employee
                  ? state.employee.departmentDetails.name
                  : "Department",
                jobTitle: state.employee
                  ? state.employee.positionDetails.title
                  : "Job Title",
              }}
            />
          </Box>
        </PageView>
      )}
    </React.Fragment>
  );
};

export default EmployeeProfileView;
