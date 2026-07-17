import { fmt } from "utils/date";
import React from "react";

import { Card, CardContent, Checkbox, MenuItem, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import PageView from "components/PageView";
import Table from "components/TableComponent";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

// eslint-disable-next-line no-unused-vars

import useOrg from "features/org/providers";
import API from "api";
import useAuth from "features/auth/providers";

const StyledRoot = styled("div")(({ theme }) => ({
  
}));

const StyledFilterField = styled(TextField)(({ theme }) => ({
  minWidth: "30ch",
  padding: theme.spacing(1),
  margin: theme.spacing(0, 1),
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

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { org } = useOrg();
  const { auth } = useAuth();

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

  React.useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      .then(({ success, error }) => {
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
      title="Users"
      backPath={"/orgs"}
      actions={[
        {
          label: "Create",
          handler: handleCreateClick,
          icon: { node: <AddCircleRoundedIcon size="16px" /> },
          otherProps: { variant: "contained", color: "primary", size: "small" },
        },
      ]}
    >
      <Card>
        <CardContent>
          <StyledFilterField
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Search users"
            variant="outlined"
            margin="dense"
            size="small"
            style={{ minWidth: "30ch" }}
          />
          <StyledFilterField
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
          </StyledFilterField>
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
            renderCell: () => (
              <Typography
                style={{
                  maxWidth: "20ch",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {org.name}
              </Typography>
            ),
          },
          {
            label: "Role",
            field: "role",
            renderCell: () => (
              <Typography
                style={{
                  maxWidth: "20ch",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {auth?.user?.role}
              </Typography>
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

          {
            label: "Created On",
            field: "createdOn",
            renderCell: ({ createdOn }) =>
              fmt(createdOn, "dd/MM/yyyy"),
          },
        ]}
        data={state.users.filter(
          ({ firstName, lastName, role }) =>
            `${firstName} ${lastName}`.includes(filters.searchTerm) &&
            (filters.role === "ALL" || filters.role === role)
        )}
        actions={[
          {
            label: "Edit",
            handler: ({ _id }) => {
            },
            hide: ({ _id }) => userAttribute[_id],
            color: "primary",
            variant: "contained",
          },
          {
            label: "Cancel",
            handler: ({ _id }) => {
              setUserAttribute({});
            },
            hide: ({ _id }) => userAttribute[_id],
            color: "default",
            variant: "contained",
          },
        ]}
        rowActions={[
          {
            label: "Apply",
            handler: ({ _id }) => {
              handleApplyChanges(_id);
            },
            hide: ({ _id }) => userAttribute[_id],
            color: "secondary",
            variant: "contained",
          },
        ]}
      />
    </PageView>
  );
};

export default UserListView;
