import React from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  makeStyles,
  Box,
  Typography,
  Menu,
  MenuItem,
  Chip,
  Link,
  Grid,
  Button,
  Container,
} from "@material-ui/core";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  KeyboardArrowDown as ActionsIcon,
} from "@material-ui/icons";

import { useReactToPrint } from "react-to-print";

import PageView from "../../../components/PageView";
import TabbedComponent from "../../../components/TabbedComponent";
import CustomAvatar from "../../../components/CustomAvatar";

import API from "../../../api";
import arrayToMap from "../../../utils/arrayToMap";
import useOrg from "../../../providers/org";

import GeneralDetails from "./GeneralDetails";
import Paystubs from "./Paystubs";
import Leaves from "./Leaves";
import Attendance from "./Attendance";
import EmployeePrintableIDCard from "./EmployeeCard";
import LoadingComponent from "../../../components/LoadingComponent";

import FemaleNoprofileImage from "../../../assets/images/female_no_profile.jpg";
import MaleNoprofileImage from "../../../assets/images/male_no_profile.jpg";
import EmployeeBranchTransferDialog from "./EmployeeBranchTransferDialog";

const useStyles = makeStyles((theme) => ({
  root: {},
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
        console.log("Gettttttt in ", employee);
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

  return (
    <PageView className={classes.root}>
      {state.isFetching ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <LoadingComponent />
        </Box>
      ) : state.error ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <h1>Employee not found!</h1>
        </Box>
      ) : (
        <Container maxWidth="md">
          <Box mb={4} display="flex" alignItems="center">
            <Typography
              style={{ verticalAlign: "middle" }}
              variant="h5"
              color="textPrimary"
              component={Link}
              href="/app/employees"
            >
              <span style={{ verticalAlign: "middle" }}>
                <BackIcon fontSize="small" />
              </span>{" "}
              <Typography
                variant="subtitle2"
                component="span"
                style={{
                  fontWeight: 500,
                  lineHeight: 1.57,
                  margin: 0,
                  fontSize: "1rem",
                }}
              >
                Employees
              </Typography>
            </Typography>
          </Box>
          <Box mb={1}>
            <Grid container spacing={4}>
              <Grid item sm={12} md={8}>
                <Box display="flex">
                  <CustomAvatar
                    size="2"
                    src={
                      state.employee && state.employee.image
                        ? state.employee.image
                        : require("../../../assets/images/male_no_profile.jpg")
                    }
                    alt={`${name}`}
                    className={classes.avatar}
                  />
                  <Box ml={2}>
                    <Typography variant="h1">{name} </Typography>
                    <Typography variant="body2">
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
                          state.employee && state.employee.status === "Active"
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
              <Grid item md={4}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEditProfileClick}
                    endIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProfileMenuClick}
                    endIcon={<ActionsIcon />}
                    style={{ marginLeft: "8px" }}
                  >
                    Actions
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
            <MenuItem onClick={handleEditProfileClick}>Edit Profile</MenuItem>
            <MenuItem onClick={handleTransferBranchClick}>
              Transfer Branch
            </MenuItem>
            <MenuItem onClick={handlePrint}>Print ID Card</MenuItem>
            <MenuItem onClick={handleTerminateClick}>Terminate</MenuItem>
            <MenuItem onClick={handleTerminateClick}>Delete</MenuItem>
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
            tabsProps={{ textColor: "primary", indicatorColor: "primary" }}
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
      )}
      <div style={{ display: "none" }}>
        <EmployeePrintableIDCard
          ref={employeePrintableCardRef}
          employee={{
            id: state.employee ? state.employee.employeeId : params.id,
            org: org.name,
            name: `${state.employee ? `${name}` : "Employee "}`,
            image:
              (state.employee && state.employee.image) ||
              "https://picsum.photos",
            department: state.employee
              ? state.employee.departmentDetails.name
              : "Department",
            jobTitle: state.employee
              ? state.employee.positionDetails.title
              : "Job Title",
          }}
        />
      </div>
    </PageView>
  );
};

export default EmployeeProfileView;
