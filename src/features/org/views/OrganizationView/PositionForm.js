import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { positionSchema } from "features/org/schemas/orgFormsSchema";

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

  const defaultValues = positionId
    ? positionsMap[positionId]
    : {
        title: "",
        description: "",
        parent: "",
        department: "",
        salary: 0,
        commision: 0,
      };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(positionSchema),
    defaultValues,
  });

  React.useEffect(() => {
    reset(
      positionId
        ? positionsMap[positionId]
        : {
            title: "",
            description: "",
            parent: "",
            department: "",
            salary: 0,
            commision: 0,
          },
    );
  }, [positionId, positionsMap, reset]);

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
          label="Job title"
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          {...register("title")}
          variant="outlined"
          margin="normal"
          size="small"
        />

        <TextField
          fullWidth
          label="Salary"
          error={Boolean(errors.salary)}
          helperText={errors.salary?.message}
          type="number"
          {...register("salary")}
          variant="outlined"
          margin="normal"
          size="small"
        />

        <TextField
          fullWidth
          label="Commision rate"
          error={Boolean(errors.commision)}
          helperText={errors.commision?.message}
          type="number"
          {...register("commision")}
          variant="outlined"
          margin="normal"
          size="small"
        />

        <TextField
          fullWidth
          select
          label="Parent position"
          error={Boolean(errors.parent)}
          helperText={errors.parent?.message}
          {...register("parent")}
          variant="outlined"
          margin="normal"
          size="small"
        >
          <MenuItem value="">Choose parent</MenuItem>
          {Object.values(positionsMap).map(({ _id, title: posTitle }) => (
            <MenuItem value={_id} key={_id}>
              {posTitle}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Department"
          error={Boolean(errors.department)}
          helperText={errors.department?.message}
          {...register("department")}
          variant="outlined"
          margin="normal"
          size="small"
        >
          <MenuItem value="">Choose department</MenuItem>
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
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
          {...register("description")}
          multiline
          rows={3}
          variant="outlined"
          margin="normal"
          size="small"
        />

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <ButtonGroup>
            <Button variant="outlined" onClick={onCancel} type="button" aria-label="cancel">
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit" aria-label="submit">
              {positionId ? submitLabel || "Update" : submitLabel || "Create"}
            </Button>
          </ButtonGroup>
        </Box>
      </form>
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
