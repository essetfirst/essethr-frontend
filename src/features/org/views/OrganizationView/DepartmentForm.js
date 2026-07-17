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

import { departmentSchema } from "features/org/schemas/orgFormsSchema";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: departmentId
      ? departmentsMap[departmentId]
      : { name: "", location: "", parent: "" },
  });

  React.useEffect(() => {
    reset(
      departmentId
        ? departmentsMap[departmentId]
        : { name: "", location: "", parent: "" },
    );
  }, [departmentId, departmentsMap, reset]);

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
          label="Department name"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register("name")}
          variant="outlined"
          margin="normal"
          size="small"
        />

        <TextField
          fullWidth
          label="Location"
          error={Boolean(errors.location)}
          helperText={errors.location?.message}
          {...register("location")}
          variant="outlined"
          margin="normal"
          size="small"
        />

        <TextField
          fullWidth
          select
          label="Parent department"
          error={Boolean(errors.parent)}
          helperText={errors.parent?.message}
          {...register("parent")}
          variant="outlined"
          margin="normal"
          size="small"
        >
          <MenuItem value="">Choose department</MenuItem>
          {Object.values(departmentsMap).map(({ _id, name }) => (
            <MenuItem value={_id} key={_id}>
              {name}
            </MenuItem>
          ))}
        </TextField>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <ButtonGroup>
            <Button variant="outlined" onClick={onCancel} type="button" aria-label="cancel">
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit" aria-label="submit">
              {departmentId ? submitLabel || "Update " : submitLabel || "Create "}
            </Button>
          </ButtonGroup>
        </Box>
      </form>
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
