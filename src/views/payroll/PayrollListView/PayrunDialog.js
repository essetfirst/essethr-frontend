import React from "react";
import PropTypes from "prop-types";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  makeStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControl,
  FormHelperText,
} from "@material-ui/core";

import { DatePicker } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  root: {},
  formControl: {},
}));

const PayrunDialog = ({ open, onClose, onSubmit }) => {
  const classes = useStyles();

  const [isCustomPeriod, setIsCustomPeriod] = React.useState(false);
  const [isCustomEmployee, setIsCustomEmployee] = React.useState(false);
  const [isByDept, setIsByDept] = React.useState(false);

  const employeeSelectChoices = [
    { value: "all", label: "All" },
    { value: "department", label: "By department" },
    { value: "custom", label: "Custom" },
  ];
  const employeeChoice = [];
  const departmentChoices = [];

  const periodSelectChoices = [
    { value: "last_week", label: "Last Week" },
    { value: "current_week", label: "Current Week" },
    { value: "last_month", label: "Last Month" },
    { value: "current_month", label: "Current Month" },
    { value: "custom", label: "Custom" },
  ];

  const beforeHandleChange = (property, value) => {
    switch (property) {
      case "employeeSelect":
        if (value === "all") {
          // set all employees
          setIsCustomEmployee(false);
          setIsByDept(false);
        } else if (value === "department") {
          // turn on department choose field
          setIsByDept(true);
        } else {
          // turn on employees choose field
          setIsCustomEmployee(true);
        }
        break;
      case "department":
        // get employees by department
        break;
      case "period":
        if (value === "current_month") {
          // set fromDate, toDate auto
        } else if (value === "current_week") {
          // set fromDate, toDate auto
        } else {
          // turn on fromDate, toDate fields
          setIsCustomPeriod(true);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Payroll Process</DialogTitle>
      <DialogContent>
        {/* Employees select field */}
        {/* Department choose field */}
        {/* Employee custom choose field */}
        {/* Duration select field */}
        {/* From date field */}
        {/* To date field */}
        <Formik
          initialValues={{
            period: -1,
          }}
          validationSchema={Yup.object().shape({
            employee: Yup.number(),
          })}
          onSubmit={(values) => {
          }}
        >
          {({
            errors,
            touched,
            values,
            handleBlur,
            handleChange,
            isSubmitting,
            handleSubmit,
          }) => {
            const customHandleChange = (property) => (e) => {
              beforeHandleChange(property, e.target.value);
              handleChange(e);
            };
            return (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <FormControl
                      className={classes.formControl}
                      error={Boolean(
                        touched.employeeSelect && errors.employeeSelect
                      )}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel shrink htmlFor="employeeSelect">
                        Employees
                      </InputLabel>
                      <Select
                        id="employeeSelect"
                        label="Selected Employees"
                        name="employeeSelect"
                        onBlur={handleBlur}
                        onChange={customHandleChange("employeeSelect")}
                        value={values.employeeSelect}
                      >
                        <MenuItem value={-1}>All</MenuItem>
                        {employeeSelectChoices.map(
                          ({ label, value }, index) => (
                            <MenuItem key={value} value={value}>
                              <span>{label}</span>
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText>
                        {touched.employeeSelect && errors.employeeSelect}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item md={6}>
                    <FormControl
                      className={classes.formControl}
                      error={Boolean(touched.department && errors.department)}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      hidden={isByDept}
                    >
                      <InputLabel shrink htmlFor="departmentSelect">
                        Department
                      </InputLabel>
                      <Select
                        id="departmentSelect"
                        label="Leave type"
                        name="department"
                        onBlur={handleBlur}
                        onChange={customHandleChange}
                        value={values.duration}
                      >
                        <MenuItem value={-1}>Choose</MenuItem>
                        {departmentChoices.map(({ label, value }, index) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {touched.department && errors.department}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl
                      className={classes.formControl}
                      error={Boolean(touched.period && errors.period)}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel shrink htmlFor="periodSelect">
                        Period
                      </InputLabel>
                      <Select
                        id="periodSelect"
                        label="Period"
                        name="period"
                        onBlur={handleBlur}
                        onChange={customHandleChange}
                        value={values.period}
                      >
                        <MenuItem value={-1}>Choose</MenuItem>
                        {periodSelectChoices.map(({ label, value }, index) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {touched.period && errors.period}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item md={6}>
                    <DatePicker
                      label="From"
                      value={values.from}
                      onChange={(date) =>
                        customHandleChange({
                          target: { name: "from", value: date },
                        })
                      }
                      renderInput={(props) => (
                        <TextField
                          onBlur={handleBlur}
                          error={Boolean(touched.from && errors.from)}
                          fullWidth
                          helperText={touched.from && errors.from}
                          {...props}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <DatePicker
                      label="To"
                      value={values.to}
                      onChange={(date) =>
                        customHandleChange({
                          target: { name: "to", value: date },
                        })
                      }
                      renderInput={(props) => (
                        <TextField
                          onBlur={handleBlur}
                          error={Boolean(touched.to && errors.to)}
                          fullWidth
                          helperText={touched.to && errors.to}
                          {...props}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </form>
            );
          }}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="cancel">
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit} aria-label="submit">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PayrunDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default PayrunDialog;
