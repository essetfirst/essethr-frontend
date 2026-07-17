import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { buildLeaveRequestSchema } from "features/leaves/schemas/leaveRequestSchema";

const StyledRoot = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledFormControl = styled("div")(({ theme }) => ({
  margin: theme.spacing(1, 0),
    minWidth: 120,
}));

const durations = [
  { label: "First half of the day", value: 1 },
  { label: "Second half of the day", value: 2 },
  { label: "Single day", value: 3 },
  { label: "Several days", value: 4 },
];

const RequestForm = ({
  employees,
  leaveTypes,
  onRequestSubmitted,
  onCancel,
}) => {
  const schema = React.useMemo(
    () => buildLeaveRequestSchema(leaveTypes),
    [leaveTypes],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: "-1",
      leaveType: "-1",
      duration: 1,
      from: new Date().toISOString().slice(0, 10),
      to: new Date().toISOString().slice(0, 10),
      comment: "",
    },
  });

  const computeDateDiff = (d1, d2) =>
    Math.abs(new Date(d1).getTime() - new Date(d2).getTime()) / (24 * 3600000);

  const onSubmit = (values) => {
    let requestInfo = { ...values };

    if (values.duration === 1 || values.duration === 2) {
      requestInfo.duration = 0.5;
      requestInfo.to = values.from;
    } else if (values.duration === 3) {
      requestInfo.duration = 1;
    } else {
      requestInfo.duration = computeDateDiff(values.from, values.to);
    }

    onRequestSubmitted(requestInfo);
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box p={2}>
          <Typography variant="h3" align="center" gutterBottom>
            Request time-off
          </Typography>
          <Box flexGrow={1} mt={1} mb={1} />
          <Divider />
          <Box flexGrow={1} mt={1} mb={1} />
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <StyledFormControl
                  fullWidth
                 >
                  error={Boolean(errors.employeeId)}
                  variant="outlined"
                  margin="normal"
                >
                  <InputLabel id="employeeSelect">Employee</InputLabel>
                  <Select
                    id="employeeSelect"
                    label="Employee"
                    defaultValue="-1"
                    {...register("employeeId")}
                  >
                    <MenuItem value="-1">Select Employee</MenuItem>
                    {employees.map(({ _id, firstName, lastName }) => (
                      <MenuItem key={_id} value={_id}>
                        {`${firstName} ${lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.employeeId?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <StyledFormControl
                 >
                  error={Boolean(errors.leaveType)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  <InputLabel shrink htmlFor="leaveTypeSelect">
                    Leave type
                  </InputLabel>
                  <Select
                    id="leaveTypeSelect"
                    label="Leave type"
                    defaultValue="-1"
                    {...register("leaveType")}
                  >
                    <MenuItem value="-1">Choose</MenuItem>
                    {leaveTypes.map(({ label, value }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.leaveType?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <StyledFormControl
                 >
                  error={Boolean(errors.duration)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  <InputLabel shrink htmlFor="durationSelect">
                    Duration
                  </InputLabel>
                  <Select
                    id="durationSelect"
                    label="Duration"
                    defaultValue={1}
                    {...register("duration")}
                  >
                    {durations.map(({ label, value }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.duration?.message}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledFormControl
                 >
                  error={Boolean(errors.from)}
                  helperText={errors.from?.message}
                  label="Start Date"
                  type="date"
                  {...register("from")}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledFormControl
                 >
                  error={Boolean(errors.to)}
                  helperText={errors.to?.message}
                  label="End Date"
                  type="date"
                  {...register("to")}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledFormControl
                 >
                  error={Boolean(errors.comment)}
                  helperText={errors.comment?.message}
                  label="Comment"
                  {...register("comment")}
                  placeholder="Write your reason"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth type="submit" variant="contained" color="primary">
                  Submit Request
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="outlined" type="button" onClick={onCancel}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </Container>
  );
};

RequestForm.propTypes = {
  employees: PropTypes.array.isRequired,
  allowances: PropTypes.array,
  leaveTypes: PropTypes.array.isRequired,
  onRequestSubmitted: PropTypes.func,
  onCancel: PropTypes.func,
};

export default RequestForm;
