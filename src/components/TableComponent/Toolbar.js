import React from "react";

import clsx from "clsx";
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Toolbar as MuiToolbar,
  Typography,
} from "@material-ui/core";
import { lighten } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  buttonSpacing: {
    margin: theme.spacing(0, 1),
  },

  toolbar: {
    flex: 1,
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  toolbarHighlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  toolbarTitle: {
    flex: "1 1 100%",
  },
}));

const Toolbar = ({
  maxCount,
  selected,
  toolbarSelectionTitle = "Selected",
  toolbarActions,
}) => {
  const classes = useStyles();
  const selectedCount = selected.length;
  if (selectedCount < 1) {
    return null;
  }

  return (
    <MuiToolbar
      className={clsx(classes.toolbar, {
        [classes.toolbarHighlight]: selectedCount > 0,
      })}
    >
      {/* START: Number of selection label */}
      {selectedCount > 0 ? (
        <Typography
          className={classes.toolbarTitle}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selectedCount === maxCount ? "All" : selectedCount}{" "}
          {toolbarSelectionTitle}
        </Typography>
      ) : null}
      {/* END */}

      {/* START: Dense view tuning */}
      {/* <FormControlLabel
            label="Dense table"
            control={
              <Checkbox
                onClick={handleChangeDense}
                checked={dense}
                inputProps={{ "aria-labelledby": "dense view checkbox" }}
              />
            }
          />

          <FormControlLabel
            control={
              <Switch checked={dense} onChange={handleChangeDense} />
            }
            label="Dense padding"
          /> */}
      {/* END */}

      {/* Action Buttons */}
      {selectedCount > 1 && (
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          {toolbarActions.map(
            ({ type, label, icon, handler, ...rest }, index) => {
              return type === "icon" ? (
                <IconButton
                  key={index}
                  className={classes.buttonSpacing}
                  onClick={handler(selected)}
                  aria-label={label}
                  {...rest}
                >
                  {icon}
                </IconButton>
              ) : (
                <Button
                  key={index}
                  className={classes.buttonSpacing}
                  onClick={handler(selected)}
                  startIcon={icon}
                  aria-label={label}
                  variant="outlined"
                  {...rest}
                >
                  {label}
                </Button>
              );
            }
          )}
        </Box>
      )}
    </MuiToolbar>
  );
};

export default Toolbar;
