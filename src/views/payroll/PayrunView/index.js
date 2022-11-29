import React from "react";
import PropTypes from "prop-types";

import { makeStyles, Box, Container } from "@material-ui/core";

import { employeeHours } from "./data";

import Page from "../../../components/Page";

import Toolbar from "./Toolbar";
import Results from "./EmployeeHoursGrid";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));
const PayrunView = ({ employees, fromDate, toDate }) => {
  const classes = useStyles();
  // const [employeeHours, setEmployeeHours] = React.useState({});

  // Fetching payrun summary
  // React.useEffect(() => {
  //   // from, to, employees
  // }, []);

  return (
    <Page className={classes.root} title="Payroll process">
      <Box display="flex" flexDirection="column" height="100%">
        <Container>
          <Toolbar />
          <Results employeeHours={employeeHours} />
        </Container>
      </Box>
    </Page>
  );
};

PayrunView.propTypes = {
  employees: PropTypes.array,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
};

export default PayrunView;
