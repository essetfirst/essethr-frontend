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

const PositionForm = ({
  positionId,
  positionsMap,
  departments,
  title,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  const formTitle =
    title || (positionId ? "Edit position details" : "Create new position");
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
          positionId
            ? positionsMap[positionId]
            : {
                title: "",
                description: "",
                parent: "",
                department: "",
                salary: 0,
                commission: 0,
              }
        }
        validationSchema={Yup.object({
          title: Yup.string().required("'Title' is required"),
          description: Yup.string(),
          parent: Yup.string(),
          department: Yup.string().required("'Department' is required"),
          salary: Yup.number().positive("'Salary' must be positive figure"),
          commision: Yup.number().positive(
            "'Commission Rate'  must be positive figure"
          ),
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
              label="Job title"
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              name="title"
              value={values.title}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              size="small"
            />

            <TextField
              fullWidth
              label="Salary"
              error={Boolean(touched.salary && errors.salary)}
              helperText={touched.salary && errors.salary}
              name="salary"
              type="number"
              value={values.salary}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              size="small"
            />

            <TextField
              fullWidth
              label="Commision rate"
              error={Boolean(touched.commision && errors.commision)}
              helperText={touched.commision && errors.commision}
              name="commision"
              type="number"
              value={values.commision}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              size="small"
            />

            <TextField
              fullWidth
              select
              label="Parent position"
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
              <MenuItem value={""}>Choose parent</MenuItem>
              {Object.values(positionsMap).map(({ _id, title }) => (
                <MenuItem value={_id} key={_id}>
                  {title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Department"
              error={Boolean(touched.department && errors.department)}
              helperText={touched.department && errors.department}
              name="department"
              value={values.department}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              size="small"
            >
              <MenuItem value={""}>Choose department</MenuItem>
              {departments.map(({ _id, name }) => (
                <MenuItem value={_id} key={_id}>
                  {name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              label="Job description"
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
              name="description"
              value={values.description}
              onBlur={handleBlur}
              onChange={handleChange}
              multiline
              rows={3}
              rowsMax={5}
              variant="outlined"
              margin="normal"
              size="small"
            />

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
                  {positionId ? "Update" : "Create"}
                </Button>
              </ButtonGroup>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

PositionForm.propTypes = {
  positionId: PropTypes.string,
  positionsMap: PropTypes.object.isRequired,
  departments: PropTypes.array.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default PositionForm;
