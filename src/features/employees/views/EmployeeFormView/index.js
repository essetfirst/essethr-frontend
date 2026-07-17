import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Page from "components/Page";
import useNotificationSnackbar from "providers/notification-snackbar";
import { useSnackbar } from "notistack";
import API from "api";
import useOrg from "features/org/providers";
import {
  CustomEmployeeFields,
  buildCustomFieldValues,
  useEmployeeCustomFields,
} from "components/employee/EmployeeForm";
import { buildEmployeeSchema } from "features/employees/schemas/employeeSchema";
import { Box, Paper, Typography, Grid, Button, Divider, TextField, Container, MenuItem, ButtonGroup, Checkbox } from "@mui/material";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  PhotoCamera,
  PictureAsPdf,
} from "@mui/icons-material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const StyledRoot = styled(Page)(({ theme }) => ({
  backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
}));

const StyledProgress = styled("div")(({ theme }) => ({
  width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
}));

const StyledImage = styled("div")(({ theme }) => ({
  marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 0, 0, 1),
}));

const StyledForm = styled("div")(({ theme }) => ({
  paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    paddingTop: 125,
}));

const StyledButtonProgress = styled("div")(({ theme }) => ({
  color: "#cee2f4",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
}));

/** Normalize id-like fields from employee/org payloads for controlled selects. */
function mongoFieldToString(val) {
  if (val == null || val === "") return "";
  if (typeof val === "object" && val !== null && val.$oid) return String(val.$oid);
  return String(val);
}

function formatDateField(value) {
  if (!value) return "";
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function normalizeContractType(value) {
  if (!value) return "";
  const v = String(value).toLowerCase();
  if (v.startsWith("perm")) return "Permanent";
  if (v.startsWith("temp")) return "Temporary";
  if (v.startsWith("intern")) return "Internship";
  return String(value);
}

function normalizeStatus(value) {
  if (!value) return "active";
  return String(value).toLowerCase() === "inactive" ? "inactive" : "active";
}

function optionId(row) {
  if (!row || row._id == null) return "";
  const id = row._id;
  if (typeof id === "object" && id.$oid) return String(id.$oid);
  return String(id);
}

const EmployeeFormView = ({ employeeId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const { org, addEmployee, updateEmployee, currentOrg } = useOrg();
  const { customFields } = useEmployeeCustomFields();
  const [departmentRows, setDepartmentRows] = React.useState([]);
  const [positionRows, setPositionRows] = React.useState([]);
  const [listsLoaded, setListsLoaded] = React.useState(false);
  const [employee, setEmployee] = React.useState(null);
  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);
  const [loading, setLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const orgId = currentOrg || (org && org._id);
    if (!orgId) {
      setDepartmentRows([]);
      setPositionRows([]);
      setListsLoaded(false);
      return;
    }

    let cancelled = false;
    setListsLoaded(false);

    (async () => {
      try {
        const [dRes, pRes] = await Promise.all([
          API.orgs.departments.get(orgId),
          API.orgs.positions.get(orgId),
        ]);
        if (cancelled) return;
        if (dRes && dRes.success && Array.isArray(dRes.departments)) {
          setDepartmentRows(dRes.departments);
        }
        if (pRes && pRes.success && Array.isArray(pRes.positions)) {
          setPositionRows(pRes.positions);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setListsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentOrg, org?._id]);

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

  const defaultValues = React.useMemo(
    () => buildInitialValues(employee, customFields),
    [employee, customFields],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buildEmployeeSchema({ isCreate: isCreateForm })),
    defaultValues,
  });

  React.useEffect(() => {
    reset(buildInitialValues(employee, customFields));
  }, [employee, customFields, reset]);

  const values = watch();
  const { handleSubmitForm, handleCancel } = crudEmployee();

  const onSubmit = (formValues) => {
    handleSubmitForm({
      ...formValues,
      customFieldValues: formValues.customFieldValues || {},
      status: formValues.status || normalizeStatus(employee?.status),
    });
  };

  const setFieldValue = (name, value) =>
    setValue(name, value, { shouldValidate: true, shouldDirty: true });

  return (
    <StyledRoot title={title}>
      <Box display="flex" flexDirection="column" height="100%">
        <Container>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            {formUi(errors, values, setFieldValue)}

            <Box mt={2} display="flex" justifyContent="flex-end">
              <ButtonGroup>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
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
        </Container>
      </Box>
    </StyledRoot>
  );

  function buildInitialValues(employeeRecord, fields) {
    if (!employeeRecord) {
      return {
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
        status: "active",
        hireDate: new Date().toISOString().slice(0, 10),
        startDate: new Date().toISOString().slice(0, 10),
        endDate: "",
        isAttendanceRequired: false,
        deductCostShare: false,
        customFieldValues: buildCustomFieldValues(fields),
      };
    }
    return {
      _id: employeeRecord._id,
      employeeId: employeeRecord.employeeId || "",
      firstName: employeeRecord.firstName || "",
      surName: employeeRecord.surName || "",
      lastName: employeeRecord.lastName || "",
      gender: employeeRecord.gender || "",
      birthDay: formatDateField(employeeRecord.birthDay || employeeRecord.dateOfBirth),
      nationalID: employeeRecord.nationalID || "",
      cv: "",
      image: "",
      phone: employeeRecord.phone || "",
      phone2: employeeRecord.phone2 || "",
      email: employeeRecord.email || "",
      address: employeeRecord.address || "",
      address2: employeeRecord.address2 || "",
      department: mongoFieldToString(employeeRecord.department),
      position: mongoFieldToString(employeeRecord.position),
      contractType: normalizeContractType(employeeRecord.contractType),
      status: normalizeStatus(employeeRecord.status),
      hireDate: formatDateField(employeeRecord.hireDate),
      startDate: formatDateField(employeeRecord.startDate),
      endDate: formatDateField(employeeRecord.endDate),
      isAttendanceRequired: Boolean(employeeRecord.isAttendanceRequired),
      deductCostShare: Boolean(employeeRecord.deductCostShare),
      customFieldValues: buildCustomFieldValues(fields, employeeRecord),
    };
  }

  function formUi(formErrors, formValues, setValueFn) {
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
        {listsLoaded &&
          org &&
          org._id &&
          (departmentRows.length === 0 || positionRows.length === 0) && (
            <Box mt={2} mb={1}>
              <Typography variant="body2" color="textSecondary" component="div">
                {departmentRows.length === 0 && (
                  <span>
                    No departments found for this organization. Add them under{" "}
                    <Link to="/app/org">Organization</Link>
                    {" · "}
                  </span>
                )}
                {positionRows.length === 0 && (
                  <span>
                    No positions found — add at least one position (linked to a department)
                    under <Link to="/app/org">Organization</Link>.
                  </span>
                )}
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block">
                Dev tip: from <code>backend/</code> run{" "}
                <code>npm run seed:dev</code> to insert sample department + position for the
                seeded admin org.
              </Typography>
            </Box>
          )}
        {isLoading ? (
          <StyledProgress>
            <LinearProgress />
          </StyledProgress>
        ) : (
          <Container maxWidth={"lg"}>
            <Grid container spacing={2}>
              {[
                {
                  label: "EmployeeID ex. 123456",
                  name: "employeeId",
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 6 },
                },
                {
                  label: "Select contract type",
                  name: "contractType",
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
                  label: "Employment status",
                  name: "status",
                  select: true,
                  required: true,
                  selectOptions: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ],
                  GridProps: { sm: 12, md: 6, lg: 6 },
                },
                {
                  label: "First name ex. John",
                  name: "firstName",
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Middle name ex. Doe",
                  name: "surName",
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Last name ex. Smith",
                  name: "lastName",
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Date of Birth ex. 1990-01-01",
                  name: "birthDay",
                  type: "date",
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Gender",
                  name: "gender",
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
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Phone number ex. 0712345678",
                  name: "phone",
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Address ex. 1234 Main St",
                  name: "address",
                  required: true,
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Email (Optional)",
                  name: "email",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Select department",
                  name: "department",
                  required: true,
                  select: true,
                  selectOptions: departmentRows.map((row) => ({
                    label: row.name,
                    value: optionId(row),
                  })),
                  GridProps: { sm: 12, md: 6, lg: 6 },
                },
                {
                  label: "Select position",
                  name: "position",
                  required: true,
                  select: true,
                  selectOptions: positionRows.map((row) => ({
                    label: row.title,
                    value: optionId(row),
                  })),
                  GridProps: { sm: 12, md: 6, lg: 6 },
                },
                {
                  label: "Hire date ex. 2020-01-01",
                  name: "hireDate",
                  required: true,
                  type: "date",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                  error: formValues.hireDate < formValues.birthDay,
                },
                {
                  label: "Work start date ex. 2020-01-01",
                  name: "startDate",
                  required: true,
                  type: "date",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                  error: formValues.startDate < formValues.hireDate,
                },
                {
                  label: "Work end date ex. 2020-01-01",
                  name: "endDate",
                  type: "date",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                  disabled: formValues.contractType === "Permanent",
                },
                {
                  label: "isAttendanceRequired",
                  name: "isAttendanceRequired",
                  type: "checkbox",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "isDeductCostShare",
                  name: "deductCostShare",
                  type: "checkbox",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "Employee Doc",
                  name: "cv",
                  required: isCreateForm,
                  type: "file",
                  GridProps: { sm: 12, md: 6, lg: 4 },
                },
                {
                  label: "profile image",
                  name: "image",
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
                              onChange={(event) => {
                                setValueFn(
                                  name,
                                  event.currentTarget.files[0]
                                );
                              }}
                            />
                            <label htmlFor={name}>
                              <StyledButton
                                variant={
                                  formValues[name] ? "contained" : "outlined"
                                }
                                color={formValues[name] ? "primary" : "default"}
                                component="span"
                                startIcon={
                                  name === "cv" ? (
                                    <PictureAsPdf />
                                  ) : (
                                    <PhotoCamera />
                                  )
                                }
                              >
                                {isCreateForm
                                  ? (formValues[name] && formValues[name]?.name) ||
                                    "Upload"
                                  : (formValues[name] && formValues[name]?.name) ||
                                    "Change"}
                              </StyledButton>
                            </label>
                            {!isCreateForm && employee?.cv && !formValues[name]?.name && (
                              <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                Current:{" "}
                                <Link href={employee.cv} target="_blank" rel="noreferrer">
                                  view document
                                </Link>
                              </Typography>
                            )}
                          </Box>
                          {formErrors[name]?.message && (
                            <Typography variant="caption" color="error">
                              {formErrors[name].message}
                            </Typography>
                          )}
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
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={Boolean(formValues[name])}
                                  onChange={(e) => setValueFn(name, e.target.checked)}
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
                          Boolean(formErrors[name]) || rest.error
                        }
                        helperText={formErrors[name]?.message}
                        label={label}
                        {...register(name)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        margin="normal"
                        InputLabelProps={
                          rest.type === "date" ? { shrink: true } : undefined
                        }
                        {...rest}
                      >
                        {select
                          ? selectOptions.map(({ value, label }, optIndex) => (
                              <MenuItem value={value} key={optIndex}>
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
            <CustomEmployeeFields
              customFields={customFields}
              values={formValues}
              errors={formErrors.customFieldValues || {}}
              setFieldValue={setValueFn}
            />
          </Container>
        )}
      </Paper>
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

      const payload = { ...employeeInfo };
      if (!payload.cv) delete payload.cv;
      if (!payload.image) delete payload.image;

      return await API.employees
        .editById(payload._id, payload)
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
