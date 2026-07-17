import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import API from "api";

import PageView from "components/PageView";
import TableComponent from "components/TableComponent";

const JobHistory = () => {
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    API.employees
      .getAll({ query: { limit: 500 } })
      .then((res) => {
        if (res?.success) {
          const flat = [];
          (res.employees || []).forEach((emp) => {
            const name = [emp.firstName, emp.surName, emp.lastName]
              .filter(Boolean)
              .join(" ");
            const history =
              emp.jobHistory?.length > 0
                ? emp.jobHistory
                : [
                    {
                      effectiveDate: emp.startDate,
                      jobTitle: emp.positionDetails?.title || emp.position,
                      department:
                        emp.departmentDetails?.name || emp.department,
                      location: emp.location,
                    },
                  ];
            history.forEach((job, idx) => {
              flat.push({
                _id: `${emp._id}-${idx}`,
                employeeName: name || "Unknown",
                effectiveDate: job.effectiveDate,
                jobTitle: job.jobTitle || "—",
                department: job.department || "—",
                location: job.location || "—",
              });
            });
          });
          setRows(flat);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageView title="Job History Report" backPath="/app/reports">
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Typography color="textSecondary">No job history records found.</Typography>
      ) : (
        <TableComponent
          size="small"
          columns={[
            { field: "employeeName", label: "Employee" },
            { field: "jobTitle", label: "Job Title" },
            { field: "department", label: "Department" },
            { field: "location", label: "Location" },
            {
              field: "effectiveDate",
              label: "Effective Date",
              renderCell: ({ effectiveDate }) =>
                effectiveDate
                  ? new Date(effectiveDate).toLocaleDateString()
                  : "—",
            },
          ]}
          data={rows}
        />
      )}
    </PageView>
  );
};

export default JobHistory;
