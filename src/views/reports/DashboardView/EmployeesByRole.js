import React from "react";
import BarGraphComponent from "../../../components/BarGraphComponent";
import CardWithTitle from "../../../components/CardWithTitle";

const EmployeesByRole = ({ employeesCountByRole, roles }) => {
  return (
    <CardWithTitle title={"Employees By Role"}>
      <BarGraphComponent
        bars={Object.keys(employeesCountByRole).map((role) => ({
          label: role,
          data: Object,
        }))}
        labels={roles}
      />
    </CardWithTitle>
  );
};

export default EmployeesByRole;
