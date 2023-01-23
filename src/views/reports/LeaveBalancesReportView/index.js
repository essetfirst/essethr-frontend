import React from "react";

import { Box, Typography } from "@material-ui/core";
import {
  Battery as LeaveBalancesIcon,
  Download as ExportIcon,
} from "react-feather";

import useLeave from "../../../providers/leave";

import { getTableDataForExport, makeExcel } from "../../../helpers/export";

import PageView from "../../../components/PageView";

import ErrorBoxComponent from "../../../components/ErrorBoxComponent";

import Searchbar from "../../../components/common/Searchbar";
import TableComponent from "../../../components/TableComponent";
import arrayToMap from "../../../utils/arrayToMap";
import useOrg from "../../../providers/org";

const LeaveBalancesReportView = () => {
  const { state, fetchLeaveAllowances } = useLeave();
  const { org } = useOrg();

  const [filters, setFilters] = React.useState("");

  const handleFilterChange = () => (e) => {
    const { value } = e.target;
    setFilters(value);
  };

  const employeeMap = arrayToMap(org.employees, "_id");

  React.useEffect(() => {
    fetchLeaveAllowances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = async () => {
    const columns = [
      {
        label: "Employee Name",
        field: "employeeId",
      },
      {
        label: "Annual Used",
        field: "annual",
      },
      {
        label: "special Used",
        field: "special",
      },
      {
        label: "Maternity Used",
        field: "maternal",
      },
      {
        label: "Total Remaining",
        field: "remaining",
      },
    ];

    const data = state.fetchLeaveAllowances.allowances.map((item) => {
      return {
        employeeId: `${employeeMap[item.employeeId].firstName} ${
          employeeMap[item.employeeId].lastName
        }`,
        annual: item.used.annual,
        special: item.used.special,
        maternal: item.used.maternal,
        remaining: item.remaining,
      };
    });
    const tableData = getTableDataForExport(data, columns);
    await makeExcel(tableData, "Leave Balances Report");
  };

  return (
    <PageView
      title="Leave Balances Report"
      icon={<LeaveBalancesIcon />}
      backPath="/app/dashboard"
      actions={[
        {
          type: "button",
          label: "Export",
          icon: { node: <ExportIcon size={20} /> },
          handler: handleExport,
          position: "right",
          otherProps: {
            variant: "outlined",
            color: "primary",
            size: "small",
          },
        },
      ]}
    >
      {state.fetchLeaveAllowances.error && (
        <ErrorBoxComponent error={state.fetchLeaveAllowances.error} />
      )}

      <Searchbar searchTerm={filters} onSearchTermChange={handleFilterChange} />

      <TableComponent
        columns={[
          {
            label: "Employee Name",
            field: "employeeId",
            renderCell: ({ employeeId }) => {
              return (
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">
                    {employeeMap[employeeId]?.firstName}{" "}
                    {employeeMap[employeeId]?.lastName}
                  </Typography>
                </Box>
              );
            },
          },
          {
            label: "Annual Used",
            field: "annual",
            renderCell: ({ used }) => {
              return (
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">{used.annual}</Typography>
                </Box>
              );
            },
          },
          {
            label: "special Used",
            field: "special",
            renderCell: ({ used }) => {
              return (
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">{used.special}</Typography>
                </Box>
              );
            },
          },
          {
            label: "Maternity Used",
            field: "maternal",
            renderCell: ({ used }) => {
              return (
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">{used.maternal}</Typography>
                </Box>
              );
            },
          },
          {
            label: "Total Remaining",
            field: "remaining",
            renderCell: ({ remaining }) => {
              return (
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">{remaining}</Typography>
                </Box>
              );
            },
          },
        ]}
        data={(state.fetchLeaveAllowances.allowances || []).filter(
          (item) =>
            `${employeeMap[item.employeeId]?.firstName} ${
              employeeMap[item.employeeId]?.lastName
            }`
              .toLowerCase()
              .indexOf(filters.toLowerCase()) !== -1
        )}
        selectionEnabled={true}
        requestState={state.fetchLeaveAllowances}
      />
    </PageView>
  );
};

export default LeaveBalancesReportView;
