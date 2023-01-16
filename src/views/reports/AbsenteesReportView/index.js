import React from "react";

import { Box, TextField, Typography } from "@material-ui/core";
import {
  AccessTime as AbsenteesReportIcon,
  CheckCircleOutlineOutlined as CheckIcon,
} from "@material-ui/icons";

import { Download as ExportIcon } from "react-feather";
import moment from "moment";
import useAttendance from "../../../providers/attendance";

import { getTableDataForExport, makeExcel } from "../../../helpers/export";

import PageView from "../../../components/PageView";
import LoadingComponent from "../../../components/LoadingComponent";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";

import Searchbar from "../../../components/common/Searchbar";
import TableComponent from "../../../components/TableComponent";
import RemoveCircleSharpIcon from "@material-ui/icons/RemoveCircleSharp";

const FilterFields = ({ filters, onFilterFieldChange }) => {
  return (
    <Box display="flex" alignItems={"center"}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        type="date"
        name="from"
        onChange={onFilterFieldChange}
        value={filters.from || moment().startOf("month").format("YYYY-MM-DD")}
        style={{ marginRight: "8px" }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        type="date"
        name="to"
        onChange={onFilterFieldChange}
        value={filters.to || moment().endOf("month").format("YYYY-MM-DD")}
      />
    </Box>
  );
};

const AbsenteesReportFilterbar = ({ filters, onFilterChange }) => {
  return (
    <Searchbar
      onSearchTermChange={onFilterChange}
      searchTerm={filters.searchTerm}
      searchbarElements={
        <FilterFields filters={filters} onFilterFieldChange={onFilterChange} />
      }
    />
  );
};

const AbsenteesReportTable = ({ data }) => {
  const columns = [
    {
      label: "Employee ID",
      field: "employeeId",
      renderCell: ({ employeeId }) => (
        <Typography variant="h6">{employeeId}</Typography>
      ),
    },

    {
      label: "Late",
      field: "late",
      align: "center",
      renderCell: ({ late }) => (
        <Typography variant="h6">{late || 0}</Typography>
      ),
    },
    {
      label: "Present",
      field: "present",
      align: "center",
      renderCell: ({ present }) => (
        <Typography variant="h6">{present || 0}</Typography>
      ),
    },
    {
      label: "Absent",
      field: "absent",
      align: "center",
      renderCell: ({ absent }) => (
        <Typography variant="h6">{absent || 0}</Typography>
      ),
    },
    {
      label: "Is Approved ?",
      field: "status",
      align: "center",
      renderCell: ({ status }) => (
        <Typography variant="h6">
          {status === "approved" ? (
            <CheckIcon style={{ color: "green" }} />
          ) : (
            <RemoveCircleSharpIcon style={{ color: "red" }} />
          )}
        </Typography>
      ),
    },
  ];
  return <TableComponent columns={columns} data={data} key={data.employeeId} />;
};

const AbsenteesReportView = () => {
  const { state, fetchAttendance } = useAttendance();

  const [reportData, setReportData] = React.useState(null);
  const handleExportClick = async () => {
    if (reportData.length > 0) {
      const filename = `Absentees Report ${moment().format("DD-MM-YYYY")}`;

      const columns = [
        {
          label: "Employee Id",
          field: "employeeId",
        },
        {
          label: "Present",
          field: "present",
        },
        {
          label: "Late",
          field: "late",
        },
        {
          label: "Absent",
          field: "absent",
        },
        {
          label: "Is Approved ?",
          field: "status",
        },
      ];

      const rows = reportData.map(
        ({ employeeId, present, late, absent, status }) => ({
          employeeId,
          present: present || 0,
          late: late || 0,
          absent: absent || 0,
          status,
        })
      );

      await makeExcel(getTableDataForExport(rows, columns), filename);
    }
  };

  const [filters, setFilters] = React.useState("");

  const handleFilterChange = () => (e) => {
    const { value } = e.target;
    setFilters(value);
  };

  const mapAttendanceToReport = (attendanceByDate) => {
    const report = [];
    Object.keys(attendanceByDate).forEach((date) => {
      attendanceByDate[date].forEach((employee) => {
        const employeeIndex = report.findIndex(
          (e) => e.employeeId === employee.employeeId
        );
        if (employeeIndex === -1) {
          report.push({
            employeeId: employee.employeeId,
            [employee.remark]: 1,
            status: employee.status,
          });
        } else {
          if (report[employeeIndex][employee.remark]) {
            report[employeeIndex][employee.remark] += 1;
          } else {
            report[employeeIndex][employee.remark] = 1;
          }
        }
      });
    });
    return report;
  };

  const handleSubmit = (filters, attendanceByDate) => {
    fetchAttendance(filters);
    const dateRange = moment(filters.to).diff(moment(filters.from), "days") + 1;

    const countWeekends = (from, to) => {
      let count = 0;
      const date = moment(from);
      while (date.isBefore(to)) {
        if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
          count++;
        }
        date.add(1, "days");
      }
      return count;
    };

    const weekends = countWeekends(
      moment(filters.from),
      moment(filters.to).add(1, "days")
    );

    if (attendanceByDate && Object.keys(attendanceByDate).length > 0) {
      const absenteesReport = mapAttendanceToReport(
        attendanceByDate,
        dateRange - weekends
      );
      setReportData(absenteesReport);
    } else {
      setReportData([]);
    }
  };

  // React.useEffect(() => {
  //   const enterKeyListener = (e) => {
  //     if (e.keyCode === 13) {
  //       handleSubmit(filters, state.attendanceByDate);
  //     }
  //   };
  //   window.addEventListener("keypress", enterKeyListener);

  //   handleSubmit(filters, state.attendanceByDate);

  //   return () => window.removeEventListener("keypress", enterKeyListener);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  React.useEffect(() => {
    handleSubmit(filters, state.attendanceByDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageView
      title="Absentees Report"
      backPath={"/app/reports"}
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <AbsenteesReportIcon fontSize="large" />
        </span>
      }
      actions={[
        {
          label: "Export to Excel",
          icon: { node: <ExportIcon size={20} /> },
          handler: handleExportClick,
          position: "right",
          otherProps: {
            color: "primary",
            variant: "outlined",
            disabled: !reportData || !reportData.length,
          },
        },
      ]}
    >
      <AbsenteesReportFilterbar
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <Box mt={2} />

      {state.isLoading ? (
        <LoadingComponent />
      ) : state.error ? (
        <ErrorBoxComponent error={state.error} onRetry={() => handleSubmit()} />
      ) : (
        reportData && (
          <AbsenteesReportTable
            // eslint-disable-next-line array-callback-return
            data={(reportData || []).filter((e) => {
              try {
                const { employeeId, employeeName } = e;
                return (
                  employeeId.toLowerCase().includes(filters) ||
                  employeeName.toLowerCase().includes(filters)
                );
              } catch (error) {}
            })}
          />
        )
      )}
    </PageView>
  );
};

export default AbsenteesReportView;
