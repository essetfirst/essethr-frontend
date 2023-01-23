import React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { DashboardOutlined as DashboardIcon } from "@material-ui/icons";

import moment from "moment";
import useOrg from "../../../providers/org";
import PageView from "../../../components/PageView";
import useLeave from "../../../providers/leave";

import TotalEmployees from "./TotalEmployees";
import TotalAttendance from "./TotalAttendance";
import TotalLeaves from "./TotalLeaves";
import InactiveEmployee from "./InactiveEmployee";
import Backdrop from "@material-ui/core/Backdrop";
import AttendanceSummary from "../../attendance/AttendanceSummary";
import useAttendance from "../../../providers/attendance";
import { ThreeDots } from "react-loading-icons";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    backdropFilter: "blur(3px)",
  },
}));

const DashboardView = () => {
  const classes = useStyles();
  const { org } = useOrg();
  const { employees } = org;
  const { state, fetchAttendance } = useAttendance();
  const { state: leavesState, fetchLeaves } = useLeave();

  //get current month attendance summary
  const today = moment(new Date()).format("YYYY-MM-DD");

  React.useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {!employees && (
        <Backdrop className={classes.backdrop} open>
          <ThreeDots width={100} height={100} fill="#fff" />
        </Backdrop>
      )}

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
                  ).toFixed(0)
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
                    ((state.attendanceByDate[today]
                      ? state.attendanceByDate[today].length
                      : 0) /
                      (employees || []).length) *
                    100
                  ).toFixed(0)
                : 0
            }
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalLeaves
            totalLeaves={leavesState.fetchLeaves.leaves.length || 0}
            calculatePercentage={
              (employees || []).length
                ? (
                    ((leavesState.fetchLeaves.leaves.length || 0) /
                      (employees || []).length) *
                    100
                  ).toFixed(0)
                : 0
            }
          />
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
                  ).toFixed(0)
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
