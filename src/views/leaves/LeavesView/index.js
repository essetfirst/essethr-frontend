import React from "react";

import { Grid, makeStyles, Typography } from "@material-ui/core";

import LeaveRequestForm from "./LeaveRequestForm";
import TabbedComponent from "../../../components/TabbedComponent";

import { employees, leaves as leaveList } from "./data";
import AllowanceList from "./AllowanceList";
import LeaveList from "./LeaveList";
import PageView from "../../../components/PageView";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const LeavesView = () => {
  const classes = useStyles();

  const [leaves, setLeaves] = React.useState(
    leaveList.map(({ employeeId, ...rest }) => ({
      employee: employees.getEmployee(employeeId),
      ...rest,
    }))
  );

  const handleRequest = (values) => {
    console.log(values); // Checking sanity of value

    console.log(leaves); // before adding request
    setLeaves([...leaves, values]);
    console.log(leaves); // After pushing back new request
  };

  // console.log([]);

  return (
    <PageView className={classes.root} title="Leave Management">
      <TabbedComponent
        tabs={[
          {
            label: "Overview",
            panel: <Typography>Overview panel</Typography>,
          },
          {
            label: "Requests",
            panel: (
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={4}>
                  <LeaveRequestForm
                    employees={employees.ids.map((id) =>
                      employees.getEmployee(id)
                    )}
                    onRequestSubmitted={handleRequest}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={8}>
                  <Typography variant="h4">Leave Request List</Typography>
                  <LeaveList leaves={leaves} />
                </Grid>
              </Grid>
            ),
          },
          {
            label: "Allowance",
            panel: (
              <>
                <AllowanceList />
              </>
            ),
          },
          {
            label: "Calendar",
            panel: (
              <Typography align="center" color="textPrimary" variant="h6">
                Leaves calendar
              </Typography>
            ),
          },
          {
            label: "Reports",
            panel: (
              <Typography align="center" color="textPrimary" variant="h6">
                Leave Reports
              </Typography>
            ),
          },
        ]}
        title="Leaves"
      />
    </PageView>
  );
};

export default LeavesView;
