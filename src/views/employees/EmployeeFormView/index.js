import React from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import Page from "../../../components/Page";
import useNotificationSnackbar from "../../../providers/notification-snackbar";
import { useSnackbar } from "notistack";
import API from "../../../api";
import useOrg from "../../../providers/org";
import {
  makeStyles,
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Divider,
  TextField,
  Container,
  MenuItem,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },
  button: {
    margin: theme.spacing(0, 0, 0, 1),
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    paddingTop: 125,
  },
  title: {
    marginTop: theme.spacing(10),
    display: "flex",
    fontFamily: "Poppins",
    fontSize: "20px",
    fontWeight: 600,
  },
}));

const EmployeeFormView = ({ employeeId }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const { currentOrg, org, addEmployee, updateEmployee } = useOrg();
  const [employee, setEmployee] = React.useState(null);

  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  React.useEffect(() => {
    const fetchEmployee = () => {
      API.employees
        .getById(params.id || employeeId)
        .then(({ success, employee, error }) => {
          if (success) {
            setEmployee(employee);
          } else {
            console.error(error);
          }
        })
        .catch((e) => {
          console.error(e.message);
        });
    };
    (params.id || employeeId) && fetchEmployee();
  }, [params.id, employeeId]);
  console.log(employee);

  const [formSubmitStatus, setStatus] = React.useState("");
  const isCreateForm = pathname.includes("new");

  const title = isCreateForm
    ? "Create Employee"
    : employee
    ? `Edit employee | ${employee.firstName} ${employee.surName}`
    : "Edit employee";

  const clickLabel = isCreateForm ? "Create" : "Update";

  const handleCreateEmployee = async (employeeInfo) => {
    return await API.employees
      .create(employeeInfo)
      .then(({ success, employee, error }) => {
        if (success) {
          addEmployee(employee);
          notify({ success, message: "Employee add successful!" });
          navigate("/app/employees");
          return true;
        } else {
          console.error(error);
          notify({
            success: false,
            error: "Couldnt add employee!",
          });
          return false;
        }
      })
      .catch((e) => {
        console.error(e.message);
        return false;
      });
  };

  const handleUpdateEmployee = async (employeeInfo) => {
    return await API.employees
      .editById(employeeInfo._id, employeeInfo)
      .then(({ success, error }) => {
        if (success) {
          updateEmployee(employeeInfo);
          notify({ success, message: "Employee update successful!" });
          navigate("/app/employees");
          return true;
        } else {
          console.error(error);
          return false;
        }
      })
      .catch((e) => {
        console.error(e.message);
        return false;
      });
  };
  const handleSubmitForm = (values) => {
    return isCreateForm
      ? handleCreateEmployee(values)
      : handleUpdateEmployee(values);
  };

  const handleCancel = () => navigate("/app/employees", { replace: true });

  return (
    <Page className={classes.root} title={title}>
      <Box display="flex" flexDirection="column" height="100%">
        <Container maxWidth={false}>
          <Box display="flex" justifyContent="left">
            <Typography
              align="left"
              color="textPrimary"
              variant="h4"
              gutterBottom
              className={classes.title}
            >
              {title}
            </Typography>
          </Box>

          <Formik
            enableReinitialize
            initialValues={
              employee || {
                employeeId: "",
                firstName: "",
                surName: "",
                lastName: "",
                gender: "Female",
                birthDay: new Date().toISOString().slice(0, 10),
                nationalID: "",
                image: "",
                phone: "",
                phone2: "",
                email: "",
                address: "",
                address2: "",

                department: "",
                position: "",
                contractType: "Permanent",
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date().toISOString().slice(0, 10),
                hireDate: new Date().toISOString().slice(0, 10),
              }
            }
            validationSchema={Yup.object().shape({
              employeeId: Yup.string().required("Employee id is required"),
              firstName: Yup.string().required("First name is required"),
              surName: Yup.string().required("Sur name is required"),
              lastName: Yup.string().required("Last name is required"),
              gender: Yup.string()
                .oneOf(["Male", "male", "female", "Female"])
                .required("Gender is required"),
              birthDay: Yup.date().required("Birth date is required"),
              nationalID: Yup.string(),
              image: Yup.string(),
              phone: Yup.string().required("Phone number is required"),
              phone2: Yup.string(),
              email: Yup.string().email("Must be a valid email").max(255),
              address: Yup.string().required("Main address is required"),
              address2: Yup.string(),

              department: Yup.string().required("Department is required"),
              position: Yup.string().required("Position is required"),
              salary: Yup.number().positive("Enter valid salary figure"),
              allowances: Yup.array().default([]),
              deductions: Yup.array().default([]),
              contractType: Yup.string()
                .oneOf(
                  ["Permanent", "Temporary", "Internship"],
                  "Choose contract type"
                )
                .required("Contract type is required"),
              startDate: Yup.date(),
              endDate: Yup.date(),
              hireDate: Yup.date().required("Hire date is required"),
            })}
            onSubmit={(values, { resetForm }) => {
              setStatus(isCreateForm ? "Create" : "Saving changes...");
              console.log(values);
              if (
                handleSubmitForm({
                  ...values,
                  status:
                    values.endDate && values.endDate < new Date().toDateString()
                      ? "Inactive"
                      : "Active",
                  org: currentOrg,
                })
              ) {
                setStatus(isCreateForm ? "Create" : "Saved changes.");
              } else {
                setStatus("Something went wrong.");
              }
              resetForm();
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
              <form onSubmit={handleSubmit} noValidate="off">
                <Paper>
                  <Container
                    component={Box}
                    display="flex"
                    justifyItems="center"
                    style={{ padding: "20px" }}
                  >
                    <Grid container spacing={2}>
                      {[
                        {
                          label: "Employee Id",
                          name: "employeeId",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          required: true,
                          GridProps: { sm: 12 },
                        },
                        {
                          label: "First name",
                          name: "firstName",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          required: true,
                          GridProps: { sm: 12, md: 6, lg: 4 },
                        },
                        {
                          label: "Middle name",
                          name: "surName",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          required: true,
                          GridProps: { sm: 12, md: 6, lg: 4 },
                        },
                        {
                          label: "Last name",
                          name: "lastName",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          required: true,
                          GridProps: { sm: 12, md: 6, lg: 4 },
                        },
                        {
                          label: "Date of Birth",
                          name: "birthDay",
                          type: "date",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          required: true,
                          GridProps: { sm: 12, md: 6, lg: 4 },
                        },
                        {
                          label: "Gender",
                          name: "gender",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          required: true,
                          select: true,
                          selectOptions: [
                            { value: "Female", label: "Female" },
                            { value: "Male", label: "Male" },
                          ],
                          GridProps: { sm: 12, md: 6, lg: 4 },
                        },
                        {
                          label: "National ID",
                          name: "nationalID",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          GridProps: { sm: 12, md: 6, lg: 4 },
                        },
                        {
                          label: "Phone",
                          name: "phone",
                          required: true,
                          onChange: handleChange,
                          onBlur: handleBlur,
                          GridProps: { sm: 12, md: 6, lg: 4 },
                        },
                        {
                          label: "Address",
                          name: "address",
                          required: true,
                          onChange: handleChange,
                          onBlur: handleBlur,
                          GridProps: { sm: 12, md: 6, lg: 4 },
                        },
                        {
                          label: "Email (Optional)",
                          name: "email",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          GridProps: { sm: 12, md: 6, lg: 4 },
                        },
                        {
                          label: "Department",
                          name: "department",
                          required: true,
                          select: true,
                          selectOptions: (org.departments || []).map(
                            ({ _id, name }) => ({ label: name, value: _id })
                          ),
                          onChange: handleChange,
                          onBlur: handleBlur,
                          GridProps: { sm: 12, md: 6, lg: 6 },
                        },
                        {
                          label: "Job title",
                          name: "position",
                          required: true,
                          select: true,
                          selectOptions: (org.positions || []).map(
                            ({ _id, title }) => ({ label: title, value: _id })
                          ),
                          onChange: handleChange,
                          onBlur: handleBlur,
                          GridProps: { sm: 12, md: 6, lg: 6 },
                        },
                        {
                          label: "Hire date",
                          name: "hireDate",
                          required: true,
                          type: "date",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          GridProps: { sm: 12, md: 6, lg: 6 },
                        },
                        {
                          label: "Work start date",
                          name: "startDate",
                          required: true,
                          type: "date",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          GridProps: { sm: 12, md: 6, lg: 6 },
                        },
                      ].map(
                        (
                          {
                            label,
                            name,
                            required = false,
                            select = false,
                            onBlur,
                            onChange,
                            selectOptions,
                            GridProps,
                            ...rest
                          },
                          index
                        ) => (
                          <Grid item {...GridProps} key={index}>
                            <TextField
                              required={required}
                              select={select}
                              error={Boolean(touched[name] && errors[name])}
                              helperText={touched[name] && errors[name]}
                              label={label}
                              name={name}
                              onBlur={onBlur}
                              onChange={onChange}
                              value={values[name]}
                              fullWidth
                              variant="outlined"
                              size="small"
                              margin="normal"
                              {...rest}
                            >
                              {select
                                ? selectOptions.map(
                                    ({ value, label }, index) => (
                                      <MenuItem value={value} key={index}>
                                        {label}
                                      </MenuItem>
                                    )
                                  )
                                : null}
                            </TextField>
                          </Grid>
                        )
                      )}
                    </Grid>
                  </Container>
                </Paper>
                <Box mt={2} flexGrow={1} />
                <Divider />

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    className={classes.button}
                    onClick={handleCancel}
                    variant="outlined"
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    {formSubmitStatus ? formSubmitStatus : clickLabel}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default EmployeeFormView;
