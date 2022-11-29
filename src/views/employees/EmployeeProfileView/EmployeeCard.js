import React from "react";
import PropTypes from "prop-types";

import { Box, Divider, Typography } from "@material-ui/core";

import { useBarcode } from "@createnextapp/react-barcode";

import CustomAvatar from "../../../components/CustomAvatar";
// import CardWithTitle from "../../../components/CardWithTitle";

const EmployeeIDCard = ({ employee }) => {
  const { id, org, name, image, department, jobTitle } = employee;

  const { inputRef } = useBarcode({
    value: String(id),
    options: {
      displayValue: false,
      background: "#fff",
    },
  });

  return (
    <Box p={2} width={350} display="flex" flexDirection="column">
      <Box ml={1}>
        <Typography variant="h4">{org}</Typography>
        <Box mt={1} />
        <Divider />
      </Box>
      <Box display="flex" mt={1}>
        <CustomAvatar src={image} size="3">
          {String(name)
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </CustomAvatar>
        <Box
          ml={1}
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
        >
          <Typography variant="h5">{name}</Typography>
          <Typography variant="h6" color="textSecondary">
            {jobTitle}
            {" • "}
            {department}
          </Typography>
          <Box m={1} />
          {/* <Typography>{gender}</Typography> */}
          <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            // alignSelf="flex-start"
          >
            <img ref={inputRef} alt={"barcode"} height={30} width={70} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

EmployeeIDCard.propTypes = {
  employee: PropTypes.shape({
    id: PropTypes.string,
    org: PropTypes.string,
    name: PropTypes.string,
    gender: PropTypes.string,
    department: PropTypes.string,
    jobTitle: PropTypes.string,
  }),
};

export default class EmployeePrintableIDCard extends React.Component {
  render() {
    return <EmployeeIDCard {...this.props} />;
  }
}
