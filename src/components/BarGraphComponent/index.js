import React from "react";
import PropTypes from "prop-types";

import { Bar } from "react-chartjs-2";
import { Box, useTheme } from "@mui/material";

const BarGraphComponent = ({
  bars = [],
  labels = [],
  height,
  displayLegend,
}) => {
  const theme = useTheme();

  const datasets = bars.map(({ label, data, color }) => ({
    label,
    data,
    backgroundColor: color,
    borderRadius: 8,
    barThickness: 12,
    maxBarThickness: 20,
    categoryPercentage: 0.5,
    barPercentage: 0.5,
  }));

  const barData = {
    datasets,
    labels,
  };

  const options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,

    layout: { padding: 0 },
    plugins: {
      legend: {
        display: displayLegend,
        position: "top",
        labels: {
          color: theme.palette.text.secondary,
        },
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
    <Box height={height} position="relative">
      <Bar data={barData} options={options} />
    </Box>
  );
};

BarGraphComponent.propTypes = {
  /**
   * The bar elements to be displayed on the y-axis
   *
   */
  bars: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number),
      color: PropTypes.string,
    })
  ),

  /**
   * The list of labels for the x-axis.
   *
   */
  labels: PropTypes.arrayOf(PropTypes.string),

  /**
   * Display height of the bar graph.
   *
   */
  height: PropTypes.number,
};

export default BarGraphComponent;
