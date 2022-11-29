import React from "react";
import PropTypes from "prop-types";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  Divider,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
} from "@material-ui/core";

import { employeeFormFields } from "./data";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

const EmployeeForm = ({ employee, onSubmit, onCancel, submitLabel }) => {
  const classes = useStyles();

  let initialValues = {};
  let validationSchema = {};

  const EmployeeFormFields = (formikProps) =>
    employeeFormFields.map(
      (
        {
          label,
          name,
          type = "string",
          required = false,
          select = false,
          onBlur,
          onChange,
          selectOptions,
          GridProps,
          ...rest
        },
        index
      ) => {
        initialValues[name] = employee[name] || defaultValue;
        validationSchema[name] = validation;

        const { values, errors, touched, handleBlur, handleChange } =
          formikProps;
        return (
          <Grid item {...GridProps} key={index}>
            <TextField
              required={required}
              select={select}
              error={Boolean(touched[name] && errors[name])}
              helperText={touched[name] && errors[name]}
              label={label}
              name={name}
              onBlur={handleBlur}
              onChange={handleChange}
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
                      {" "}
                      {label}
                    </MenuItem>
                  ))
                : null}
            </TextField>
          </Grid>
        );
      }
    );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape(validationSchema)}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, ...rest }) => (
        <form onSubmit={handleSubmit} noValidate="off">
          <Grid container spacing={2}>
            {/* Here is the main form */}
            <EmployeeFormFields {...rest} />

            {/* Here are the main form actions */}
            <Grid item sm={12}>
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
                  {submitLabel}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

EmployeeForm.propTypes = {
  /**
   * Employee field values
   */
  employee: PropTypes.object(),
  /**
   * Form submission handler
   */
  onSubmit: PropTypes.func,
  /**
   * Form cancellation handler
   */
  onCancel: PropTypes.func,
  /**
   * Label for submit button
   */
  submitLabel: PropTypes.string,
};

export default EmployeeForm;
