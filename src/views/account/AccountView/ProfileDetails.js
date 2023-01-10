import React from "react";
import PropTypes from "prop-types";

import deepEqual from "deep-equal";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
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
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

import { Edit as EditIcon } from "react-feather";

const useStyles = makeStyles(() => ({
  root: {},
}));

const ProfileDetails = ({
  className,
  isUpdating,
  user,
  onUpdateAccount,
  ...rest
}) => {
  const classes = useStyles();
  const roles = ["Supervisor", "Admin", "Employee"].map((r) => ({
    label: r,
    value: String(r).toUpperCase(),
  }));
  const [editMode, setEditMode] = React.useState(false);
  const toggleEditMode = () => setEditMode(!editMode);

  return (
    <Formik
      initialValues={user}
      validationSchema={Yup.object({
        firstName: Yup.string(),
        lastName: Yup.string(),
        email: Yup.string(),
        phone: Yup.string(),
        password: Yup.string(),
        role: Yup.string(),
      })}
      onSubmit={(values) => {
        const { _id, firstName, lastName, email, role, activated, createdOn } =
          user;
        const userInfo = {
          _id,
          firstName,
          lastName,
          email,
          role,
          activated,
          createdOn,
        };
        const newUserInfo = Object.keys(userInfo).reduce(
          (prev, key) => Object.assign({}, prev, { [key]: values[key] }),
          {}
        );
        if (!deepEqual(userInfo, newUserInfo)) {
          onUpdateAccount(newUserInfo) && setEditMode(false);
        }
      }}
    >
      {({
        errors,
        touched,
        values,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          noValidate
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Card>
            <CardHeader
              subheader="The information can be edited"
              title="Profile"
              action={
                <>
                  {!editMode && (
                    <IconButton
                      onClick={toggleEditMode}
                      aria-label="edit profile"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </>
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
                  justify="center"
                  alignItems="center"
                >
                  <Typography
                    variant="h6"
                    component={"span"}
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontFamily: "Poppins",
                    }}
                    gutterBottom
                  >
                    <Typography
                      variant="h6"
                      component={"span"}
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#bdbdbd",
                        fontSize: "1.5rem",
                        marginBottom: "0.5rem",
                        fontFamily: "Poppins",
                        textTransform: "capitalize",
                      }}
                      gutterBottom
                    >
                      Joined In
                      <br />
                    </Typography>
                    {moment(user.createdOn).format("MMMM, Do YYYY")}({" "}
                    {moment(user.createdOn).fromNow()}){" "}
                  </Typography>
                  <Typography
                    variant="h1"
                    component={"span"}
                    style={{
                      fontWeight: "bold",
                    }}
                    gutterBottom
                  >
                    {user.activated ? (
                      <CheckCircleIcon style={{ color: "#009688" }} />
                    ) : (
                      <CancelIcon style={{ color: "#ff0000" }} />
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={Boolean(touched.firstName && errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    label="First name"
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.firstName}
                    variant="outlined"
                    margin="normal"
                    size="small"
                    disabled={editMode || !editMode}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    fullWidth
                    error={Boolean(touched.lastName && errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    label="Last name"
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    variant="outlined"
                    margin="normal"
                    size="small"
                    disabled={editMode || !editMode}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.email}
                    variant="outlined"
                    margin="normal"
                    size="small"
                    disabled={editMode || !editMode}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Select Role"
                    name="role"
                    onChange={handleChange}
                    required
                    select
                    value={values.role}
                    variant="outlined"
                    disabled={editMode || !editMode}
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
            {editMode && touched && (
              <>
                <Divider />
                <Box display="flex" justifyContent="flex-end" p={2}>
                  <ButtonGroup>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={
                        !(Object.keys(touched).length > 0) || isUpdating
                      }
                    >
                      {isUpdating ? <CircularProgress /> : "Save details"}
                    </Button>
                  </ButtonGroup>
                </Box>
              </>
            )}
          </Card>
        </form>
      )}
    </Formik>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  isUpdating: PropTypes.bool,
  user: PropTypes.object,
  onUpdateAccount: PropTypes.func,
};

export default ProfileDetails;
