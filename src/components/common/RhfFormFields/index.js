import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Box, Button, Divider, Grid, MenuItem, TextField } from "@mui/material";

function buildDefaults(formFields = []) {
  return formFields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? "";
    return acc;
  }, {});
}

function buildSchemaFromFields(formFields = []) {
  const shape = {};
  formFields.forEach((field) => {
    if (field.zodSchema) {
      shape[field.name] = field.zodSchema;
    } else if (field.required) {
      shape[field.name] = z.any().refine(
        (v) => v !== "" && v != null && v !== -1 && v !== "-1",
        `${field.label || field.name} is required`,
      );
    } else {
      shape[field.name] = z.any().optional();
    }
  });
  return z.object(shape);
}

const RhfFormFields = ({
  initialValues,
  validationSchema,
  formFields,
  cancelActionButtonLabel = "Cancel",
  submitActionButtonLabel = "Submit",
  onSubmit,
  onCancel,
  actions,
}) => {
  const schema = validationSchema || buildSchemaFromFields(formFields);
  const defaults = initialValues || buildDefaults(formFields);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  React.useEffect(() => {
    reset(initialValues || buildDefaults(formFields));
  }, [formFields, initialValues, reset]);

  const submitHandler = (values) => {
    onSubmit?.(values, { resetForm: () => reset(initialValues || buildDefaults(formFields)) });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} noValidate>
      <Grid container spacing={2}>
        {formFields.map(
          (
            {
              label,
              name,
              type = "text",
              required = false,
              select = false,
              selectOptions = [],
              GridProps,
              ...rest
            },
            index,
          ) => (
            <Grid item {...GridProps} key={`${name}-${index}`}>
              <TextField
                fullWidth
                required={required}
                select={select}
                error={Boolean(errors[name])}
                helperText={errors[name]?.message}
                label={label}
                type={type}
                {...register(name)}
                variant="outlined"
                size="small"
                margin="normal"
                InputLabelProps={type === "date" ? { shrink: true } : undefined}
                {...rest}
              >
                {select
                  ? selectOptions.map(({ value, label: optLabel }, optIndex) => (
                      <MenuItem value={value} key={`${value}-${optIndex}`}>
                        {optLabel}
                      </MenuItem>
                    ))
                  : null}
              </TextField>
            </Grid>
          ),
        )}

        <Grid item sm={12}>
          <Divider />
          <Box mt={2}>
            {actions ? (
              (React.isValidElement(actions) && actions) ||
              (Array.isArray(actions) &&
                actions.map(({ label, onClick, ...rest }, index) => (
                  <Button onClick={onClick} {...rest} key={index}>
                    {label}
                  </Button>
                )))
            ) : (
              <>
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  size="small"
                  type="submit"
                  sx={{ mb: 1 }}
                >
                  {submitActionButtonLabel}
                </Button>
                <Button fullWidth onClick={onCancel} variant="outlined" size="small" type="button">
                  {cancelActionButtonLabel}
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

RhfFormFields.propTypes = {
  initialValues: PropTypes.object,
  validationSchema: PropTypes.object,
  formFields: PropTypes.arrayOf(PropTypes.object),
  submitActionButtonLabel: PropTypes.node,
  cancelActionButtonLabel: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  actions: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};

export default RhfFormFields;
