import React from "react";

import { useNavigate } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  // Divider,
  Grid,
  // Hidden,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import API from "../../../api/org";
import useAuth from "../../../providers/auth";

import PageView from "../../../components/PageView";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const CreateOrgView = ({ org }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { auth } = useAuth();

  const [response, setResponse] = React.useState("");
  const [error, setError] = React.useState(false);

  const initialValues = {
    name: "",
    logo: "",
    branch: "",
    phone: "",
    email: "",
    address: "",
  };

  const handleSubmit = (orgInfo) => {
    // API.create(orgInfo)
    setError(false);
    setResponse("");
    (org
      ? API.editById(org.id, {
          ...orgInfo,
          updatedBy: auth & auth.user.email,
        })
      : API.create({
          ...orgInfo,
          createdBy: auth & auth.user.email,
        })
    )
      .then((json) => {
        setResponse(json.message || json.error);
        setError(!json.success);
      })
      .catch((e) => {
        setError(true);
        setResponse(e);
      });
  };

  const handleClose = () => {
    // Navigate to org list
    setError(false);
    setResponse("");
    !error && navigate("/", { replace: true });
  };

  //   React.useEffect(() => {
  //     // ??
  //   }, []);

  return (
    <PageView
      className={classes.root}
      pagetitle={org ? "Update organization" : "Create Organization"}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <Container maxWidth="sm">
          <Typography variant="h3" align="center" gutterBottom>
            {org ? "Update " : "Register new "} organization
          </Typography>

          {response && (
            <Box mb={2} p={1}>
              <Alert
                onClose={handleClose}
                severity={error ? "error" : "success"}
              >
                {String(response)}
              </Alert>
            </Box>
          )}

          <Formik
            initialValues={org ? org : initialValues}
            validationSchema={Yup.object({
              name: Yup.string().required("Name is required"),
              logo: Yup.string(),
              branch: Yup.string(),
              phone: Yup.string().required("Phone is required"),
              email: Yup.string().email(),
              address: Yup.string().required("Address is required"),
            })}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                      label="Organization Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.branch && errors.branch)}
                      helperText={touched.branch && errors.branch}
                      label="Branch"
                      name="branch"
                      value={values.branch}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.phone && errors.phone)}
                      helperText={touched.phone && errors.phone}
                      label="Phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                      label="Email address"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.address && errors.address)}
                      helperText={touched.address && errors.address}
                      label="Location/Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      type="submit"
                      color="primary"
                      onClick={handleSubmit}
                      variant="contained"
                      disabled={Boolean(isSubmitting && !error)}
                    >
                      {isSubmitting && !response && !error ? (
                        <CircularProgress color="primary" />
                      ) : org ? (
                        "Update"
                      ) : (
                        "Create"
                      )}
                    </Button>
                    <Box mt={1} />
                    <Button fullWidth variant="outlined" onClick={handleClose}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </PageView>
  );
};

export default CreateOrgView;
