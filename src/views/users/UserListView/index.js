import React from "react";

import {
  Card,
  CardContent,
  Checkbox,
  makeStyles,
  MenuItem,
  TextField,
} from "@material-ui/core";

import PageView from "../../../components/PageView";
import Table from "../../../components/TableComponent";

import API from "../../../api";

const useStyles = makeStyles((theme) => ({
  root: {},
  filterField: {
    minWidth: "30ch",
    padding: theme.spacing(1),
    margin: theme.spacing(0, 1),
  },
}));

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  const { type, users, error } = action;
  switch (type) {
    case "FETCHING":
      return { ...state, loading: true, error: null };
    case "FETCHING_SUCCESS":
      return { ...state, users, loading: false, error: null };
    case "FETCHING_ERROR":
      return { ...state, loading: false, error };
    default:
      return state;
  }
};

const UserListView = () => {
  const classes = useStyles();

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [orgsObj, setOrgsObj] = React.useState({});

  const roleOptions = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];

  function fetchUsers() {
    dispatch({ type: "FETCHING" });
    API.users
      .getAll({ query: {} })
      .then(({ success, users, error }) => {
        if (success) {
          dispatch({ type: "FETCHING_SUCCESS", users });
        } else {
          dispatch({ type: "FETCHING_ERROR", error });
        }
      })
      .catch((e) => {
        dispatch({ type: "FETCHING_ERROR", error: e.message });
      });
  }

  function fetchOrgs() {
    API.orgs
      .getAll()
      .then(({ success, orgs, error }) => {
        if (success) {
          setOrgsObj(
            orgs
              .map((org) => ({ [org._id]: org }))
              .reduce((prev, next) => {
                return Object.assign({}, prev, next);
              }, {})
          );
        } else {
          console.error(error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  React.useEffect(() => {
    fetchOrgs();
    fetchUsers();
  }, []);

  const [filters, setFilters] = React.useState({
    searchTerm: "",
    role: "ALL",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const [userAttribute, setUserAttribute] = React.useState({});
  const handleUserAttributeChange = (id) => (e) => {
    const { name, value, type, checked } = e.target;
    setUserAttribute({
      ...userAttribute,
      [id]: {
        ...(userAttribute[id] || {}),
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const handleApplyChanges = (id) => {
    API.users
      .editById(id, userAttribute[id])
      .then(({ success, user, error }) => {
        if (success) {
          // console.log(message);
          setUserAttribute({});
        } else {
          console.error(error);
        }
      })
      .catch((e) => {
        console.error(e.message);
      });
  };

  const handleCreateClick = () => {};

  return (
    <PageView
      className={classes.root}
      title="Users"
      actions={[
        {
          label: "Create",
          handler: handleCreateClick,
          otherProps: { variant: "contained", color: "primary", size: "small" },
        },
      ]}
    >
      <Card>
        <CardContent>
          <TextField
            className={classes.filterField}
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Search users"
            variant="outlined"
            margin="dense"
            size="small"
            style={{ minWidth: "30ch" }}
          />
          <TextField
            className={classes.filterField}
            select
            label="Role"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            variant="outlined"
            margin="dense"
            size="small"
          >
            <MenuItem value="ALL">ALL</MenuItem>
            {roleOptions.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      <Table
        columns={[
          {
            label: "Name",
            field: "name",
            renderCell: ({ firstName, lastName }) => `${firstName} ${lastName}`,
          },
          { label: "Email", field: "email" },
          {
            label: "Organization",
            field: "org",
            renderCell: ({ _id, org }) => (
              <TextField
                fullWidth
                select
                name="org"
                onChange={handleUserAttributeChange(_id)}
                value={userAttribute[_id] && userAttribute[_id].org}
                defaultValue={org || "N/A"}
                variant="outlined"
                margin="dense"
              >
                <MenuItem value={"N/A"}>{"N/A"}</MenuItem>
                {Object.values(orgsObj).map(({ _id, name }) => (
                  <MenuItem key={_id} value={_id}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            ),
          },
          {
            label: "Role",
            field: "role",
            renderCell: ({ _id, role }) => (
              <TextField
                fullWidth
                select
                name="role"
                onChange={handleUserAttributeChange(_id)}
                value={(userAttribute[_id] && userAttribute[_id].role) || role}
                variant="outlined"
                margin="dense"
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            ),
          },
          {
            label: "Activated",
            field: "activated",
            align: "center",
            renderCell: ({ _id, activated }) => (
              <Checkbox
                name="activated"
                checked={
                  userAttribute[_id] &&
                  userAttribute[_id].hasOwnProperty("activated")
                    ? userAttribute[_id].activated
                    : activated
                }
                onChange={handleUserAttributeChange(_id)}
              />
            ),
          },

          { label: "Created On", field: "createdOn" },
        ]}
        data={state.users.filter(
          ({ name, firstName, lastName, role }) =>
            `${firstName} ${lastName}`.includes(filters.searchTerm) &&
            (filters.role === "ALL" || filters.role === role)
        )}
        rowActions={[
          {
            label: "Apply",
            handler: ({ _id }) => {
              console.log(`-> Line 260: Applying changes on user ${_id}...`);
              handleApplyChanges(_id);
            },
            hide: ({ _id }) => !userAttribute[_id],
            color: "secondary",
            variant: "contained",
          },
        ]}
      />
    </PageView>
  );
};

export default UserListView;
