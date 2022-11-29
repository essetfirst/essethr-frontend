import React from "react";

import {
  Avatar,
  Card,
  CardContent,
  colors,
  Grid,
  Typography,
} from "@material-ui/core";

import { PeopleOutlined as PeopleIcon } from "@material-ui/icons";
import BarGraphComponent from "../../../../components/BarGraphComponent";

const NewRequestsCard = () => {
  return (
    <Card>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          {/* <Grid item>
            <Avatar
              style={{
                backgroundColor: colors.orange[600],
                height: 56,
                width: 56,
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid> */}
          <Grid item>
            <Typography gutterBottom>NEW LEAVE REQUESTS</Typography>
            <Typography color="textPrimary" variant="h3" align="center">
              0
            </Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom>EMPLOYEES ON LEAVE</Typography>
            <Typography align="center" color="textPrimary" variant="h3">
              0
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const LeavesByType = ({ leavesByType, totalLeaves = 1 }) => {
  return (
    <Card>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          {/* <Grid item>
            <Avatar
              style={{
                backgroundColor: colors.orange[600],
                height: 56,
                width: 56,
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid> */}
          {(leavesByType || []).map(({ type, count }) => (
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="h6">
                {type}
              </Typography>
              <Typography color="textPrimary" variant="h3">
                {count} | {(count / totalLeaves) * 100}%
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const AnnualLeaveGraph = ({ leavesByMonth }) => {
  return (
    <Card>
      <CardContent>
        <BarGraphComponent
          bars={[
            {
              data: Object.values(leavesByMonth),
              color: colors.orange[500],
            },
          ]}
          labels={Object.keys(leavesByMonth)}
        />
      </CardContent>
    </Card>
  );
};

const Summary = () => {
  return (
    <Grid container spacing={2}>
      <Grid item lg={3}>
        <NewRequestsCard />
        How many new pending leave requests? (12) How many employees are still
        out on leave? (24 / 10%)
      </Grid>

      <Grid item lg={3}>
        <LeavesByType
          leavesByType={[
            { type: "Annual", count: 5 },
            { type: "Special", count: 3 },
            { type: "Maternal", count: 2 },
          ]}
          totalLeaves={10}
        />
        Leave numbers by leave type pie chart of this month? [annual(12/47%),
        special(10/50%), maternal(3/80%)]
      </Grid>
      <Grid item lg={3}>
        <AnnualLeaveGraph leavesByMonth={{ Jan: 20, Feb: 10, Mar: 5 }} />
        Annual leave line graph by month [Sep(1), Oct(10), Nov(3)]
      </Grid>
    </Grid>
  );
};

export default Summary;
