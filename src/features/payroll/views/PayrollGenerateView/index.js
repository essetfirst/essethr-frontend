import { fmtNow, monthBounds } from "utils/date";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useOrg from "features/org/providers";
import EmployeeSelect from "./EmployeeSelect";
import API from "api";
import { useNavigate } from "react-router-dom";
import PageView from "components/PageView";
import GetAppIcon from "@mui/icons-material/GetApp";
import { Backdrop, Box, Button, ButtonGroup, Card, CardContent, Divider, Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Repeat as RetryIcon } from "@mui/icons-material";
import { ThreeDots } from "react-loading-icons";
import payrollGenerateSchema from "features/payroll/schemas/payrollGenerateSchema";

const startOfMonth = monthBounds().start;
const endOfMonth = monthBounds().end;
const currentDay = fmtNow("yyyy-MM-dd");

const StyledRoot = styled("div")(({ theme }) => ({
  background: theme.palette.background.dark,
    height: "100%",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
}));

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
}));

const StyledProcessStateCard = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledText = styled("div")(({ theme }) => ({
  fontSize: "1.2rem",
    font: "Poppins",
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
  const navigate = useNavigate();
  const { org } = useOrg();
  const lastPayloadRef = React.useRef(null);

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const mapOrgEmployees = React.useCallback(
    () =>
      org?.employees
        ? org.employees.map(({ _id, firstName, surName }) => ({
            id: _id,
            name: `${firstName} ${surName}`,
          }))
        : [],
    [org?.employees],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(payrollGenerateSchema),
    defaultValues: {
      title: "",
      fromDate: startOfMonth,
      toDate: endOfMonth,
      payDate: currentDay,
      payType: "daily",
      employees: mapOrgEmployees(),
      onlyApprovedHours: false,
      commissionEnabled: false,
      salesData: [],
    },
  });

  const values = watch();

  React.useEffect(() => {
    reset((current) => ({
      ...current,
      employees: mapOrgEmployees(),
    }));
  }, [mapOrgEmployees, reset]);

  const generatePayroll = async (payrollInfo) => {
    lastPayloadRef.current = payrollInfo;
    dispatch({ type: types.REQUESTING });
    try {
      const response = await API.payroll.generate(payrollInfo);
      dispatch({
        type: response.success ? types.REQUEST_SUCCESS : types.REQUEST_ERROR,
        payload: response.success ? response.payroll : response.error,
        error: response.success ? null : response.error,
      });
    } catch (e) {
      dispatch({ type: types.REQUEST_ERROR, error: "Something went wrong." });
    }
  };

  const [requestDialog, setRequestDialog] = React.useState(false);
  const handleRequestDialogClose = () => setRequestDialog(false);

  const onSubmit = (formValues) => {
    const { employees, ...data } = formValues;
    const payload = {
      ...data,
      employees: employees.map(({ id }) => id),
    };
    setRequestDialog(true);
    generatePayroll(payload);
  };

  const handleCancelClick = () => {
    navigate("/app/payroll");
  };

  const handleViewClick = () => {
    navigate("/app/payroll/" + state.payroll);
  };

  const handleRetryClick = () => {
    if (lastPayloadRef.current) {
      setRequestDialog(true);
      generatePayroll(lastPayloadRef.current);
    }
  };

  return (
    <PageView title="Generate payroll" backPath={"/app/payroll"}>
      <StyledBackdrop
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
          <StyledProcessStateCard>
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
          </StyledProcessStateCard>
        )}
      </StyledBackdrop>

      <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
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
                          error={Boolean(errors.title)}
                          helperText={errors.title?.message}
                          label="Payroll title  e.g. Autumn 2020 payment"
                          {...register("title")}
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
                          error={Boolean(errors.fromDate)}
                          helperText={errors.fromDate?.message}
                          label="Payroll start date"
                          type="date"
                          {...register("fromDate")}
                          variant="outlined"
                          margin="normal"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          error={Boolean(errors.toDate)}
                          helperText={errors.toDate?.message}
                          label="Payroll end date"
                          type="date"
                          {...register("toDate")}
                          variant="outlined"
                          margin="normal"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          fullWidth
                          error={Boolean(errors.payDate)}
                          helperText={errors.payDate?.message}
                          label="Pay date"
                          type="date"
                          {...register("payDate")}
                          margin="normal"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          fullWidth
                          error={Boolean(errors.payType)}
                          helperText={errors.payType?.message}
                          select
                          label="Payment time unit"
                          {...register("payType")}
                          margin="normal"
                          variant="outlined"
                        >
                          <MenuItem value={"daily"}>Per Day</MenuItem>
                          <MenuItem value={"hourly"}>Per Hour</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>
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
                        setValue("employees", selection, { shouldValidate: true })
                      }
                    />
                    {errors.employees?.message && (
                      <Typography color="error" variant="caption" display="block" mt={1}>
                        {errors.employees.message}
                      </Typography>
                    )}
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
                      type="button"
                      onClick={handleCancelClick}
                      variant="contained"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      startIcon={<GetAppIcon />}
                      variant="contained"
                    >
                      Generate
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
            </Grid>
          </form>
    </PageView>
  );
};

export default PayrollGenerateView;
