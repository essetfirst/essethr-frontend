import React from "react";
import PropTypes from "prop-types";

import { Grid } from "@material-ui/core";

import EmployeePrintableIDCard from "../EmployeeProfileView/EmployeeCard";

export default class PrintableMultipleEmployeeIDCards extends React.Component {
  render() {
    const { employees, ...rest } = this.props;
    return (
      <Grid container spacing={1}>
        {employees.map((employee, index) => (
          <EmployeePrintableIDCard key={index} employee={employee} {...rest} />
        ))}
      </Grid>
    );
  }
}

PrintableMultipleEmployeeIDCards.propTypes = {
  employees: PropTypes.array,
};

PrintableMultipleEmployeeIDCards.defaultProps = {
  employees: [],
};
