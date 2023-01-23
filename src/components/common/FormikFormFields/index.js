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

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const FormikFormFields = ({
  initialValues,
  validationSchema,
  formFields,
  cancelActionButtonLabel = "Cancel",
  submitActionButtonLabel = "Submit",
  onSubmit,
  onCancel,
  actions,
}) => {
  const classes = useStyles();

  let defaultInitialValues = {};
  let defaultValidationSchema = {};

  const defaultFormFieldValue = "";

  const FormFields = (formikProps) =>
    formFields.map(
      (
        {
          label,
          name,
          type = "text",
          required = false,
          select = false,
          onBlur,
          onChange,
          defaultValue,
          validation,
          selectOptions,
          GridProps,
          ...rest
        },
        index
      ) => {
        defaultInitialValues[name] = defaultValue || defaultFormFieldValue;
        defaultValidationSchema[name] = validation;

        const { values, errors, touched, handleBlur, handleChange } =
          formikProps;
        return (
          <Grid item {...GridProps} key={index}>
            <TextField
              fullWidth
              required={required}
              select={select}
              error={Boolean(touched[name] && errors[name])}
              helperText={touched[name] && errors[name]}
              label={label}
              type={type}
              name={name}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values[name]}
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
      initialValues={initialValues || defaultInitialValues}
      validationSchema={
        validationSchema !== undefined && validationSchema
          ? validationSchema
          : Yup.object(defaultValidationSchema)
      }
      onSubmit={onSubmit}
    >
      {({ handleSubmit, ...rest }) => (
        <form onSubmit={handleSubmit} noValidate="off">
          <Grid container spacing={2}>
            {/* Here is the main form */}
            <FormFields {...rest} />

            {/* Here are the main form actions */}
            <Grid item sm={12}>
              {/* <Box mt={2} flexGrow={1} /> */}
              <Divider />
              <Box mt={2}>
                {actions ? (
                  (React.isValidElement(actions) && actions) ||
                  (Array.isArray(actions) &&
                    actions.map(({ label, onClick, ...rest }, index) => (
                      <Button
                        className={classes.button}
                        onClick={onClick}
                        {...rest}
                        key={index}
                      >
                        {label}
                      </Button>
                    )))
                ) : (
                  <>
                    <Button
                      fullWidth
                      className={classes.button}
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={handleSubmit}
                    >
                      {submitActionButtonLabel}
                    </Button>
                    <Button
                      fullWidth
                      className={classes.button}
                      onClick={onCancel}
                      variant="outlined"
                      size="small"
                    >
                      {cancelActionButtonLabel}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

FormikFormFields.propTypes = {
  /**
   * Default values of form fields
   */
  initialValues: PropTypes.object,

  /**
   * Validation schema to validate form field values with
   */
  validationSchema: PropTypes.object,

  /**
   * List of fields the form is made of
   */
  formFields: PropTypes.arrayOf(PropTypes.object),

  /**
   * Submit button label text
   */
  submitActionButtonLabel: PropTypes.string,

  /**
   * Cancel button label text
   */
  cancelActionButtonLabel: PropTypes.string,

  /**
   * Handler of form submission
   */
  onSubmit: PropTypes.func,

  /**
   * Handler of cancel button click
   */
  onCancel: PropTypes.func,

  /**
   * List of custom actions
   */
  actions: PropTypes.array,
};

export default FormikFormFields;
