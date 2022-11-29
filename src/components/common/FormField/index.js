import React from "react";

import { MenuItem, TextField } from "@material-ui/core";

const FormField = ({
  select,
  options,
  name,
  touched,
  errors,
  values,
  handleBlur,
  handleChange,
  ...rest
}) => {
  return (
    <TextField
      select={select}
      name={name}
      error={Boolean(touched[name] && errors[name])}
      helperText={touched[name] && errors[name]}
      value={values[name]}
      onBlur={handleBlur(name)}
      onChange={handleChange(name)}
      variant="outlined"
      margin="normal"
      {...rest}
    >
      {select && options && Array.isArray(options)
        ? options.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))
        : null}
    </TextField>
  );
};

export default FormField;