import React from "react";
import PropTypes from "prop-types";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

const LeaveTypeForm = ({ title, leaveType, onCancel, onSubmit }) => {
  const formTitle =
    title || (leaveType ? "Edit leave type" : "Create leave type");
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
          leaveType || {
            name: "",
            duration: "",
            color: "red",
            allowDaysFromPast: false,
          }
        }
        validationSchema={Yup.object({
          name: Yup.string().required("Name is required"),
          duration: Yup.string().required("Duration is required"),
          color: Yup.string(),
          allowDaysFromPast: Yup.boolean(),
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
              label="Leave type name"
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
              label="Leave type duration (in days)"
              error={Boolean(touched.duration && errors.duration)}
              helperText={touched.duration && errors.duration}
              type="number"
              name="duration"
              value={values.duration}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              size="small"
            />

            <TextField
              fullWidth
              select
              label="color"
              error={Boolean(touched.color && errors.color)}
              helperText={touched.color && errors.color}
              name="color"
              value={values.color}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              size="small"
            >
              <MenuItem value={""}>Choose color</MenuItem>
              {["white", "red", "green", ""].map((color) => (
                <MenuItem value={color} key={color}>
                  <Chip
                    style={{
                      backgroundColor: color,
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      marginRight: "5px",
                    }}
                  />{" "}
                  {color}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <FormControlLabel
                control={<Checkbox value="allowDaysFromPast" color="primary" />}
                label={"Allow dates from the past?"}
                name="allowDaysFromPast"
                value={values.allowDaysFromPast}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {Boolean(
                touched.allowDaysFromPast && errors.allowDaysFromPast
              ) && (
                <FormHelperText error>
                  {errors.allowDaysFromPast}
                </FormHelperText>
              )}
            </Box>

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
                  {leaveType ? "Update" : "Create"}
                </Button>
              </ButtonGroup>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

LeaveTypeForm.propTypes = {
  title: PropTypes.string,
  leaveType: PropTypes.object,
  submitLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default LeaveTypeForm;
