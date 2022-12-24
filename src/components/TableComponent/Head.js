import React from "react";
import {
  Checkbox,
  makeStyles,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));
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
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        {selectable && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selectedCount > 0 && selectedCount < rowCount}
              checked={rowCount > 0 && selectedCount === rowCount}
              onChange={onSelectAllClicked}
              //   inputProps={{ "aria-label": "select all desserts" }}
            />
          </TableCell>
        )}
        {fields.map(
          ({
            field,
            label,
            align,
            sortable = true,
            filterable,
            disablePadding,
          }) => (
            <TableCell
              key={field || label}
              align={align}
              padding={disablePadding ? "none" : "default"}
              sortDirection={orderBy === field ? orderDir : "asc"}
            >
              <Typography variant="h6" color="textSecondary">
                {sortable ? (
                  <TableSortLabel
                    active={orderBy === field}
                    direction={orderBy === field ? orderDir : "asc"}
                    onClick={createSortHandler(field)}
                  >
                    {label.toUpperCase()}
                    {orderBy === field ? (
                      <span className={classes.visuallyHidden}>
                        {orderDir === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                ) : (
                  label
                )}
              </Typography>
            </TableCell>
          )
        )}
        {hasActionsField && <TableCell>{"Actions".toUpperCase()}</TableCell>}
      </TableRow>
    </TableHead>
  );
};

export default Head;
