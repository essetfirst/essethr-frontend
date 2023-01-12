import React from "react";

import { Grid } from "@material-ui/core";

import PageView from "../../../components/PageView";

import TabbedComponent from "../../../components/TabbedComponent";
import { BarChart } from "react-feather";
import CardList from "../../../components/CardList";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import TimeToLeaveIcon from "@material-ui/icons/TimeToLeave";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

const StandardReportsPanel = () => {
  return (
    <>
      <Grid container spacing={2} direction="row">
        <Grid item sm={12} md={12} lg={8}>
          <CardList
            cards={[
              {
                title: "Payroll hours report",
                icon: <MonetizationOnIcon fontSize="large" />,
                description: "Employee paryoll bound hours. ",
                link: "/app/reports/payroll-hours-view",
              },
              {
                title: "Absentee report",
                icon: <RemoveCircleOutlineIcon fontSize="large" />,
                description: "Summary of employee absence. ",
                link: "/app/reports/absentees-view",
              },
              {
                title: "Leave balance report",
                icon: <TimeToLeaveIcon fontSize="large" />,
                description: "Employee leave balance. ",
                link: "/app/reports/leave-balances-view",
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
};

const ReportView = () => {
  return (
    <PageView
      title="Reports"
      icon={<BarChart fontSize="large" />}
      backPath="/app/dashboard"
    >
      <TabbedComponent
        tabs={[
          { label: "Standard Reports", panel: <StandardReportsPanel /> },
          {
            label: "Custom Reports",
            panel: <div>Custom reports are still in development!</div>,
          },
        ]}
      />
    </PageView>
  );
};

export default ReportView;
