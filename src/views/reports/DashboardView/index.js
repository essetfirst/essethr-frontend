import React from "react";
import moment from "moment";
import { Grid, makeStyles } from "@material-ui/core";
import { DashboardOutlined as DashboardIcon } from "@material-ui/icons";

import {} from "react-feather";
import useOrg from "../../../providers/org";
import PageView from "../../../components/PageView";

import TotalEmployees from "./TotalEmployees";
import TotalAttendance from "./TotalAttendance";
import TotalLeaves from "./TotalLeaves";
import TotalPayroll from "./TotalPayroll";

import AttendanceSummary from "../../attendance/AttendanceSummary";

const useStyles = makeStyles(() => ({
  root: {},
}));

const DashboardView = () => {
  const classes = useStyles();
  const { org } = useOrg();
  const { employees, departments, positions } = org;
  React.useEffect(() => {}, [departments, employees, org, positions]);
  return (
    <PageView
      className={classes.root}
      title="Dashboard"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <DashboardIcon />
        </span>
      }
    >
      <Grid container spacing={2}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalEmployees
            currentMonthEmployeesCount={employees ? employees.length : 0}
            lastMonthEmployeesCount={
              employees
                ? employees.filter(
                    (e) =>
                      e.hireDate && moment(new Date()).diff(e.hireDate, "M")
                  ).length
                : 0
            }
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalAttendance />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalLeaves />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalPayroll />
        </Grid>

        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="flex-start"
          style={{
            width: "100%",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <Grid item sm={12} md={12} lg={12}>
            <AttendanceSummary
              attendanceByDate={
                employees
                  ? employees.reduce((acc, e) => {
                      if (e.attendance) {
                        e.attendance.forEach((a) => {
                          if (acc[a.date]) {
                            acc[a.date] += 1;
                          } else {
                            acc[a.date] = 1;
                          }
                        });
                      }
                      return acc;
                    }, {})
                  : {}
              }
              totalEmployees={(employees || []).length}
            />
          </Grid>
        </Grid>
      </Grid>
    </PageView>
  );
};

export default DashboardView;
