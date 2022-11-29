import React from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import * as Yup from "yup";
import { Formik } from "formik";

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

import Page from "../../../components/Page";
// import TabbedComponent from "../../../components/TabbedComponent";
// import SteppedComponent from "../../../components/SteppedComponent";

import API from "../../../api";
import useOrg from "../../../providers/org";

const EMPLOYEE_DEFAULT_INITIAL_VALUES = {
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
};

const EMPLOYEE_VALIDATION_SCHEMA = Yup.object().shape({
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
    .oneOf(["Permanent", "Temporary", "Internship"], "Choose contract type")
    .required("Contract type is required"),
  startDate: Yup.date(),
  endDate: Yup.date(),
  hireDate: Yup.date().required("Hire date is required"),
});

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
}));

const EmployeeFormView = ({ employeeId }) => {
  const classes = useStyles();

  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();

  const { currentOrg, org, addEmployee, updateEmployee } = useOrg();

  // console.log(org);

  const [employee, setEmployee] = React.useState(null);

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
    // console.log(params.id, employeeId);

    // const foundEmployee = (org.employees || []).find(
    //   (e) => e._id === (params.id || employeeId)
    // );
    // setEmployee(foundEmployee);
  }, [params.id, employeeId]);

  console.log(employee);

  // const fetchOrg = React.useCallback(() => {
  //   API.orgs
  //     .getById(currentOrg)
  //     .then(({ success, org, error }) => {
  //       if (success) {
  //         setDepartments(arrayToMap(org.departments, "_id"));
  //         setPositions(arrayToMap(org.positions, "_id"));
  //       } else {
  //         console.error(error);
  //       }
  //     })
  //     .catch((e) => {
  //       console.error(e.message);
  //     });
  // }, [currentOrg]);

  // React.useEffect(() => {
  //   if ((params && params.id) || org === undefined || !org) {
  //     fetchEmployee();
  //   }

  //   if (org === undefined || !org) {
  //     fetchOrg();
  //   } else {
  //     setDepartments(arrayToMap(org.departments, "_id"));
  //     setPositions(arrayToMap(org.positions, "_id"));
  //   }
  // }, [params, org, fetchEmployee, fetchOrg]);

  const [formSubmitStatus, setStatus] = React.useState("");
  const isCreateForm = pathname.includes("new");

  const title = isCreateForm
    ? "Create employee form"
    : employee
    ? `Edit employee | ${employee.firstName} ${employee.surName}`
    : "Edit employee";
  const clickLabel = isCreateForm ? "Create Employee" : "Save";

  const handleCreateEmployee = (employeeInfo) => {
    return API.employees
      .create(employeeInfo)
      .then(({ success, employee, error }) => {
        if (success) {
          addEmployee(employee);
          // Notify the user somehow
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

  const handleUpdateEmployee = (employeeInfo) => {
    return API.employees
      .editById(employeeInfo._id, employeeInfo)
      .then(({ success, error }) => {
        if (success) {
          updateEmployee(employeeInfo);
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
          <Box display="flex" justifyContent="center">
            <Typography
              align="center"
              color="textPrimary"
              variant="h2"
              gutterBottom
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
            onSubmit={(values) => {
              setStatus(
                isCreateForm ? "Creating employee..." : "Saving changes..."
              );
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
                setStatus(
                  isCreateForm ? "New employee created." : "Saved changes."
                );

                // navigate("/app/employees");
              } else {
                setStatus("Something went wrong.");
              }
              setTimeout(() => {
                setStatus("");
              }, 1500);
            }}
          >
            {/* Part 2: ጎደቦ ጎደቦ ጎደቦ ጎደቦ ጎደቦ ጎደቦ ጎደቦ!
Summary:
=> He is an author!  */}
            {({
              values,
              touched,
              errors,
              // status,
              handleBlur,
              handleChange,
              // isSubmitting,

              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} noValidate="off">
                {/* <Grid
                  container
                  spacing={2}
                  style={{ marginTop: "10px", height: "100%" }}
                >
                  <Grid item md={12}> */}
                <Paper>
                  {/* <Box p={2} display="flex" justifyContent="center">
                        <Typography variant="h5" align="center" gutterBottom>
                          Personal Details
                        </Typography>
                      </Box>
                      <Divider /> */}
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
                          // defaultValue: new Date().toISOString().slice(0, 10),
                          onChange: handleChange,
                          onBlur: handleBlur,
                          GridProps: { sm: 12, md: 6, lg: 6 },
                        },
                        {
                          label: "Work start date",
                          name: "startDate",
                          required: true,
                          type: "date",
                          // defaultValue: new Date().toISOString().slice(0, 10),
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
                {/* <Paper>
                  <Box p={2} display="flex" justifyContent="center">
                    <Typography variant="h5" align="center" gutterBottom>
                      Job Details
                    </Typography>
                  </Box>
                  <Divider />
                  <Container style={{ padding: "15px" }}>
                    <TextField
                          select
                          fullWidth
                          error={Boolean(touched.org && errors.org)}
                          helperText={touched.org && errors.org}
                          label="Organization"
                          margin="normal"
                          size="small"
                          name="org"
                          value={values.org}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                        >
                          {Object.values(orgsMap).map(({ _id, name }) => (
                            <MenuItem key={_id} value={_id}>
                              {name}
                            </MenuItem>
                          ))}
                        </TextField>

                    <TextField
                      required
                      select
                      fullWidth
                      error={Boolean(touched.department && errors.department)}
                      helperText={touched.department && errors.department}
                      label="Department"
                      name="department"
                      value={values.department}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    >
                      {(org.departments || []).map(({ _id, name }) => (
                        <MenuItem key={_id} value={_id}>
                          {name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      required
                      select
                      fullWidth
                      error={Boolean(touched.position && errors.position)}
                      helperText={touched.position && errors.position}
                      label="Job Title (position)"
                      name="position"
                      value={values.position}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    >
                      {(org.positions || []).map(({ _id, title }) => (
                        <MenuItem key={_id} value={_id}>
                          {title}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      error={Boolean(
                        touched.contractType && errors.contractType
                      )}
                      fullWidth
                      helperText={touched.contractType && errors.contractType}
                      label="Contract Length"
                      name="contractType"
                      value={values.contractType}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    >
                      <MenuItem value="Permanent">Permanent</MenuItem>
                      <MenuItem value="Temporary">Temporary</MenuItem>
                      <MenuItem value="Internship">Internship</MenuItem>
                    </TextField>

                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      name="startDate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.startDate}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      name="endDate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.endDate}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    />
                    <TextField
                      required
                      fullWidth
                      label="Hire Date"
                      type="date"
                      name="hireDate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.hireDate}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    />
                  </Container>
                </Paper>
 */}
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
