import React from "react";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Alert } from "@mui/lab";

import API from "api";
import useAuth from "features/auth/providers";
import { createOrgSchema } from "features/org/schemas/formSchemas";

import PageView from "components/PageView";

const StyledRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
}));

const emptyValues = {
  name: "",
  logo: "",
  branch: "",
  phone: "",
  email: "",
  address: "",
};

const CreateOrgView = ({ org }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [response, setResponse] = React.useState("");
  const [error, setError] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createOrgSchema),
    defaultValues: org || emptyValues,
  });

  React.useEffect(() => {
    reset(org || emptyValues);
  }, [org, reset]);

  const onSubmit = (orgInfo) => {
    setError(false);
    setResponse("");
    setSubmitting(true);
    (org
      ? API.orgs.editById(org.id || org._id, {
          ...orgInfo,
          updatedBy: auth?.user?.email,
        })
      : API.orgs.create({
          ...orgInfo,
          createdBy: auth?.user?.email,
        })
    )
      .then((json) => {
        setResponse(json.message || json.error);
        setError(!json.success);
      })
      .catch((e) => {
        setError(true);
        setResponse(String(e));
      })
      .finally(() => setSubmitting(false));
  };

  const handleClose = () => {
    setError(false);
    setResponse("");
    if (!error) navigate("/", { replace: true });
  };

  return (
    <PageView
      pagetitle={org ? "Update organization" : "Create Organization"}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <Container maxWidth="sm">
          <Typography variant="h3" align="center" gutterBottom>
            {org ? "Update " : "Register new "} organization
          </Typography>

          {response && (
            <Box mb={2} p={1}>
              <Alert onClose={handleClose} severity={error ? "error" : "success"}>
                {String(response)}
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
                  disabled={submitting && !error}
                >
                  {submitting && !response && !error ? (
                    <CircularProgress color="primary" size={24} />
                  ) : org ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
                <Box mt={1} />
                <Button fullWidth variant="outlined" type="button" onClick={handleClose}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
    </PageView>
  );
};

export default CreateOrgView;
