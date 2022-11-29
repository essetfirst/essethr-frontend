import React from "react";

import { Box, Card, CardContent, Link, Typography } from "@material-ui/core";
import { Timer } from "@material-ui/icons";

const ReportTypeCard = ({ title, icon, description, link }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component={Link} href={link}>
          <span
            style={{
              verticalAlign: "middle",
              marginRight: "8px",
              color: "grey",
              width: 64,
              height: 64,
            }}
          >
            {icon}
          </span>
          {title}
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          {description}
        </Typography>
        <Box m={2} />
        {/* <div style={{ mt: "8px", display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              verticalAlign: "middle",
              color: "grey",
              width: 32,
              height: 32,
            }}
          >
            <Timer fontSize="small" />
          </div>
          <Typography variant="body2" color="textSecondary">
            {"2hrs ago"}
          </Typography>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default ReportTypeCard;
