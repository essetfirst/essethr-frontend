import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import { holidaySchema } from "features/org/schemas/orgFormsSchema";

function normalizeHolidayDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

const HolidayForm = ({ holiday, title, onCancel, onSubmit }) => {
  const formTitle =
    title || (holiday ? "Edit holiday details" : "Add new holiday");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().slice(0, 10),
      halfDay: false,
      inPayroll: false,
    },
  });

  React.useEffect(() => {
    reset(
      holiday
        ? {
            ...holiday,
            date: normalizeHolidayDate(holiday.date),
          }
        : {
            name: "",
            date: new Date().toISOString().slice(0, 10),
            halfDay: false,
            inPayroll: false,
          },
    );
  }, [holiday, reset]);

  const halfDay = watch("halfDay");
  const inPayroll = watch("inPayroll");

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
          label="Name"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register("name")}
          variant="outlined"
          margin="normal"
          size="small"
        />

        <TextField
          fullWidth
          error={Boolean(errors.date)}
          helperText={errors.date?.message}
          label="Date"
          type="date"
          {...register("date")}
          variant="outlined"
          margin="normal"
          size="small"
          InputLabelProps={{ shrink: true }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(halfDay)}
              onChange={(e) => setValue("halfDay", e.target.checked)}
            />
          }
          label="Half day?"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(inPayroll)}
              onChange={(e) => setValue("inPayroll", e.target.checked)}
            />
          }
          label="Included in payroll?"
        />

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <ButtonGroup>
            <Button variant="outlined" onClick={onCancel} type="button" aria-label="cancel">
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit" aria-label="submit">
              {holiday ? "Update" : "Add"}
            </Button>
          </ButtonGroup>
        </Box>
      </form>
    </Box>
  );
};

HolidayForm.propTypes = {
  holiday: PropTypes.object,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default HolidayForm;
