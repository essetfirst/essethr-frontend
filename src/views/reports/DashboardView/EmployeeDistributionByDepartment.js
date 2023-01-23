import React from "react";

import CardWithTitle from "../../../components/CardWithTitle";

import PieChartComponent from "../../../components/PieChartComponent";

const COLORS = ["brown", "green", "red", "orange", "biscuit", "gold"];

const EmployeeDistributionByDepartment = ({
  employees = [],
  departmentsMap = {},
}) => {

  const defaultDistribution = Object.keys(departmentsMap).reduce(
    (prev, next) => ({ ...prev, [next]: 0 }),
    {}
  );
  const distributionMap = employees.reduce((prev, { department }) => {
    const update = { [department]: prev[department] + 1 };
    return Object.assign({}, prev, update);
  }, defaultDistribution);

  return (
    <CardWithTitle title={"Employee Headcount by Department"}>
      <PieChartComponent
        pies={Object.keys(distributionMap).map((department, index) => ({
          label: departmentsMap[department].name,
          color: COLORS[index % COLORS.length],
          datum: distributionMap[department],
        }))}
        height={200}
      />
    </CardWithTitle>
  );
};

export default EmployeeDistributionByDepartment;
