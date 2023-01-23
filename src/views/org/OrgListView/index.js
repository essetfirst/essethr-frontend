import React from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  // Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
  makeStyles,
  // ButtonGroup,
} from "@material-ui/core";

// import Alert from "@material-ui/lab/Alert";

import {
  AddOutlined as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlineOutlined as DeleteIcon,
  SearchOutlined as SearchIcon,
} from "@material-ui/icons";

import PageView from "../../../components/PageView";
import TableComponent from "../../../components/TableComponent";

import API from "../../../api";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS_FETCH: "REQUEST_SUCCESS_FETCH",
  REQUEST_SUCCESS_DELETE: "REQUEST_SUCCESS_DELETE",
  REQUEST_FAILURE: "REQUEST_FAILURE",
};
const initialState = { orgs: [], requesting: false, error: null };
const reducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, requesting: true, error: null };
    case types.REQUEST_SUCCESS_FETCH:
      return { ...state, orgs: payload, requesting: false, error: null };
    case types.REQUEST_FAILURE:
      return { ...state, requesting: false, error };

    case types.REQUEST_SUCCESS_DELETE:
      const oIndex = state.orgs.findIndex((o) => o._id === payload);
      return {
        ...state,
        orgs: [...state.orgs.slice(0, oIndex), ...state.slice(oIndex + 1)],
        requesting: false,
        error: null,
      };

    case "RESET_ERROR":
      return { ...state, error: null };
    case "RESET":
      return { ...state, orgs: [], requesting: false, error: null };
    default:
      return state;
  }
};

const OrgListView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const [filters, setFilters] = React.useState({
    searchTerm: "",
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  async function fetchOrgs() {
    dispatch({ type: types.REQUESTING });
    await API.orgs
      .getAll({ query: {} })
      .then(({ success, orgs, error }) => {
        success
          ? dispatch({ type: types.REQUEST_SUCCESS_FETCH, payload: orgs })
          : dispatch({ type: types.REQUEST_FAILURE, error });
      })
      .catch((e) => {
        console.error(e);
        dispatch({
          type: types.REQUEST_FAILURE,
          error: "Something went wrong.",
        });
      });
  }

  React.useEffect(() => {
    // Fetch all orgs and their associated departments
    fetchOrgs();
  }, []);

  function deleteOrg(orgId) {
    dispatch({ type: types.REQUESTING });
    API.orgs
      .deleteById(orgId)
      .then(({ success, org, error }) => {
        success
          ? dispatch({
              type: types.REQUEST_SUCCESS_DELETE,
              payload: org || orgId,
            })
          : dispatch({ type: types.REQUEST_FAILURE, error });

        // Reload page again
        success && fetchOrgs();
      })
      .catch((e) => {
        console.error(e.message);
        dispatch({
          type: types.REQUEST_FAILURE,
          error: "Something went wrong.",
        });
      });
  }

  const handleCreateClick = () => {
    navigate("/app/orgs/new", { replace: true });
  };
  const handleEditClick = (_id) => () => {
    navigate("/app/orgs/" + _id, { replace: true });
  };
  const handleDeleteClick = (id) => () => {
    deleteOrg(id);
  };

  return (
    <PageView
      className={classes.root}
      title="Organizations"
      actions={[
        {
          label: "Create",
          icon: { node: <AddIcon /> },
          handler: handleCreateClick,
          otherProps: {
            variant: "contained",
            color: "primary",
            size: "small",
          },
        },
      ]}
    >
      {/* {deleteResponse && !deleteError && (
        <Box mb={2}>
          <Alert onClose={handleDeleteMessageClose} color="success">
            <Typography variant="h6" gutterBottom>
              {deleteResponse}
            </Typography>
          </Alert>
        </Box>
      )} */}

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <TextField
              name="searchTerm"
              placeholder="Search orgs"
              variant="outlined"
              margin="dense"
              size="small"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size="12" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <TableComponent
        size="small"
        columns={[
          {
            field: "name",
            label: "Name",
            renderCell: ({ name, _id }) => (
              <Typography variant="h6" component={Link} to={`/app/orgs/${_id}`}>
                {name || _id}
              </Typography>
            ),
          },
          {
            field: "branch",
            label: "Branch",
          },
          {
            field: "phone",
            label: "Phone",
          },
          {
            field: "email",
            label: "Email",
          },
          {
            field: "address",
            label: "address",
          },
        ]}
        requestState={{ requesting: state.requesting, error: state.error }}
        data={state.orgs}
        rowActions={[
          {
            type: "icon",
            icon: <EditIcon />,
            handler: ({ _id }) => handleEditClick(_id),
            "aria-label": "edit organization",
          },

          {
            type: "icon",
            icon: <DeleteIcon />,
            handler: ({ _id }) => handleDeleteClick(_id),
            "aria-label": "delete organization",
          },
        ]}
      />
    </PageView>
  );
};

export default OrgListView;
