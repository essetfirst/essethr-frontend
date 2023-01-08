import React from "react";

import { Box, TextField, Typography } from "@material-ui/core";
import {
  AccessTime as AbsenteesReportIcon,
  CheckCircleOutlineOutlined as CheckIcon,
} from "@material-ui/icons";

import { Download as ExportIcon } from "react-feather";

import useAttendance from "../../../providers/attendance";

import { getTableDataForExport, makeExcel } from "../../../helpers/export";

import PageView from "../../../components/PageView";
import LoadingComponent from "../../../components/LoadingComponent";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";

import Searchbar from "../../../components/common/Searchbar";
import TableComponent from "../../../components/TableComponent";

const FilterFields = ({ filters, onFilterFieldChange }) => {
  return (
    <Box display="flex" alignItems={"center"}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        type="date"
        label="From"
        name="from"
        onChange={onFilterFieldChange}
        value={filters.from}
        style={{ marginRight: "8px" }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="To"
        type="date"
        name="to"
        onChange={onFilterFieldChange}
        value={filters.to}
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
    // {
    //   label: "Employee",
    //   field: "employee",
    //   renderCell: ({ employeeName }) => (
    //     <Typography variant="h6">{employeeName}</Typography>
    //   ),
    // },
    {
      label: "Absent",
      field: "absent",
      align: "center",
      renderCell: ({ absent }) => (
        <Typography variant="h6">{absent || 0}</Typography>
      ),
    },
    {
      label: "Late",
      field: "late",
      align: "center",
      renderCell: ({ late }) => <Typography variant="h6">{late}</Typography>,
    },
    {
      label: "Present",
      field: "present",
      align: "center",
      renderCell: ({ present }) => (
        <Typography variant="h6">{present}</Typography>
      ),
    },
    {
      label: "Approved?",
      field: "status",
      align: "center",
      renderCell: ({ status }) => (
        <CheckIcon color={status === "approved" ? "primary" : "action"} />
      ),
    },
  ];
  return <TableComponent columns={columns} data={data} />;
};

const AbsenteesReportView = () => {
  const { state, fetchAttendance } = useAttendance();

  const [reportData, setReportData] = React.useState(null);

  const handleExportClick = async () => {
    if (reportData.length > 0) {
      const filename = `Absentee report (${new Date(
        filters.from
      ).toLocaleDateString()} to ${new Date(filters.to).toLocaleDateString()})`;

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
      ];

      const rows = reportData.map(({ employeeId, present, late, absent }) => ({
        employeeId,
        present: present || 0,
        late: late || 0,
        absent: absent || 0,
      }));

      console.log("rows", rows);
      await makeExcel(getTableDataForExport(rows, columns), filename);
    }
  };

  const [filters, setFilters] = React.useState("");

  const handleFilterChange = () => (e) => {
    const { value } = e.target;
    setFilters(value);
  };

  const mapAttendanceToReport = (attendanceByDate, maxAbsent) => {
    let absenteesReport = {};

    const attendanceList = [];
    Object.keys(attendanceByDate).forEach((date) =>
      attendanceList.push(...attendanceByDate[date])
    );

    attendanceList.forEach(({ employeeId, employeeName, date, remark }) => {
      if (absenteesReport[employeeId] === undefined) {
        absenteesReport[employeeId] = {
          employeeId,
          employeeName,
          present: remark === "present" ? 1 : 0,
          late: remark === "late" ? 1 : 0,
          absent: maxAbsent - 1,
        };
      } else {
        absenteesReport = {
          [employeeId]: {
            ...absenteesReport[employeeId],
            employeeName,
            [remark]: absenteesReport[employeeId][remark] + 1,
            absent: absenteesReport[employeeId].absent - 1,
          },
        };
      }
    });

    return Object.values(absenteesReport);
  };

  const handleSubmit = (filters, attendanceByDate) => {
    fetchAttendance();

    console.log("filters, attendanceByDate)", filters, attendanceByDate);

    const dateRange =
      (new Date(filters.to).getTime() - new Date(filters.from).getTime()) /
      (3600000 * 24);
    console.log(
      "[AbsenteesReportView]: Line 272 -> attendanceByDate: ",
      dateRange
    );

    const countWeekends = (from, to) => {
      let weekends = 0;
      for (
        let d = from;
        d <= to;
        d = new Date(new Date(d).getTime() + 24 * 3600000)
      ) {
        if (new Date(d) !== "invalid date" && new Date(d).getDay() === 0)
          weekends++;
      }
      return weekends;
    };

    const weekends = countWeekends(filters.from, filters.to);

    if (attendanceByDate && Object.keys(attendanceByDate).length > 0) {
      const absenteesReport = mapAttendanceToReport(
        attendanceByDate,
        dateRange - weekends
      );
      setReportData(absenteesReport);
    }
  };

  React.useEffect(() => {
    const enterKeyListener = (e) => {
      if (e.keyCode === 13) {
        handleSubmit(filters, state.attendanceByDate);
      }
    };
    window.addEventListener("keypress", enterKeyListener);

    handleSubmit(filters, state.attendanceByDate);

    console.log(state.attendanceByDate);
    return () => window.removeEventListener("keypress", enterKeyListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    handleSubmit(filters, state.attendanceByDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.from, filters.to]);

  return (
    <PageView
      title="Absentees Report"
      backPath={"/app/reports"}
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <AbsenteesReportIcon fontSize="medium" />
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
        reportData && <AbsenteesReportTable data={reportData || []} />
      )}
    </PageView>
  );
};

export default AbsenteesReportView;
