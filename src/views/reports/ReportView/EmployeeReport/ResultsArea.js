import React from "react";

import { Typography } from "@material-ui/core";

import TableComponent from "../../../../components/TableComponent";

const ResultsArea = ({ employees, departmentsMap }) => {
  return (
    <TableComponent
      columns={[
        {
          label: "NAME",
          field: "name",
          renderCell: ({ firstName, surName, lastName }) => (
            <Typography variant="h6">{`${firstName} ${surName} ${lastName}`}</Typography>
          ),
        },
        {
          label: "GENDER",
          field: "gender",
        },
        {
          label: "AGE",
          renderCell: ({ birthDay }) =>
            new Date().getFullYear() - new Date(birthDay).getFullYear(),
        },
        {
          label: "DEPARTMENT",
          renderCell: ({ department }) => departmentsMap[department].name,
        },
        {
          label: "WORKED FOR",
          renderCell: ({ startDate, hireDate }) =>
            `${
              new Date().getFullYear() -
              new Date(startDate || hireDate).getFullYear()
            } yrs`,
        },
      ]}
      data={employees}
    />
  );
};

export default ResultsArea;
