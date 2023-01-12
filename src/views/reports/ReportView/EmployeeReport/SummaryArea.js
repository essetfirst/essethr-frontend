import React from "react";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { SquareFoot as SlackIcon } from "@material-ui/icons";

const ReportByCategoryCard = ({ title, icon, densityMap }) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* Card title */}
            <Typography>{title}</Typography>
          </Grid>
          <Grid item xs={6}>
            {/* Card Icon */}
            <Box display="flex" justifyContent="flex-end">
              <SlackIcon color="primary" fontSize="large" />
            </Box>
          </Grid>
        </Grid>
        <Box>
          {Object.keys(densityMap).map((key, index) => (
            <>
              <Box
                key={key}
                p={2}
                display="flex"
                justifyContent="space-between"
                width="100%"
              >
                <Typography component="span">{key}</Typography>

                <LinearProgress
                  variant="determinate"
                  color="secondary"
                  thickness={5}
                  value={densityMap[key] || 10}
                />
              </Box>
              {index !== Object.keys(densityMap).length - 1 && <Divider />}
            </>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const SummaryArea = ({ byDepartment, byGender, byAge, byExperience }) => {
  const categories = [
    { title: "Department", icon: "", densityMap: byDepartment },
    { title: "Gender", icon: "", densityMap: byGender },
    { title: "Age", icon: "", densityMap: byAge },
    { title: "Experience", icon: "", densityMap: byExperience },
  ];
  return (
    <div>
      {JSON.stringify(byGender)}
      <Grid container spacing={2}>
        {/* <Grid item>By Department report</Grid> */}
        {categories.map((category, index) => (
          <Grid key={index} item xs={12} sm={12} md={6}>
            <ReportByCategoryCard {...category} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SummaryArea;
