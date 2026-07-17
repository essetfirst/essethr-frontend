import React from "react";

import { Grid } from "@mui/material";

import PageView from "components/PageView";

import TabbedComponent from "components/TabbedComponent";
import { BarChart } from "react-feather";
import CardList from "components/CardList";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CustomReport from "./CustomReport";
import ReportSchedulesPanel from "../../components/ReportSchedulesPanel";

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
            panel: <CustomReport />,
          },
          {
            label: "Scheduled delivery",
            panel: <ReportSchedulesPanel />,
          },
        ]}
      />
    </PageView>
  );
};

export default ReportView;
