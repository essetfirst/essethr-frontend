import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
} from "@mui/material";

import { leaveTypeSchema } from "features/org/schemas/orgFormsSchema";

const LeaveTypeForm = ({ title, leaveType, onCancel, onSubmit }) => {
  const formTitle =
    title || (leaveType ? "Edit leave type" : "Create leave type");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      name: "",
      duration: "",
      color: "red",
      allowDaysFromPast: false,
    },
  });

  React.useEffect(() => {
    reset(
      leaveType || {
        name: "",
        duration: "",
        color: "red",
        allowDaysFromPast: false,
      },
    );
  }, [leaveType, reset]);

  const allowDaysFromPast = watch("allowDaysFromPast");

  return (
    <Box p={2}>
      <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ fontFamily: "Poppins" }}>
        {formTitle}
      </Typography>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          required
          fullWidth
          label="Leave type name"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register("name")}
          variant="outlined"
          margin="normal"
          size="small"
        />

        <TextField
          fullWidth
          label="Leave type duration (in days)"
          error={Boolean(errors.duration)}
          helperText={errors.duration?.message}
          type="number"
          {...register("duration")}
          variant="outlined"
          margin="normal"
          size="small"
        />

        <TextField
          fullWidth
          select
          label="color"
          error={Boolean(errors.color)}
          helperText={errors.color?.message}
          {...register("color")}
          variant="outlined"
          margin="normal"
          size="small"
        >
          <MenuItem value="">Choose color</MenuItem>
          {["white", "red", "green", ""].map((color) => (
            <MenuItem value={color} key={color || "default"}>
              <Chip
                sx={{
                  backgroundColor: color || "grey.300",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  mr: 0.5,
                }}
              />
              {color || "default"}
            </MenuItem>
          ))}
        </TextField>

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={Boolean(allowDaysFromPast)}
                onChange={(e) => setValue("allowDaysFromPast", e.target.checked)}
              />
            }
            label="Allow dates from the past?"
          />
          {errors.allowDaysFromPast?.message && (
            <FormHelperText error>{errors.allowDaysFromPast.message}</FormHelperText>
          )}
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <ButtonGroup>
            <Button variant="outlined" onClick={onCancel} type="button" aria-label="cancel">
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit" aria-label="submit">
              {leaveType ? "Update" : "Create"}
            </Button>
          </ButtonGroup>
        </Box>
      </form>
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
