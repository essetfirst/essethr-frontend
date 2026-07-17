import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Alert } from "@mui/lab";

import API from "api";
import useAuth from "features/auth/providers";
import { createOrgSchema } from "features/org/schemas/formSchemas";

import PageView from "components/PageView";
import LoadingComponent from "components/LoadingComponent";
import ErrorBoxComponent from "components/ErrorBoxComponent";

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

const emptyValues = {
  name: "",
  logo: "",
  branch: "",
  phone: "",
  email: "",
  address: "",
};

const OrganizationFormView = ({ org }) => {
  const { auth } = useAuth();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createOrgSchema),
    defaultValues: org || emptyValues,
  });

  React.useEffect(() => {
    reset(org || emptyValues);
  }, [org, reset]);

  const handleCreateOrganization = (orgInfo) => {
    dispatch({ type: types.REQUESTING });
    API.orgs
      .create(orgInfo)
      .then(({ success, error }) => {
        if (success) {
          dispatch({ type: types.REQUEST_SUCCESS });
        } else {
          dispatch({ type: types.REQUEST_FAILURE, error });
        }
      })
      .catch(() => {
        dispatch({ type: types.REQUEST_FAILURE, error: "Something went wrong." });
      });
  };

  const handleEditOrganization = (orgInfo) => {
    dispatch({ type: types.REQUESTING });
    API.orgs
      .edit(org._id, orgInfo)
      .then(({ success, error }) => {
        if (success) {
          dispatch({ type: types.REQUEST_SUCCESS });
        } else {
          dispatch({ type: types.REQUEST_FAILURE, error });
        }
      })
      .catch(() => {
        dispatch({ type: types.REQUEST_FAILURE, error: "Something went wrong." });
      });
  };

  const onSubmit = (values) => {
    const payload = {
      ...values,
      createdBy: auth?.user?.email,
    };
    org ? handleEditOrganization(payload) : handleCreateOrganization(payload);
  };

  const title = org ? "Edit organization" : "Create new organization";

  return (
    <PageView title={title} alignTitle="center">
      {(state.org || state.error) && (
        <Box mb={2} p={1}>
          <Alert onClose={() => {}} severity={state.error ? "error" : "success"}>
            {state.org ? (
              <Typography>
                {org
                  ? "Organization profile edited successfully."
                  : "Organization created successfully."}
                <Link href={`/app/orgs/${state.org}`}>View</Link>
              </Typography>
            ) : (
              <ErrorBoxComponent error={state.error} onRetry={handleSubmit(onSubmit)} />
            )}
          </Alert>
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              label="Organization Name"
              {...register("name")}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={Boolean(errors.branch)}
              helperText={errors.branch?.message}
              label="Branch"
              {...register("branch")}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              label="Phone"
              {...register("phone")}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              label="Email address"
              {...register("email")}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={Boolean(errors.address)}
              helperText={errors.address?.message}
              label="Location/Address"
              {...register("address")}
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
              {state.requesting ? <LoadingComponent /> : org ? "Update" : "Create"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </PageView>
  );
};

export default OrganizationFormView;
