import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, colors } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const PayrollStats = ({ className, ...rest }) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: [18, 5, 19, 27, 29, 19, 20],
        label: "This year",
      },
      {
        backgroundColor: colors.grey[200],
        data: [11, 20, 12, 29, 30, 25, 13],
        label: "Last year",
      },
    ],
    labels: ["1 Aug", "2 Aug", "3 Aug", "4 Aug", "5 Aug", "6 Aug"],
  };

  const options = {
    layout: { padding: 0 },
    maintainAspectRatio: false,
    responsive: true,
    datasets: {
      bar: {
        borderRadius: 20,
        barThickness: 12,
        maxBarThickness: 10,
        categoryPercentage: 0.5,
        barPercentage: 0.5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: theme.palette.background.default,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        footerColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          borderDash: [2],
          color: theme.palette.divider,
          drawBorder: false,
        },
      },
    },
  };

  return (
    <Card className={className} {...rest}>
      <CardHeader
        action={
          <Button endIcon={<ArrowDropDownIcon />} size="small" variant="text">
            Last 7 months
          </Button>
        }
        title="Latest Payrolls"
      />
      <Divider />
      <CardContent>
        <Box height={400} position="relative">
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
};

PayrollStats.propTypes = {
  className: PropTypes.string,
};

export default PayrollStats;
