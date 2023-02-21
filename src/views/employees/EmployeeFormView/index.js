import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  ButtonGroup,
  Checkbox,
  // Avatar,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  PhotoCamera,
  PictureAsPdf,
} from "@material-ui/icons";
// import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  progress: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
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
  buttonProgress: {
    color: "#cee2f4",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const EmployeeFormView = ({ employeeId }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const { org, addEmployee, updateEmployee } = useOrg();
  const [employee, setEmployee] = React.useState(null);
  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);
  const [loading, setLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true);
      await API.employees
        .getById(params.id || employeeId)
        .then(({ success, employee, error }) => {
          if (success) {
            setEmployee(employee);
            setIsLoading(false);
          } else {
            console.error(error);
            setIsLoading(false);
          }
        })
        .catch((e) => {
          console.error(e.message);
          setIsLoading(false);
        });
    };
    (params.id || employeeId) && fetchEmployee();
  }, [params.id, employeeId]);

  const isCreateForm = pathname.includes("new");
  const title = isCreateForm
    ? "Create Employee"
    : employee
    ? `Edit employee | ${employee.firstName} ${employee.surName}`
    : "Edit employee";

  const { handleSubmitForm, handleCancel } = crudEmployee();

  return (
    <Page className={classes.root} title={title}>
      <Box display="flex" flexDirection="column" height="100%">
        <Container>
          <Formik
            enableReinitialize
            initialValues={iniValues()}
            validationSchema={validationForm()}
            onSubmit={(values) => {
              handleSubmitForm({
                ...values,
                status:
                  values.contractType === "permanent"
                    ? "active"
                    : values.contractType === "temporary" &&
                      values.endDate > new Date()
                    ? "active"
                    : "inactive",
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
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {formUi(
                  handleChange,
                  handleBlur,
                  touched,
                  errors,
                  values,
                  setFieldValue
                )}

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={Object.keys(errors).length > 0}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <Box display="flex" alignItems="center">
                          <Box mr={1}>Save</Box>
                          <SaveIcon style={{ fontSize: 18 }} />
                        </Box>
                      )}
                    </Button>
                  </ButtonGroup>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );

  function validationForm() {
    return Yup.object().shape({
      employeeId: Yup.string().required("Employee id is required"),
      firstName: Yup.string().required("First name is required"),
      surName: Yup.string().required("Sur name is required"),
      lastName: Yup.string().required("Last name is required"),
      gender: Yup.string()
        .oneOf(["Male", "male", "female", "Female"])
        .required("Gender is required"),
      birthDay: Yup.date().required("Birth date is required"),
      nationalID: Yup.string(),
      phone: Yup.string().required("Phone number is required"),
      phone2: Yup.string(),
      email: Yup.string().email("Must be a valid email").max(255),
      address: Yup.string().required("Main address is required"),
      address2: Yup.string(),
      cv: Yup.mixed().required("CV is required"),
      image: Yup.mixed(),
      department: Yup.string().required("Department is required"),
      position: Yup.string().required("Position is required"),
      salary: Yup.number().positive("Enter valid salary figure"),
      allowances: Yup.array().default([]),
      deductions: Yup.array().default([]),
      contractType: Yup.string()
        .oneOf(["Permanent", "Temporary", "Internship"], "Choose contract type")
        .required("Contract type is required"),
      startDate: Yup.date().required("Start date is required"),
      hireDate: Yup.date().required("Hire date is required"),
      endDate: Yup.date(),
      isAttendanceRequired: Yup.boolean(),
      deductCostShare: Yup.boolean(),
    });
  }

  function formUi(
    handleChange,
    handleBlur,
    touched,
    errors,
    values,
    setFieldValue
  ) {
    return (
      <Paper
        elevation={0}
        variant="outlined"
        style={{ padding: 20, marginBottom: 20 }}
      >
        <Box display="flex" alignItems="center" mb={1}>
          <Button onClick={() => navigate(-1)}>
            <ArrowBackIos />
          </Button>
          <Box ml={1}>
            <Typography variant="h5" color="textPrimary">
              {title}
            </Typography>
          </Box>
        </Box>
        <Divider />
        {isLoading ? (
          <div className={classes.progress}>
            <LinearProgress />
          </div>
        ) : (
          <Container maxWidth={"lg"}>
            <Grid container spacing={2}>
              {[
                {
                  label: "EmployeeID ex. 123456",
                  name: "employeeId",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 6 },
                },
                {
                  label: "Select contract type",
                  name: "contractType",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  select: true,
                  required: true,
                  selectOptions: [
                    { value: "Permanent", label: "Permanent" },
                    { value: "Temporary", label: "Temporary" },
                    { value: "Internship", label: "Internship" },
                  ],
                  GridProps: { sm: 12, md: 6, lg: 6 },
                },
                {
                  label: "First name ex. John",
                  name: "firstName",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Middle name ex. Doe",
                  name: "surName",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Last name ex. Smith",
                  name: "lastName",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Date of Birth ex. 1990-01-01",
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
                  label: "National ID ex. 123456789",
                  name: "nationalID",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Phone number ex. 0712345678",
                  name: "phone",
                  required: true,
                  onChange: handleChange,
                  onBlur: handleBlur,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Address ex. 1234 Main St",
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
                  label: "Select department",
                  name: "department",
                  required: true,
                  select: true,
                  selectOptions: (org.departments || []).map(
                    ({ _id, name }) => ({
                      label: name,
                      value: _id,
                    })
                  ),
                  onChange: handleChange,
                  onBlur: handleBlur,
                  GridProps: { sm: 12, md: 6, lg: 6 },
                },
                {
                  label: "Select position",
                  name: "position",
                  required: true,
                  select: true,
                  selectOptions: (org.positions || []).map(
                    ({ _id, title }) => ({
                      label: title,
                      value: _id,
                    })
                  ),
                  onChange: handleChange,
                  onBlur: handleBlur,
                  GridProps: { sm: 12, md: 6, lg: 6 },
                },
                {
                  label: "Hire date ex. 2020-01-01",
                  name: "hireDate",
                  required: true,
                  type: "date",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                  error: values.hireDate < values.birthDay,
                },
                {
                  label: "Work start date ex. 2020-01-01",
                  name: "startDate",
                  required: true,
                  type: "date",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                  error: values.startDate < values.hireDate,
                },
                {
                  label: "Work end date ex. 2020-01-01",
                  name: "endDate",
                  type: "date",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                  disabled: values.contractType === "Permanent",
                },
                {
                  label: "isAttendanceRequired",
                  name: "isAttendanceRequired",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  type: "checkbox",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "isDeductCostShare",
                  name: "deductCostShare",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  type: "checkbox",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Employee Doc",
                  name: "cv",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  required: true,
                  type: "file",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "profile image",
                  name: "image",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  type: "file",
                  GridProps: { sm: 12, md: 6, lg: 12 },
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
                  <Grid item key={index} {...GridProps}>
                    {rest.type === "file" ? (
                      <>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                            }}
                          >
                            <Typography>
                              {label}
                            </Typography>

                            <input
                              accept={
                                name === "cv" ? "application/pdf" : "image/*"
                              }
                              style={{ display: "none" }}
                              id={name}
                              type="file"
                              name={name}
                              label={label}
                              onBlur={onBlur}
                              onChange={(event) => {
                                setFieldValue(
                                  name,
                                  event.currentTarget.files[0]
                                );
                              }}
                            />
                            <label htmlFor={name}>
                              <Button
                                variant={
                                  values[name] ? "contained" : "outlined"
                                }
                                color={values[name] ? "primary" : "default"}
                                component="span"
                                className={classes.button}
                                startIcon={
                                  name === "cv" ? (
                                    <PictureAsPdf />
                                  ) : (
                                    <PhotoCamera />
                                  )
                                }
                              >
                               {isCreateForm
                                  ? (values[name] && values[name]?.name) ||
                                    "Upload"
                                  : (values[name] && values[name]?.name) ||
                                    "Change"}
                              </Button>
                            </label>
                          </Box>
                      </>
                    ): rest.type === "checkbox" ? (
                      <>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                          >
                            {/* implimant checkbox for formik and material ui */}
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values[name]}
                                  onChange={handleChange}
                                  name={name}
                                  color="secondary"
                                />
                              }
                              label={label}
                            />
                        </Box>
                      </>
                    ) : (
                      <TextField
                        required={required}
                        select={select}
                        error={
                          Boolean(touched[name] && errors[name]) || rest.error
                        }
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
                          ? selectOptions.map(({ value, label }, index) => (
                              <MenuItem value={value} key={index}>
                                {label}
                              </MenuItem>
                            ))
                          : null}
                      </TextField>
                    )}
                  </Grid>
                )
              )}
            </Grid>
          </Container>
        )}
      </Paper>
    );
  }

  function iniValues() {
    return (
      employee || {
        employeeId: "",
        firstName: "",
        surName: "",
        lastName: "",
        gender: "",
        birthDay: new Date().toISOString().slice(0, 10),
        nationalID: "",
        cv: "",
        image: "",
        phone: "",
        phone2: "",
        email: "",
        address: "",
        address2: "",
        department: "",
        position: "",
        contractType: "",
        hireDate: new Date().toISOString().slice(0, 10),
        startDate: new Date().toISOString().slice(0, 10),
        endDate: "",
        isAttendanceRequired: false,
        deductCostShare: false,
      }
    );
  }

  function crudEmployee() {
    const handleCreateEmployee = async (employeeInfo) => {
      setLoading(true);
      try {
        const { success, message, employee, error } =
          await API.employees.create(employeeInfo);
        if (success) {
          addEmployee(employee);
          notify({ success, message: message });
          setLoading(false);
          navigate("/app/employees");
          return true;
        } else {
          console.error(error);
          notify({ error, message: error });
          setLoading(false);
          return false;
        }
      } catch (e) {
        console.error(e);
        notify({ error: e.message });
        setLoading(false);
        return false;
      }
    };

    const handleUpdateEmployee = async (employeeInfo) => {
      setLoading(true);

      return await API.employees
        .editById(employeeInfo._id, employeeInfo)
        .then(({ success, message, error }) => {
          if (success) {
            updateEmployee(employeeInfo);
            notify({ success, message: message });
            setLoading(false);
            navigate("/app/employees");
            return true;
          } else {
            console.error(error);
            notify({ error, message: error });
            setLoading(false);
            return false;
          }
        })
        .catch((e) => {
          console.error(e.message);
          notify({ error: e.message });
          setLoading(false);
          return false;
        });
    };

    const handleSubmitForm = (values) => {
      if (isCreateForm) {
        handleCreateEmployee(values);
      } else {
        handleUpdateEmployee(values);
      }
    };

    const handleCancel = () => navigate("/app/employees", { replace: true });
    return { handleSubmitForm, handleCancel };
  }
};

export default EmployeeFormView;
