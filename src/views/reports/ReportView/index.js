import React from "react";

import {
  // Avatar,
  // Box,
  // Card,
  // CardActions,
  // CardContent,
  // CardHeader,
  // Divider,
  Grid,
  // Link,
  // Typography,
} from "@material-ui/core";

import { PersonOutlined } from "@material-ui/icons";

// import API from "../../../api";

import PageView from "../../../components/PageView";

import TabbedComponent from "../../../components/TabbedComponent";
// import CustomReport from "./CustomReport";
import { BarChart } from "react-feather";
import CardList from "../../../components/CardList";

const StandardReportsPanel = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item sm={12} md={6} lg={4}>
          <CardList
            cards={[
              {
                title: "Payroll hours report",
                icon: <PersonOutlined fontSize="large" />,
                description: "Employee paryoll bound hours. ",
                link: "/app/reports/payroll-hours-view",
              },
              {
                title: "Absentee report",
                icon: <PersonOutlined fontSize="large" />,
                description: "Summary of employee absence. ",
                link: "/app/reports/absentees-view",
              },
              {
                title: "Leave balance report",
                icon: <PersonOutlined fontSize="large" />,
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
    <PageView title="Reports" icon={<BarChart />}>
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
