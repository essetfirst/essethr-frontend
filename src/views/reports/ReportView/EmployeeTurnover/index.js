import { Box, Button, Grid, Typography } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
import React from "react";
import BarGraphComponent from "../../../../components/BarGraphComponent";

import CardWithTitle from "../../../../components/CardWithTitle";

import PieChartComponent from "../../../../components/PieChartComponent";
import TableComponent from "../../../../components/TableComponent";

const COLORS = ["red", "green", "lightyellow", "grey", "cinamon", "gold"];

const TurnoverTrendByMonth = ({
  turnoverByMonth = { Jan: 2, Feb: 4, Mar: 5, Apr: 9, May: 7 },
}) => {
  return (
    <CardWithTitle title={"Turnover trend"}>
      <BarGraphComponent
        bars={[
          {
            label: "This year",
            data: Object.values(turnoverByMonth),
            color: COLORS[1],
          },
        ]}
        labels={Object.keys(turnoverByMonth)}
      />
      {/* <Bar
        data={{
          datasets: [
            {
              label: "This year",
              data: Object.values(turnoverByMonth),
              backgroundColor: COLORS[1],
            },
          ],
          labels: Object.keys(turnoverByMonth),
        }}
        height={100}
      /> */}
    </CardWithTitle>
  );
};

const TerminationsChartByReason = ({ terminationsByReason = {} }) => {
  return (
    <CardWithTitle
      title={"Termination by Reason"}
      footer={
        <Box width="100%" display="flex" justifyContent="flex-end">
          <Button color="primary" endIcon={<ChevronRight />}>
            View more
          </Button>
        </Box>
      }
    >
      <PieChartComponent
        pies={Object.keys(terminationsByReason).map((key, index) => ({
          label: key,
          datum: terminationsByReason[key],
          color: COLORS[index % COLORS.length],
        }))}
        displayLegend={false}
      />
    </CardWithTitle>
  );
};

const TerminationsChartByDepartment = ({ terminationsByDepartment = {} }) => {
  return (
    <CardWithTitle
      title={"Termination by Department "}
      footer={
        <Box width="100%" display="flex" justifyContent="flex-end">
          <Button color="primary" endIcon={<ChevronRight />}>
            View more
          </Button>
        </Box>
      }
    >
      <PieChartComponent
        pies={Object.keys(terminationsByDepartment).map((key, index) => ({
          label: key,
          datum: terminationsByDepartment[key],
          color: COLORS[index % COLORS.length],
        }))}
      />
    </CardWithTitle>
  );
};
const TerminationsChartByLengthOfService = ({ lengthOfService = {} }) => {
  return (
    <CardWithTitle
      title={"Length of Service"}
      footer={
        <Box width="100%" display="flex" justifyContent="flex-end">
          <Button color="primary" endIcon={<ChevronRight />}>
            View more
          </Button>
        </Box>
      }
    >
      <PieChartComponent
        pies={Object.keys(lengthOfService).map((key, index) => ({
          label: key,
          datum: lengthOfService[key],
          color: COLORS[index % COLORS.length],
        }))}
      />
    </CardWithTitle>
  );
};

const TerminatedCasesList = ({ terminations = [] }) => {
  return (
    <TableComponent
      size="small"
      columns={[{ field: "employee", label: "Employee" }]}
      data={terminations}
    />
  );
};

const EmployeeTurnoverReport = ({
  employeeCountByMonth,
  byReason,
  byDepartment,
  byLengthOfService,
  terminatedCases,
}) => {
  return (
    <div>
      <Typography>Employee Turnover</Typography>
      <TurnoverTrendByMonth />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <TerminationsChartByReason
            terminationsByReason={{
              Unspecified: 10,
              "Not fit": 5,
              "Another job": 4,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <TerminationsChartByDepartment />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <TerminationsChartByLengthOfService />
        </Grid>
      </Grid>

      <TerminatedCasesList />
      {/* Bar graph of employeeCountByMonth */}
      {/* PieChart of byReason, byDepartment, byLengthOfService  */}
      {/* Table of terminatedCases  */}
    </div>
  );
};

export default EmployeeTurnoverReport;
