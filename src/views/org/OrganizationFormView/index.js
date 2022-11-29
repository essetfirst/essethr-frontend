import React from "react";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import API from "../../../api";
import useAuth from "../../../providers/auth";

import PageView from "../../../components/PageView";
import LoadingComponent from "../../../components/LoadingComponent";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_FAILURE: "REQUEST_FAILURE",
};
const initialState = { org: null, requesting: false, error: null };
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, requesting: true, error: null };
    case types.REQUEST_SUCCESS:
      return { ...state, org: payload, requesting: false, error: null };
    case types.REQUEST_FAILURE:
      return { ...state, requesting: false, error };
    default:
      return state;
  }
};

const OrganizationFormView = ({ org }) => {
  const { auth } = useAuth();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleCreateOrganization = (orgInfo) => {
    dispatch({ type: types.REQUESTING });
    API.orgs
      .create(orgInfo)
      .then(({ success, error }) => {
        if (success) {
          dispatch({ type: types.REQUEST_SUCCESS });
          // Navigate to orgs
        } else {
          dispatch({
            type: types.REQUEST_FAILURE,
            error,
          });
        }
      })
      .catch((e) => {
        dispatch({
          type: types.REQUEST_FAILURE,
          error: "Something went wrong.",
        });
      });
  };

  const handleEditOrganization = (orgInfo) => {
    dispatch({ type: types.REQUESTING });
    API.orgs
      .edit(org._id, orgInfo)
      .then(({ success, error }) => {
        if (success) {
          dispatch({ type: types.REQUEST_SUCCESS });
          // Navigate to
        } else {
          dispatch({
            type: types.REQUEST_FAILURE,
            error,
          });
        }
      })
      .catch((e) => {
        dispatch({
          type: types.REQUEST_FAILURE,
          error: "Something went wrong.",
        });
      });
  };

  const handleFormSubmit = (values) => {
    org ? handleEditOrganization(values) : handleCreateOrganization(values);
  };

  const title = org ? "Edit organization" : "Create new organization";
  const initialValues = org
    ? org
    : {
        name: "",
        logo: "",
        branch: "",
        phone: "",
        email: "",
        address: "",
      };

  return (
    <PageView title={title} alignTitle="center">
      {(state.org || state.error) && (
        <Box mb={2} p={1}>
          <Alert
            onClose={() => {}}
            severity={state.error ? "error" : "success"}
          >
            {state.org ? (
              <Typography>
                {org
                  ? "Organization profile edited successfully."
                  : "Organization created successfully."}
                <Link href={`/app/orgs/${state.org}`}>View</Link>
              </Typography>
            ) : (
              <ErrorBoxComponent
                error={state.error}
                onRetry={handleFormSubmit}
              />
            )}
          </Alert>
        </Box>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          name: Yup.string().required("'Name' is required"),
          logo: Yup.string(),
          branch: Yup.string(),
          phone: Yup.string().required("'Phone' is required"),
          email: Yup.string().email("Invalid 'Email'"),
          address: Yup.string().required("'Address' is required"),
        })}
        onSubmit={(values) => {
          handleFormSubmit({
            ...values,
            createdBy: auth.user && auth.user.email,
          });
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
                  variant="contained"
                  disabled={Boolean(isSubmitting && !state.error)}
                >
                  {state.is ? <LoadingComponent /> : org ? "Update" : "Create"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </PageView>
  );
};

export default OrganizationFormView;
