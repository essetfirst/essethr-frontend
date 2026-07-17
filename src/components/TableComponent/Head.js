import React from "react";
import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledVisuallyHidden = styled("span")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  top: 20,
  width: 1,
});

const Head = ({
  fields,
  rowCount,
  selectable,
  selectedCount,
  onSelectAllClicked,
  createSortHandler,
  orderBy,
  orderDir,
  hasActionsField,
}) => {
  return (
    <TableHead>
      <TableRow>
        {selectable && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selectedCount > 0 && selectedCount < rowCount}
              checked={rowCount > 0 && selectedCount === rowCount}
              onChange={onSelectAllClicked}
            />
          </TableCell>
        )}
        {fields.map(
          ({ field, label, align, sortable = true, disablePadding }) => (
            <TableCell
              key={field || label}
              align={align}
              padding={disablePadding ? "none" : "normal"}
              sortDirection={orderBy === field ? orderDir : "asc"}
            >
              {sortable ? (
                <TableSortLabel
                  active={orderBy === field}
                  direction={orderBy === field ? orderDir : "asc"}
                  onClick={createSortHandler(field)}
                >
                  <Typography component="span" variant="caption" fontWeight={600}>
                    {label}
                  </Typography>
                  {orderBy === field ? (
                    <StyledVisuallyHidden>
                      {orderDir === "desc" ? "sorted descending" : "sorted ascending"}
                    </StyledVisuallyHidden>
                  ) : null}
                </TableSortLabel>
              ) : (
                <Typography component="span" variant="caption" fontWeight={600}>
                  {label}
                </Typography>
              )}
            </TableCell>
          ),
        )}
        {hasActionsField && (
          <TableCell align="right">
            <Typography component="span" variant="caption" fontWeight={600}>
              Actions
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
};

export default Head;
