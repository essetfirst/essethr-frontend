import React from "react";
import PropTypes from "prop-types";

import { Bar } from "react-chartjs-2";
import { Box, useTheme } from "@material-ui/core";

const BarGraphComponent = ({ bars, labels, height, displayLegend }) => {
  const theme = useTheme();

  const datasets = bars.map(({ label, data, color }) => ({
    label,
    data,
    backgroundColor: color,
  }));

  const barData = {
    datasets,
    labels,
  };

  const options = {
    animation: false,

    cornerRadius: 20,
    layout: { padding: 0, margin: 10 },
    legend: {
      display: displayLegend,
      position: "top",
      labels: {
        fontColor: theme.palette.text.secondary,
      },
    },

    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 20,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0,
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider,
          },
        },
      ],
    },

    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
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
