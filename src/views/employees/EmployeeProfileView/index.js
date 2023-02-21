import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  makeStyles,
  Box,
  Typography,
  Menu,
  MenuItem,
  Chip,
  Grid,
  Button,
  Container,
  IconButton,
} from "@material-ui/core";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import { useReactToPrint } from "react-to-print";
import PageView from "../../../components/PageView";
import TabbedComponent from "../../../components/TabbedComponent";
import CustomAvatar from "../../../components/CustomAvatar";

import API from "../../../api";
import arrayToMap from "../../../utils/arrayToMap";
import useOrg from "../../../providers/org";
import { useTheme } from "../../../providers/theme";

import GeneralDetails from "./GeneralDetails";
import Paystubs from "./Paystubs";
import Leaves from "./Leaves";
import Attendance from "./Attendance";
import EmployeePrintableIDCard from "./EmployeeCard";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import PrintIcon from "@material-ui/icons/Print";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

import FemaleNoprofileImage from "../../../assets/images/female_no_profile.png";
import MaleNoprofileImage from "../../../assets/images/male_no_profile.png";
import EmployeeBranchTransferDialog from "./EmployeeBranchTransferDialog";
import sort from "../../../helpers/sort";
import LinearProgress from "@material-ui/core/LinearProgress";
import { DownloadCloud, Edit, Edit3 } from "react-feather";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },
  appBar: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: "8px",
  },
  avatar: {
    margin: theme.spacing(1),
    width: 84,
    height: 84,
  },
  progress: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
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
  const classes = useStyles();
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

  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = React.useState(null);

  const handleProfileMenuClick = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleEditProfileClick = () => {
    state.employee && navigate("/app/employees/edit/" + state.employee._id);
  };

  const handleTerminateClick = () => {};

  const [transferBranchDialogOpen, setTransferBranchDialogOpen] =
    React.useState(false);
  const handleTransferBranchDialogClose = () =>
    setTransferBranchDialogOpen(false);

  const handleTransferBranchClick = () => setTransferBranchDialogOpen(true);

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
        <Box className={classes.progress}>
          <LinearProgress color="secondary" />
        </Box>
      ) : state.error ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <h1>Employee not found!</h1>
        </Box>
      ) : (
        <PageView className={classes.root}>
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
                      className={classes.avatar}
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
                    {/* <Button
                      variant="text"
                      color="primary"
                      onClick={handleProfileMenuClick}
                      endIcon={<ActionsIcon />}
                      style={{ padding: "1px 2px" , fontSize: "10px"}}
                    /> */}
                    <a
                      href={state.employee ? state?.employee?.cv : ""}
                      title="Download CV"
                      target="_blank"
                      download rel="noreferrer"
                    >
                      <Button
                        variant="text"
                        color="secondary"
                        size="small"
                        startIcon={<DownloadCloud />}
                        style={{ padding: "1px 2px" , fontSize: "10px"}}

                      >
                        <span style={{ fontSize: "12px" }}>see details</span>
                      </Button>
                    </a>
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

              <MenuItem onClick={handleTerminateClick}>
                <IndeterminateCheckBoxIcon style={{ marginRight: "8px" }} />
                Terminate
              </MenuItem>
            </Menu>
            {state.employee && (
              <EmployeeBranchTransferDialog
                open={transferBranchDialogOpen}
                onClose={handleTransferBranchDialogClose}
                employee={{
                  name,
                  _id: state.employee._id,
                  org: state.employee.org,
                  position: state.employee.position,
                }}
              />
            )}
            {/* </Card> */}
            <TabbedComponent
              tabsProps={{
                indicatorColor: !darkMode ? "primary" : "secondary",
                textColor: !darkMode ? "primary" : "secondary",
                variant: "fullWidth",
                classes: {
                  root: classes.tabsRoot,
                  indicator: classes.tabsIndicator,
                },
              }}
              tabs={[
                {
                  label: "General",
                  panel: state.employee ? (
                    <GeneralDetails details={state.employee} />
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
                      allowance={{}}
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
