import React from "react";
import { Box, Button, ButtonGroup } from "@material-ui/core";
import useOrg from "../../../../providers/org";
import getWeekDates from "../../../../helpers/get-week-dates";
import arrayToMap from "../../../../utils/arrayToMap";
import { getTableDataForExport, makeExcel } from "../../../../helpers/export";
import { Download as ExportIcon } from "react-feather";
import EmployeesOnLeave from "./EmployeesOnLeave";
import LeaveFormDialog from "./LeaveFormDialog";
import Filterbar from "./Filterbar";
import List from "./List";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";

function periodIncludesToday(from, to) {
  const today = new Date();
  const fromDate = new Date(from);
  const toDate = new Date(to);
  return (
    today.toLocaleDateString() >= fromDate.toLocaleDateString() &&
    today.toLocaleDateString() <= toDate.toLocaleDateString()
  );
}

const LeavesPanel = ({
  state,
  onFetchLeaves,
  onRegisterLeave,
  onApproveLeaves,
  onUpdateLeave,
  onDeleteLeave,
}) => {
  const { org } = useOrg();
  const employeesMap = arrayToMap(org.employees || [], "_id");
  const leaveTypeMap = arrayToMap(org.leaveTypes || [], "_id");

  const leaveTypes = [
    ...(org.leaveTypes || []).map(({ _id, name }) => ({
      label: name,
      value: _id,
    })),
  ];

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
  const leaveTypeOptions = [
    { label: "Choose leaveTypes", value: -1 },
    ...leaveTypes,
  ];

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

  const handleRegisterClick = () => {
    setDialogAction("register");
    handleRequestDialogOpen();
  };

  const handleExportClick = async ({ _id }) => {
    console.log("im about to export");

    const columns = [
      {
        label: "employeeId",
        field: "employeeId",
      },
      {
        label: "leave Type",
        field: "leaveType",
      },
      {
        label: "Duration",
        field: "duration",
      },
      {
        label: "Start Date",
        field: "startDate",
      },
      {
        label: "End Date",
        field: "endDate",
      },
      {
        label: "Comment",
        field: "comment",
      },
      {
        label: "Status",
        field: "status",
      },
    ];

    console.log(state.fetchLeaves.leaves);
    await makeExcel(getTableDataForExport(state.fetchLeaves.leaves, columns));
  };

  const handleEditLeaveClick = (selected) => {
    setSelectedLeave(state.fetchLeaves.leaves.find((l) => l._id === selected));
    setDialogAction("update");
    handleRequestDialogOpen();
  };

  const handleApproveLeaveClick = (selected) => {
    // TODO: Implement action approveLeave
    onApproveLeaves([selected]);
  };

  const handleDeleteLeaveClick = (selected) => {
    // TODO: Implement dialog for deleteLeave
    onDeleteLeave(selected);
  };
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
            startIcon={<AddCircleRoundedIcon size="16px" />}
          >
            Register Leave
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            size="small"
            onClick={handleExportClick}
            startIcon={<ExportIcon size="16px" />}
            aria-label="export leave data"
          >
            Export
          </Button>
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
        leaveTypeMap={leaveTypeMap}
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
