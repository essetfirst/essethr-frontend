import React from "react";
import API from "../../../api/leaves";
import useOrg from "../../../providers/org";

import PageView from "../../../components/PageView";
import LoadingComponent from "../../../components/LoadingComponent";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";

import TableComponent from "../../../components/TableComponent";
import RequestForm from "./RequestForm";

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  dialog: {},
}));

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_ERROR: "REQUEST_ERROR",
};
const initialState = {
  leaves: [],
  allowances: [],
  requesting: false,
  error: null,
};
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, requesting: true, error: null };
    case types.REQUEST_SUCCESS:
      return { ...state, leaves: payload, requesting: false, error: null };
    case types.REQUEST_ERROR:
      return { ...state, requesting: false, error };
    default:
      return state;
  }
};

const LeaveListView = () => {
  const classes = useStyles();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { org } = useOrg();

  const fetchLeaves = () => {
    dispatch({ type: types.REQUESTING });
    API.getAll()
      .then(({ success, leaves, error }) => {
        success
          ? dispatch({ type: types.REQUEST_SUCCESS, payload: leaves })
          : dispatch({ type: types.REQUEST_ERROR, error });
      })
      .catch((e) => {
        console.error(e);
        dispatch({ type: types.REQUEST_ERROR, error: "Something went wrong." });
      });
  };

  React.useEffect(() => {
    fetchLeaves();
  }, []);

  // Request form
  const [requestDialogOpen, setRequestDialogOpen] = React.useState(false);

  const allowances = [
    {
      employeeId: 1,
      remaining: { annual: 6, sick: 13, special: 16, maternal: 0, study: 12 },
      totalRemaining: 47,
    },
    {
      employeeId: 2,
      remaining: { annual: 12, sick: 10, special: 20, maternal: 0, study: 12 },
      totalRemaining: 54,
    },
  ];
  const leaveTypes = [
    { label: "Annual Leave", value: "annual" },
    { label: "Sick Leave", value: "sick" },
    { label: "Special Leave", value: "special" },
    { label: "Maternal Leave", value: "maternal" },
    { label: "Study Leave", value: "study" },
  ];

  const handleRequestDialogOpen = () => setRequestDialogOpen(true);
  const handleRequestDialogClose = () => {
    setRequestDialogOpen(false);
  };

  /* Search filters  */
  const [filters, setFilters] = React.useState("");

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleRequestSubmit = () => {};

  return (
    <PageView title="Leaves">
      <Box display="flex" mt={2} mb={1} justifyContent="space-between">
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestDialogOpen}
            aria-label="request"
            size="small"
          >
            Request
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="small" variant="outlined" aria-label="import">
            Import
          </Button>
          <Button size="small" variant="outlined" aria-label="export">
            Export
          </Button>
          <Button size="small" variant="outlined" aria-label="print">
            Print
          </Button>
        </ButtonGroup>
      </Box>
      <Dialog
        className={classes.dialog}
        open={requestDialogOpen}
        onClose={handleRequestDialogClose}
      >
        <DialogContent>
          {state.requesting ? (
            <LoadingComponent />
          ) : state.error ? (
            <ErrorBoxComponent error={state.error} onRetry={() => {}} />
          ) : null}

          <RequestForm
            employees={org.employees}
            allowances={allowances}
            leaveTypes={leaveTypes}
            onRequestSubmitted={handleRequestSubmit}
          />
        </DialogContent>
      </Dialog>
      <Box mt={1} mb={2}>
        <Card>
          <CardContent>
            <TextField
              name="searchTerm"
              onChange={handleFilterChange}
              placeholder="Search leaves"
              margin="dense"
              variant="outlined"
            />
          </CardContent>
        </Card>
      </Box>

      <TableComponent
        size="small"
        columns={[
          {
            field: "employeeId",
            label: "Employee",
          },
          {
            field: "leaveType",
            label: "Leave Type",
          },
          {
            field: "duration",
            label: "Duration",
          },
          {
            field: "from",
            label: "Start Date",
          },
          {
            field: "to",
            label: "End Date",
          },
          {
            field: "status",
            label: "Status",
          },
        ]}
        data={(state.leaves || []).filter((d) =>
          String(d.employeeId).includes(filters.searchTerm)
        )}
      />
    </PageView>
  );
};

export default LeaveListView;
