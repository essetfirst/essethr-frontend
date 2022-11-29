import React from "react";

// import moment from "moment";

import { Box, Button, ButtonGroup, makeStyles } from "@material-ui/core";

// import
// { UploadCloud as ImportIcon,
// Download as ExportIcon,
// Printer as PrintIcon,
// ChevronRight as ViewMoreIcon,
// ChevronLeft as ViewLessIcon,
// } from "react-feather";

import useOrg from "../../../../providers/org";

import filter from "../../../../helpers/filter";
import getWeekDates from "../../../../helpers/get-week-dates";
import arrayToMap from "../../../../utils/arrayToMap";

// import RequestForm from "./RequestForm";

import EmployeesOnLeave from "./EmployeesOnLeave";

import LeaveFormDialog from "./LeaveFormDialog";
import Filterbar from "./Filterbar";
import List from "./List";
import ExportButton from "../../../../components/common/ExportButton";

// import Summary from "./Summary";

function periodIncludesToday(from, to) {
  const today = new Date();
  const fromDate = new Date(from);
  const toDate = new Date(to);
  return (
    today.toLocaleDateString() >= fromDate.toLocaleDateString() &&
    today.toLocaleDateString() <= toDate.toLocaleDateString()
  );
}

const useStyles = makeStyles((theme) => ({
  dialog: {},
}));

const LeavesPanel = ({
  state,
  // notify,
  onFetchLeaves,
  onRegisterLeave,
  onApproveLeaves,
  onUpdateLeave,
  onDeleteLeave,
}) => {
  const classes = useStyles();

  const { org } = useOrg();

  console.log(`Leave management state #2: \n ${state}`);

  const employeesMap = arrayToMap(org.employees || [], "_id");
  const leaveTypes = [
    { label: "Annual Leave", value: "annual" },
    { label: "Sick Leave", value: "sick" },
    { label: "Special Leave", value: "special" },
    { label: "Maternal Leave", value: "maternal" },
    { label: "Study Leave", value: "study" },
  ];
  // const allowances = [
  //   {
  //     employeeId: 1,
  //     remaining: { annual: 6, sick: 13, special: 16, maternal: 0, study: 12 },
  //     totalRemaining: 47,
  //   },
  //   {
  //     employeeId: 2,
  //     remaining: { annual: 12, sick: 10, special: 20, maternal: 0, study: 12 },
  //     totalRemaining: 54,
  //   },
  // ];

  const departmentOptions = [
    { label: "ALL", value: "ALL" },
    ...(org.departments || []).map(({ _id, name }) => ({
      label: name,
      value: _id,
    })),
  ];
  const employeeOptions = (org.employees || []).map(
    ({ _id, firstName, surName }) => ({
      label: `${firstName} ${surName}`,
      value: _id,
    })
  );
  const leaveTypeOptions = [{ label: "ALL", value: "ALL" }, ...leaveTypes];
  const durationOptions = [
    { label: "First half of the day", value: 1 },
    { label: "Second half of the day", value: 2 },
    { label: "Single day", value: 3 },
    { label: "Several days", value: 4 },
  ];
  const statusOptions = [
    { label: "ALL", value: "ALL" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  // Request form
  const [selectedLeave, setSelectedLeave] = React.useState(null);
  const [dialogAction, setDialogAction] = React.useState(null);
  const [requestDialogOpen, setRequestDialogOpen] = React.useState(false);
  const handleRequestDialogOpen = () => setRequestDialogOpen(true);
  const handleRequestDialogClose = () => {
    setRequestDialogOpen(false);
  };

  // const [detailedView, setDetailedView] = React.useState(false);
  // const toggleDetailedView = () => setDetailedView(!detailedView);

  const initialFiltersValue = {
    searchTerm: "",
    department: "ALL",
    leaveType: "ALL",

    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, -1),

    status: "ALL",
  };

  const comparisonFns = {
    searchTerm: ({ employeeId }, searchTermFilterValue) => {
      if (employeesMap === undefined || !employeesMap) return true;

      const { firstName, lastName } = employeesMap[employeeId] || {};
      const name = `${firstName} ${lastName}`;
      return searchTermFilterValue
        ? name.includes(searchTermFilterValue)
        : true;
    },
    department: ({ employeeId }, departmentFilterValue) =>
      departmentFilterValue && departmentFilterValue !== "ALL"
        ? employeesMap &&
          employeesMap[employeeId] &&
          employeesMap[employeeId].department === departmentFilterValue
        : true,
    leaveType: ({ leaveType }, leaveTypeFilterValue) =>
      leaveTypeFilterValue && leaveTypeFilterValue !== "ALL"
        ? leaveType === leaveTypeFilterValue
        : true,
    fromDate: ({ from }, fromFilterValue) =>
      fromFilterValue ? from >= fromFilterValue : true,
    toDate: ({ to }, toFilterValue) =>
      toFilterValue ? to <= toFilterValue : true,
    status: ({ status }, statusFilterValue) =>
      statusFilterValue && statusFilterValue !== "ALL"
        ? status === statusFilterValue
        : true,
  };
  const [filters, setFilters] = React.useState(initialFiltersValue);
  const handleFiltersChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  const handleFiltersReset = () => setFilters(initialFiltersValue);

  // const getFilteredList = function () {
  //   return filter(
  //     state.leaves || [],
  //     Object.keys(filters).map((key) => {
  //       return {
  //         value: filters[key],
  //         cmpFn: comparisonFns[key],
  //       };
  //     })
  //   );
  // };

  const handleRegisterClick = () => {
    setDialogAction("register");
    handleRequestDialogOpen();
  };

  const handleEditLeaveClick = (selected) => {
    setSelectedLeave(state.fetchLeaves.leaves.find((l) => l._id === selected));
    setDialogAction("update");
    handleRequestDialogOpen();
  };

  const handleApproveLeaveClick = (selected) => {
    // setSelectedLeave(state.fetchLeaves.leaves[selected]);
    // TODO: Implement action approveLeave
    onApproveLeaves([selected]);
  };

  const handleDeleteLeaveClick = (selected) => {
    // TODO: Implement dialog for deleteLeave
    onDeleteLeave(selected);
  };

  // const handleImportClick = () => {};
  // const handleExportClick = () => {};
  // const handlePrintClick = () => {};

  // console.log("Week dates", weekDays);
  const weekDays = getWeekDates(new Date(), 0);

  const fetchLeaves = React.useCallback(() => {
    const weekDays = getWeekDates(new Date(), 0);
    onFetchLeaves(
      new Date(filters.fromDate || weekDays[0]).toISOString().slice(0, 10),
      new Date(filters.toDate || weekDays[1]).toISOString().slice(0, 10)
    );
  }, [filters.fromDate, filters.toDate]);

  React.useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const employeesOnLeave = (state.fetchLeaves.leaves || []).filter((l) => {
    if (periodIncludesToday(l.from, l.to)) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <div>
      {/* Action bar */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleRegisterClick}
            aria-label="request leave"
          >
            Register Leave
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <ExportButton
            data={[]}
            onExportFinished={() => {
              console.log("Export finished...");
            }}
          />
          {/* <Button
            size="small"
            onClick={handleImportClick}
            startIcon={<ImportIcon size="16px" />}
            aria-label="import leave data"
          >
            Import
          </Button>
          <Button
            size="small"
            onClick={handleExportClick}
            startIcon={<ExportIcon size="16px" />}
            aria-label="export leave data"
          >
            Export
          </Button>
          <Button
            size="small"
            onClick={handlePrintClick}
            startIcon={<PrintIcon size="16px" />}
            aria-label="print leave data"
          >
            Print
          </Button> */}
        </ButtonGroup>
      </Box>

      {/* Leave dialog */}
      <LeaveFormDialog
        state={
          dialogAction === "update" ? state.updateLeave : state.registerLeave
        }
        open={requestDialogOpen}
        onClose={handleRequestDialogClose}
        action={dialogAction}
        employees={employeeOptions}
        leaveTypes={leaveTypes}
        durations={durationOptions}
        leave={selectedLeave}
        onSubmit={dialogAction === "update" ? onUpdateLeave : onRegisterLeave}
      />

      {/* Employees on leave */}
      <EmployeesOnLeave leaves={employeesOnLeave} />

      {/* Filter bar */}
      <Filterbar
        filters={filters}
        onFilterChange={handleFiltersChange}
        onReset={handleFiltersReset}
        departmentOptions={departmentOptions}
        leaveTypeOptions={leaveTypeOptions}
        statusOptions={statusOptions}
      />

      {/* List */}
      <List
        employeesMap={employeesMap}
        leaves={state.fetchLeaves.leaves}
        requesting={state.fetchLeaves.isLoading}
        error={state.fetchLeaves.error}
        onRetry={() => {
          fetchLeaves(weekDays);
        }}
        onApproveLeaveClicked={handleApproveLeaveClick}
        onEditLeaveClicked={handleEditLeaveClick}
        onDeleteLeaveClicked={handleDeleteLeaveClick}
      />
    </div>
  );
};

export default LeavesPanel;
