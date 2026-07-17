import deepEqual from "deep-equal";
import { fmt, fromNow } from "utils/date";
import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import clsx from "clsx";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { Edit as EditIcon } from "react-feather";
import { profileSchema } from "features/org/schemas/formSchemas";

const ProfileDetails = ({
  className,
  isUpdating,
  user,
  onUpdateAccount,
  ...rest
}) => {
  const roles = ["Supervisor", "Admin", "Employee"].map((r) => ({
    label: r,
    value: String(r).toUpperCase(),
  }));
  const [editMode, setEditMode] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  });

  React.useEffect(() => {
    reset(user);
  }, [user, reset]);

  const onSubmit = (values) => {
    const { _id, firstName, lastName, email, role, activated, createdOn } = user;
    const userInfo = { _id, firstName, lastName, email, role, activated, createdOn };
    const newUserInfo = Object.keys(userInfo).reduce(
      (prev, key) => Object.assign({}, prev, { [key]: values[key] }),
      {},
    );
    if (!deepEqual(userInfo, newUserInfo)) {
      onUpdateAccount(newUserInfo) && setEditMode(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      noValidate
      className={clsx(className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
          action={
            !editMode && (
              <IconButton onClick={() => setEditMode(true)} aria-label="edit profile">
                <EditIcon />
              </IconButton>
            )
          }
        />

        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid
              item
              xs
              container
              spacing={3}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6" component="span" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", fontFamily: "Poppins" }}>
                <Typography
                  variant="h6"
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#bdbdbd",
                    fontSize: "1.5rem",
                    mb: 0.5,
                    fontFamily: "Poppins",
                    textTransform: "capitalize",
                  }}
                  gutterBottom
                >
                  Joined In
                  <br />
                </Typography>
                {fmt(user.createdOn, "MMMM, do yyyy")} ({fromNow(user.createdOn)})
              </Typography>
              <Typography variant="h1" component="span" sx={{ fontWeight: "bold" }} gutterBottom>
                {user.activated ? (
                  <CheckCircleIcon sx={{ color: "#009688" }} />
                ) : (
                  <CancelIcon sx={{ color: "#ff0000" }} />
                )}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
                label="First name"
                {...register("firstName")}
                required
                variant="outlined"
                margin="normal"
                size="small"
                disabled={!editMode}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                required
                fullWidth
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
                label="Last name"
                {...register("lastName")}
                variant="outlined"
                margin="normal"
                size="small"
                disabled={!editMode}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                label="Email Address"
                {...register("email")}
                required
                variant="outlined"
                margin="normal"
                size="small"
                disabled={!editMode}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Select Role"
                select
                {...register("role")}
                required
                variant="outlined"
                disabled={!editMode}
              >
                {roles.map(({ label, value }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        {editMode && (
          <>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2}>
              <ButtonGroup>
                <Button
                  size="small"
                  variant="outlined"
                  type="button"
                  onClick={() => {
                    reset(user);
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={!isDirty || isUpdating}
                >
                  {isUpdating ? <CircularProgress size={20} /> : "Save details"}
                </Button>
              </ButtonGroup>
            </Box>
          </>
        )}
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  isUpdating: PropTypes.bool,
  user: PropTypes.object,
  onUpdateAccount: PropTypes.func,
};

export default ProfileDetails;
