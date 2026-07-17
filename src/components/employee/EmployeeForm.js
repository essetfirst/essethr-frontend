import React from "react";
import PropTypes from "prop-types";
import {
  Grid, TextField, MenuItem, Typography, FormControlLabel, Checkbox, Box,
} from "@mui/material";

import { employeeFormFields, getEmployeeFormFields } from "./data";
import FormikFormFields from "components/common/FormikFormFields";
import API from "api";
import useOrg from "features/org/providers";

/** Build Formik field specs from org custom field definitions. */
export function buildCustomFieldFormFields(customFields = []) {
  return customFields
    .filter((f) => f.section === "employee" || !f.section)
    .map((f) => ({
      label: f.label,
      name: `customFieldValues.${f.key}`,
      type: f.type === "number" ? "number" : f.type === "date" ? "date" : "text",
      select: f.type === "select",
      selectOptions: (f.options || []).map((o) => ({
        value: o,
        label: o,
      })),
      GridProps: { sm: 12, md: 6, lg: 4 },
    }));
}

/** Render custom fields bound to form values.customFieldValues */
export function CustomEmployeeFieldsSection({
  customFields,
  values,
  handleChange,
  handleBlur,
  touched,
  errors,
  setFieldValue,
}) {
  const fields = (customFields || []).filter((f) => f.section === "employee" || !f.section);
  if (!fields.length) return null;

  return (
    <Box mt={2}>
      <Typography variant="subtitle1" gutterBottom>Custom fields</Typography>
      <Grid container spacing={2}>
        {fields.map((f) => {
          const name = `customFieldValues.${f.key}`;
          const value = values.customFieldValues?.[f.key] ?? "";
          const touchedField = touched?.customFieldValues?.[f.key];
          const errorField = errors?.[f.key];
          const errorMessage = errorField?.message || errorField;
          const showError = touched
            ? Boolean(touchedField && errorMessage)
            : Boolean(errorMessage);

          if (f.type === "boolean") {
            return (
              <Grid item xs={12} sm={6} md={4} key={f.key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(value)}
                      onChange={(e) => setFieldValue(name, e.target.checked)}
                      name={name}
                      color="primary"
                    />
                  }
                  label={f.label}
                />
              </Grid>
            );
          }

          return (
            <Grid item xs={12} sm={6} md={4} key={f.key}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label={f.label}
                name={name}
                type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                select={f.type === "select"}
                value={value}
                onChange={
                  handleChange ||
                  ((e) => setFieldValue(name, e.target.value))
                }
                onBlur={handleBlur}
                error={showError}
                helperText={showError ? errorMessage : undefined}
                InputLabelProps={f.type === "date" ? { shrink: true } : undefined}
              >
                {f.type === "select" &&
                  (f.options || []).map((o) => (
                    <MenuItem key={o} value={o}>{o}</MenuItem>
                  ))}
              </TextField>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

CustomEmployeeFieldsSection.propTypes = {
  customFields: PropTypes.array,
  values: PropTypes.object,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  touched: PropTypes.object,
  errors: PropTypes.object,
  setFieldValue: PropTypes.func,
};

export const CustomEmployeeFields = CustomEmployeeFieldsSection;

export function buildCustomFieldValues(customFields = [], employee = null) {
  const existing = employee?.customFieldValues || {};
  const out = { ...existing };
  customFields
    .filter((f) => f.section === "employee" || !f.section)
    .forEach((f) => {
      if (out[f.key] === undefined) {
        out[f.key] = f.type === "boolean" ? false : "";
      }
    });
  return out;
}

export function useEmployeeCustomFields() {
  const { org } = useOrg();
  const orgId = org?._id || org?.id;
  const [customFields, setCustomFields] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    API.settings.get(orgId).then((res) => {
      if (res?.success) setCustomFields(res.settings?.customFields || []);
      setLoading(false);
    });
  }, [orgId]);

  return { customFields, loading, orgId };
}

const EmployeeForm = ({ employee, formFields, orgId: orgIdProp, submitLabel, onSubmit, ...rest }) => {
  const { org } = useOrg();
  const orgId = orgIdProp || org?._id || org?.id;
  const [customFields, setCustomFields] = React.useState([]);

  React.useEffect(() => {
    if (!orgId) return;
    API.settings.get(orgId).then((res) => {
      if (res?.success) setCustomFields(res.settings?.customFields || []);
    });
  }, [orgId]);

  const mergedFields = React.useMemo(() => {
    const base = Array.isArray(formFields) && formFields.length > 0
      ? formFields
      : getEmployeeFormFields(org);
    return [...base, ...buildCustomFieldFormFields(customFields)];
  }, [formFields, customFields, org]);

  const initialValues = React.useMemo(() => ({
    ...employee,
    customFieldValues: employee?.customFieldValues || {},
  }), [employee]);

  const handleSubmit = (values, formikBag) => {
    const { customFieldValues, ...restValues } = values;
    onSubmit?.(
      { ...restValues, customFieldValues: customFieldValues || {} },
      formikBag
    );
  };

  return (
    <FormikFormFields
      formFields={mergedFields}
      initialValues={initialValues}
      submitActionButtonLabel={submitLabel}
      onSubmit={handleSubmit}
      {...rest}
    />
  );
};

EmployeeForm.propTypes = {
  employee: PropTypes.object,
  formFields: PropTypes.array,
  orgId: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  submitLabel: PropTypes.string,
};

export default EmployeeForm;
