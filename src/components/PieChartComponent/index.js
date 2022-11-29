import React from "react";
import PropTypes from "prop-types";

import { Box, useTheme } from "@material-ui/core";

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
    cutoutPercentage: 70,
    layout: { padding: 2 },
    legend: {
      display: displayLegend,
    },
    maintainAspectRatio: false,
    responsive: true,
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
