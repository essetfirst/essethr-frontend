import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";
import { Box, Card, CardContent, CardHeader, Divider, useTheme, colors } from "@mui/material";

const LeavesByType = ({ className, ...rest }) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [63, 15, 22],
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600],
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white,
      },
    ],
    labels: ["Desktop", "Tablet", "Mobile"],
  };

  const options = {
    cutout: "80%",
    layout: { padding: 0 },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        mode: "index",
        backgroundColor: theme.palette.background.default,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        footerColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    },
  };

  return (
    <Card className={className} sx={{ height: "100%" }} {...rest}>
      <CardHeader title="Leave by Type" />
      <Divider />
      <CardContent>
        <Box height={300} position="relative">
          <Doughnut data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

LeavesByType.propTypes = {
  className: PropTypes.string,
};

export default LeavesByType;
