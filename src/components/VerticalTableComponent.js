import React from "react";
import PropTypes from "prop-types";

import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";

const VerticalTableComponent = ({ keys, data = [] }) => {
  const fields = keys ? keys : data.length ? Object.keys(data[0]) : [];
  return (
    <Paper elevation={1}>
      <TableContainer style={{ minWidth: "250px" }}>
        <Table>
          <TableBody>
            {data.map((element) => {
              return fields.map(({ label, field, renderField }) => {
                return (
                  <TableRow key={field}>
                    <TableCell>
                      <Typography variant="h6" align="left" color="textPrimary">
                        {label}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Divider
                        orientation="vertical"
                        style={{ height: "100%" }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      {(renderField && typeof renderField === "function") ||
                      React.isValidElement(renderField)
                        ? renderField(element)
                        : String(element[field])}
                    </TableCell>
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

VerticalTableComponent.propTypes = {
  keys: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default VerticalTableComponent;
