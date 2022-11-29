import React from "react";

// import { Box, Button, ButtonGroup, Typography } from "@material-ui/core";

import useOrg from "../../../../providers/org";
import arrayToMap from "../../../../utils/arrayToMap";

import FilterArea from "./FilterArea";
import SummaryArea from "./SummaryArea";
import ResultsArea from "./ResultsArea";

const EmployeeReport = ({
  byDepartment,
  byAge,
  byGender,
  byExperience,
  employees,
}) => {
  // Export As PDF | CSV | XLSX
  // Filter Area
  // Summary Area
  // Results
  const { org } = useOrg();
  const departmentsMap = arrayToMap(org.departments || [], "_id");

  const [filters, setFilters] = React.useState({});
  const handleFilterChange = (filter) => (e) => {
    const { type, checked, value } = e.target;
    setFilters({
      ...filters,
      [filter]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div>
      <FilterArea filters={filters} onFilterChange={handleFilterChange} />
      <code>{JSON.stringify(filters)}</code>

      <SummaryArea
        byDepartment={
          byDepartment ||
          (org.departments || [])
            .map(({ name }) => ({ [name]: 0 }))
            .reduce((prev, next) => Object.assign({}, prev, next), {})
        }
        byGender={byGender}
        byAge={byAge}
        byExperience={byExperience}
      />

      <ResultsArea employees={employees} departmentsMap={departmentsMap} />
    </div>
  );
};

export default EmployeeReport;
