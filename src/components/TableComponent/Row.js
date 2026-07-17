import React from "react";

// import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import {
  // Button,
  Checkbox,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import { MoreVert as MoreVertIcon } from "@mui/icons-material";

const Row = (rowProps) => {
  // console.log("Inside Row component: ", rowProps);
  const {
    columns,
    rowData,
    renderRow,
    rowActions,
    selectable,
    onSelectClicked,
    isSelected,
    onRowClicked,
  } = rowProps;
  // console.log(row);
  const rowId = rowData._id || rowData.id;
  const labelId = `table-row-${rowId}`;
  const isItemSelected = isSelected(rowId);

  const [actionMenuAnchorEl, setActionMenuAnchorEl] = React.useState(null);

  const handleActionMenuClick = (event) => {
    setActionMenuAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
  };

  const defaultRowCellsRender = (rowProps) =>
    columns.map(({ field, align, renderCell }, index) => (
      <TableCell align={align} key={field || index}>
        {renderCell && typeof renderCell === "function" ? (
          renderCell(rowProps)
        ) : (
          <Typography variant="body2">{rowProps[field]}</Typography>
        )}
      </TableCell>
    ));

  //   const renderRowActionButtons = (rowProps) =>
  //     rowActions.map(({ hide, type, label, icon, handler, ...rest }, index) => {
  //       const { node, position } = icon || {};
  //       return typeof hide === "function" && hide(rowProps) ? null : type ===
  //         "icon" ? (
  //         <IconButton
  //           key={index}
  //           onClick={() => handler(rowProps)}
  //           aria-label={label}
  //           {...rest}
  //           className={classes.buttonSpacing}
  //         >
  //           {node}
  //         </IconButton>
  //       ) : (
  //         <Button
  //           key={index}
  //           aria-label={label}
  //           onClick={() => handler(rowProps)}
  //           startIcon={position === "start" && node}
  //           endIcon={position === "end" && node}
  //           {...rest}
  //           className={classes.buttonSpacing}
  //         >
  //           {label}
  //         </Button>
  //       );
  //     });

  const rowActionsMenuList = (rowProps) =>
    rowActions
      .filter(({ hide }) => {
        if (typeof hide === "function") return !hide(rowProps);
        return !hide;
      })
      .map(({ label, icon, handler = () => null }, index) => (
        <MenuItem key={index} onClick={() => handler(rowProps)}>
          {icon ? (
            React.isValidElement(icon) ? (
              <ListItemIcon>{icon}</ListItemIcon>
            ) : (
              <ListItemIcon>{icon.node}</ListItemIcon>
            )
          ) : null}
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ));

  return (
    <TableRow
      hover
      sx={{
        cursor: typeof onRowClicked === "function" ? "pointer" : "default",
      }}
      aria-checked={isItemSelected}
      tabIndex={-1}
      role="checkbox"
      selected={isItemSelected}
      onClick={() =>
        typeof onRowClicked === "function" && onRowClicked(rowData)
      }
      key={rowId}
      id={labelId}
    >
      {selectable && (
        <TableCell padding="checkbox">
          <Checkbox
            onClick={(event) => onSelectClicked(event, rowId)}
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
      )}
      {renderRow &&
      typeof renderRow === "function" &&
      React.isValidElement(renderRow)
        ? renderRow(rowData)
        : defaultRowCellsRender(rowData)}
      {rowActions.length > 0 && (
        // <TableCell>{renderRowActionButtons(row)}</TableCell>,
        <TableCell>
          <IconButton onClick={handleActionMenuClick} aria-label="action">
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      )}
      <Menu
        id={labelId}
        anchorEl={actionMenuAnchorEl}
        keepMounted
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleActionMenuClose}
      >
        {rowActionsMenuList(rowData)}
      </Menu>
    </TableRow>
  );
};

export default Row;
