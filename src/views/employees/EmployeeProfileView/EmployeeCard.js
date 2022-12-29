import React from "react";
import PropTypes from "prop-types";
import { Box, Divider, Typography, Card, CardContent } from "@material-ui/core";
import { useBarcode } from "@createnextapp/react-barcode";
import CustomAvatar from "../../../components/CustomAvatar";

const EmployeeIDCard = ({ employee }) => {
  const { id, org, firstName, image, position, department, surName, jobTitle } =
    employee;
  const { inputRef } = useBarcode({
    value: String(id),
    options: {
      displayValue: false,
      background: "#fff",
    },
  });

  return (
    <Box p={2} width={350} display="flex" flexDirection="column">
      <Card
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          borderRadius: 10,
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
        }}
      >
        <CardContent
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" mt={1}>
            <CustomAvatar src={image} size="3">
              {String(firstName || "")
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
              <Typography
                color="textSecondary"
                style={{ fontWeight: "bold", color: "#000", fontSize: 18 }}
              >
                {org}
              </Typography>
              <Typography style={{ color: "#000" }}>
                Name:
                {` ${firstName} ${surName}`}
              </Typography>
              <Typography color="textSecondary" style={{ color: "#000" }}>
                {department}
                {" • "}
                {position}
              </Typography>
              <Box m={1} />
              {/* <Typography>{gender}</Typography> */}
              <Box
                width="100%"
                height="100%"
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-start"
                // alignSelf="flex-start"
              >
                <img ref={inputRef} alt={"barcode"} height={10} width={100} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

EmployeeIDCard.propTypes = {
  employee: PropTypes.shape({
    id: PropTypes.string,
    org: PropTypes.string,
    firstName: PropTypes.string,
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
