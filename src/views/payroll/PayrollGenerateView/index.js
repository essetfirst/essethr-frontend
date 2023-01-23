import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import useOrg from "../../../providers/org";
import EmployeeSelect from "./EmployeeSelect";
import API from "../../../api";
import { useNavigate } from "react-router-dom";
import PageView from "../../../components/PageView";
import GetAppIcon from "@material-ui/icons/GetApp";
import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Repeat as RetryIcon } from "@material-ui/icons";
import { ThreeDots } from "react-loading-icons";
import moment from "moment";
// import PerfectScrollbar from "react-perfect-scrollbar";

const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
const currentDay = moment().format("YYYY-MM-DD");

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.dark,
    height: "100%",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  processStateCard: {
    padding: theme.spacing(2),
  },
  text: {
    fontSize: "1.2rem",
    font: "Poppins",
  },
}));

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_ERROR: "REQUEST_ERROR",
  RETRY: "RETRY",
};
const initialState = {
  payroll: [],
  requesting: false,
  error: null,
  retry: false,
};
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, requesting: true, error: null };
    case types.REQUEST_SUCCESS:
      return {
        ...state,
        payroll: payload,
        requesting: false,
        error: null,
      };
    case types.REQUEST_ERROR:
      return { ...state, requesting: false, retry: false, error };
    case types.RETRY:
      return { ...state, retry: true };
    default:
      return state;
  }
};

const PayrollGenerateView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { org } = useOrg();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const generatePayroll = async (payrollInfo) => {
    dispatch({ type: types.REQUESTING });
    try {
      const response = await API.payroll.generate(payrollInfo);
      dispatch({
        type: response.success ? types.REQUEST_SUCCESS : types.REQUEST_ERROR,
        payload: response.success ? response.payroll : response.error,
      });
    } catch (e) {
      // Something went wrong
      dispatch({ type: types.REQUEST_ERROR, payload: "Something went wrong." });
    }
  };

  const [requestDialog, setRequestDialog] = React.useState(false);
  const handleRequestDialogClose = () => setRequestDialog(false);

  let handleRetry;

  const handleGenerateClick = (payrollInfo) => {
    setRequestDialog(true);
    generatePayroll(payrollInfo);
  };

  const handleCancelClick = () => {
    // Navigate back
    navigate("/app/payroll");
  };

  const handleViewClick = () => {
    // Navigate to payroll details view
    navigate("/app/payroll/" + state.payroll);
  };

  const handleRetryClick = () => {
    typeof handleRetry == "function" && handleRetry();
  };

  return (
    <PageView title="Generate payroll" backPath={"/app/payroll"}>
      <Backdrop
        className={classes.backdrop}
        open={requestDialog}
        onClick={handleRequestDialogClose}
      >
        {state.requesting ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <ThreeDots
              stroke="#7bd0e0"
              fill="#7bd0e0"
              style={{
                width: 58,
                height: 58,
              }}
            />
          </Box>
        ) : state.error ? (
          <Box
            minWidth={800}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography color="error" variant="subtitle1">
              {state.error}
            </Typography>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleRetryClick}
              aria-label="retry"
              startIcon={<RetryIcon />}
              style={{ margin: "16px" }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <Card className={classes.processStateCard}>
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <Typography
                  variant="h4"
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "16px",
                  }}
                >
                  Payroll generated successfully
                </Typography>
                <Button
                  onClick={handleViewClick}
                  aria-label="view"
                  endIcon={
                    <ArrowForwardIosIcon
                      style={{
                        fontSize: "1.2rem",
                      }}
                    />
                  }
                >
                  <Typography
                    variant="h5"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                    }}
                    color="secondary"
                  >
                    <i>See details</i>
                  </Typography>
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Backdrop>

      <Formik
        initialValues={{
          title: "",
          fromDate: startOfMonth,
          toDate: endOfMonth,
          payDate: currentDay,
          payType: "daily",
          employees:
            org && org.employees
              ? org.employees.map(({ _id, firstName, surName }) => ({
                  id: _id,
                  name: `${firstName} ${surName}`,
                }))
              : [],
          commissionEnabled: false,
          salesData: [],
        }}
        validationSchema={Yup.object({
          title: Yup.string().min(2).max(40).required("'Title' is required"),
          fromDate: Yup.date().required("'Start date' is required"),
          toDate: Yup.date().required("'End date' is required"),
          payDate: Yup.date(),
          payType: Yup.string().oneOf(
            ["daily", "hourly"],
            "'Payment unit' can only be either daily or hourly"
          ),
          employees: Yup.array().required("At least one employee is required"),
          onlyApprovedHours: Yup.boolean().default(false),
          commissionEnabled: Yup.boolean(),
          salesData: Yup.array().default([]),
        })}
        onSubmit={(values) => {
          const { employees, ...data } = values;
          handleGenerateClick({
            ...data,
            employees: employees.map(({ id }) => id),
          });
        }}
      >
        {({
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} ms={12} md={6}>
                <Paper>
                  <Box p={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Payroll details
                    </Typography>
                    <Divider />
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          required
                          fullWidth
                          error={Boolean(touched.title && errors.title)}
                          helperText={touched.title && errors.title}
                          label="Payroll title  e.g. Autumn 2020 payment"
                          name="title"
                          value={values.title}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          margin="normal"
                          size="small"
                          placeholder="Something descriptive e.g. Autumn 2020 payment"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          error={Boolean(touched.fromDate && errors.fromDate)}
                          helperText={touched.fromDate && errors.fromDate}
                          label="Payroll start date"
                          name="fromDate"
                          type="date"
                          value={values.fromDate}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          margin="normal"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          error={Boolean(touched.toDate && errors.toDate)}
                          helperText={touched.toDate && errors.toDate}
                          label="Payroll end date"
                          name="toDate"
                          type="date"
                          value={values.toDate}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          margin="normal"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          fullWidth
                          error={Boolean(touched.payDate && errors.payDate)}
                          helperText={touched.payDate && errors.payDate}
                          label="Pay date"
                          type="date"
                          name="payDate"
                          value={values.payDate}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          fullWidth
                          error={Boolean(touched.payType && errors.payType)}
                          helperText={touched.payType && errors.payType}
                          select
                          label="Payment time unit"
                          name="payType"
                          value={values.payType}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          margin="normal"
                          variant="outlined"
                        >
                          <MenuItem value={"daily"}>Per Day</MenuItem>
                          <MenuItem value={"hourly"}>Per Hour</MenuItem>
                        </TextField>
                      </Grid>
                      {/* <Grid item xs={12} sm={12} md={6}>
                        <FormControl
                          fullWidth
                          error={Boolean(
                            touched.onlyApprovedHours &&
                              errors.onlyApprovedHours
                          )}
                          margin="normal"
                          variant="outlined"
                        >
                          {/* <FormControlLabel
                            label="Include only approved hours"
                            control={
                              <Checkbox
                                checked={values.onlyApprovedHours}
                                onChange={(e) => {
                                  handleChange({
                                    target: {
                                      name: "onlyApprovedHours",
                                      value: Boolean(values.onlyApprovedHours),
                                    },
                                  });
                                }}
                                onBlur={handleBlur}
                              />
                            }
                          />
                          {/*                           
                          {touched.onlyApprovedHours && (
                            <FormControlHelperText>
                              {errors.onlyApprovedHours}
                            </FormControlHelperText>
                          )} */}
                      {/* </FormControl> */}
                      {/* </Grid>{" "} */}
                    </Grid>
                  </Box>

                  {/* <Box p={2} height="100%">
                    <FormControl
                      fullWidth
                      error={Boolean(touched.salesData && errors.salesData)}
                    >
                      <FormControlLabel
                        label={"Include sales commission"}
                        control={
                          <Checkbox
                            checked={values.commissionEnabled}
                            onChange={(e) => {
                              if (values.commissionEnabled) {
                                handleChange({
                                  target: { name: "salesData", value: null },
                                });
                              }
                              handleChange({
                                target: {
                                  name: "commissionEnabled",
                                  value: !values.commissionEnabled,
                                },
                              });
                            }}
                          />
                        }
                      />
                      <Box mt={1} />
                      <Collapse
                        in={values.commissionEnabled}
                        mountOnEnter
                        unmountOnExit
                      >
                        <ImportDataFile
                          onReadSelectedFile={async (file) => {
                            if (!file) {
                              return false;
                            }
                            const data = await readExcelFile(file);
                            const expectedDataColumns = [
                              "Date",
                              "Count",
                              "Sales",
                            ];
                            const isProperlyFormatted =
                              data &&
                              data.columns.every((c) =>
                                expectedDataColumns.includes(c.label || c.id)
                              );
                            handleChange({
                              target: {
                                name: "salesData",
                                value: data.map((e) => Object.keys({})),
                              },
                            });
                            return !!data && isProperlyFormatted;
                          }}
                        />
                      </Collapse>
                    </FormControl>
                  </Box> */}
                </Paper>
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <Paper
                  elevation={0}
                  style={{ height: "99%", overflow: "auto" }}
                >
                  <Box p={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Employees in payroll
                    </Typography>
                    <Divider />
                    <EmployeeSelect
                      employees={values.employees}
                      onSelectionChange={(selection) =>
                        handleChange({
                          target: { name: "employees", value: selection },
                        })
                      }
                    />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Divider />
                <Box mb={2} />
                <Box display="flex" justifyContent="flex-end">
                  <ButtonGroup
                    color="primary"
                    aria-label="contained primary button group"
                  >
                    <Button
                      type="submit"
                      onClick={handleCancelClick}
                      variant="contained"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      startIcon={<GetAppIcon />}
                      onClick={handleGenerateClick}
                      variant="contained"
                    >
                      {"Generate"}
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </PageView>
  );
};

export default PayrollGenerateView;
