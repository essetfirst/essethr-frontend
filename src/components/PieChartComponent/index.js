import React from "react";
import PropTypes from "prop-types";

import { Box, useTheme } from "@mui/material";

import { Doughnut } from "react-chartjs-2";

const PieChartComponent = ({
  pies,
  height,
  borderWidth = 8,
  borderColor,
  hoverBorderColor,
  displayLegend = true,
}) => {
  const theme = useTheme();

  const data = [];
  const backgroundColor = [];
  const labels = [];

  pies.forEach(({ label, datum, color }) => {
    data.push(datum);
    backgroundColor.push(color);
    labels.push(label);
  });

  const pieData = {
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth,
        borderColor,
        hoverBorderColor,
      },
    ],
    labels,
  };

  const options = {
    cutout: "70%",
    layout: { padding: 2 },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: displayLegend,
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
    <Box height={height} position="relative">
      <Doughnut data={pieData} options={options} />
    </Box>
  );
};

PieChartComponent.propTypes = {
  /**
   * List of pie elements to be displayed.
   */
  pies: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      datum: PropTypes.number,
      color: PropTypes.string,
    })
  ),
  /**
   * The height of pie chart container.
   */
  height: PropTypes.number,
  /**
   * Width of border
   */
  borderWidth: PropTypes.number,
  borderColor: PropTypes.string,
  hoverBorderColor: PropTypes.string,
  displayLegend: PropTypes.bool,
};

export default PieChartComponent;
