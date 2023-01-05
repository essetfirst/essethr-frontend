import React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { DashboardOutlined as DashboardIcon } from "@material-ui/icons";

import moment from "moment";
import useOrg from "../../../providers/org";
import PageView from "../../../components/PageView";

import TotalEmployees from "./TotalEmployees";
import TotalAttendance from "./TotalAttendance";
import TotalLeaves from "./TotalLeaves";
import InactiveEmployee from "./InactiveEmployee";

import AttendanceSummary from "../../attendance/AttendanceSummary";
import useAttendance from "../../../providers/attendance";

const useStyles = makeStyles(() => ({
  root: {},
}));

const DashboardView = () => {
  const classes = useStyles();
  const { org } = useOrg();
  const { employees } = org;
  const { state, fetchAttendance } = useAttendance();

  //get current month attendance summary
  const today = moment(new Date()).format("YYYY-MM-DD");

  React.useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

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
            currentMonthEmployeesCount={
              (employees || []).filter((e) => e.status === "active").length
            }
            calculatePercentage={
              (employees || []).length
                ? (
                    ((employees || []).filter((e) => e.status === "active")
                      .length /
                      (employees || []).length) *
                    100
                  ).toLocaleString(undefined, { maximumFractionDigits: 1 })
                : 0
            }
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalAttendance
            totalAttendance={
              state.attendanceByDate[today]
                ? state.attendanceByDate[today].length
                : 0
            }
            calculatePercentage={
              (employees || []).length
                ? (
                    (state.attendanceByDate[today]
                      ? state.attendanceByDate[today].length
                      : 0) / (employees || []).length
                  ).toFixed(2) * 100
                : 0
            }
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalLeaves />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <InactiveEmployee
            totalInactiveEmployees={
              (employees || []).filter((e) => e.status === "inactive").length
            }
            calculatePercentage={
              (employees || []).length
                ? (
                    ((employees || []).filter((e) => e.status === "inactive")
                      .length /
                      (employees || []).length) *
                    100
                  ).toLocaleString(undefined, { maximumFractionDigits: 1 })
                : 0
            }
          />
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
              attendanceByDate={state.attendanceByDate}
              totalEmployees={(employees || []).length}
            />
          </Grid>
        </Grid>
      </Grid>
    </PageView>
  );
};

export default DashboardView;
