import React from "react";
import PropTypes from "prop-types";

import { Grid, MenuItem, TextField } from "@material-ui/core";

const FormikFormFields = ({ formFields, formikProps }) => {
  return (
    <Grid container spacing={2}>
      {formFields.map(
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
      )}
    </Grid>
  );
};

FormikFormFields.propTypes = {
  formFields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["text", "number", "tel", "email", "date", "time"]),
      name: PropTypes.string,
      required: PropTypes.bool,
      select: PropTypes.bool,
      selectOptions: PropTypes.arrayOf(
        PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })
      ),
      label: PropTypes.string,
      placeholder: PropTypes.string,
    })
  ),
  formikProps: PropTypes.shape({
    errors: PropTypes.object,
    touched: PropTypes.object,
    values: PropTypes.object,
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
  }),
};

export default FormikFormFields;
