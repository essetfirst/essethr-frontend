import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

const DepartmentForm = ({
  departmentId,
  departmentsMap,
  title,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  const formTitle =
    title ||
    (departmentId ? "Edit department details" : "Create new department");
  return (
    <Box p={2}>
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        align="center"
        style={{
          fontFamily: "Poppins",
        }}
      >
        {formTitle}
      </Typography>
      <Divider />
      <Formik
        initialValues={
          departmentId
            ? departmentsMap[departmentId]
            : {
                name: "",
                location: "",
                parent: "",
              }
        }
        validationSchema={Yup.object({
          name: Yup.string().required("Name is required"),
          location: Yup.string(),
          parent: Yup.string(),
        })}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              label="Department name"
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
              name="name"
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              size="small"
            />

            <TextField
              fullWidth
              label="Location"
              error={Boolean(touched.location && errors.location)}
              helperText={touched.location && errors.location}
              name="location"
              value={values.location}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              size="small"
            />

            <TextField
              fullWidth
              select
              label="Parent department"
              error={Boolean(touched.parent && errors.parent)}
              helperText={touched.parent && errors.parent}
              name="parent"
              value={values.parent}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              size="small"
            >
              <MenuItem value={""}>Choose department</MenuItem>
              {Object.values(departmentsMap).map(({ _id, name }) => (
                <MenuItem value={_id} key={_id}>
                  {name}
                </MenuItem>
              ))}
            </TextField>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <ButtonGroup>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  aria-label="cancel"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  aria-label="submit"
                >
                  {departmentId
                    ? submitLabel || "Update "
                    : submitLabel || "Create "}
                </Button>
              </ButtonGroup>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

DepartmentForm.propTypes = {
  departmentId: PropTypes.string,
  departmentsMap: PropTypes.object.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default DepartmentForm;
