import React from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  makeStyles,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
}));

const Toolbar = ({ className }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box display="flex" justifyContent="space-between" mt={4}>
        <div>
          <Button aria-label="export">export</Button>
          <Button aria-label="import">print</Button>
        </div>
        <div>
          <Button>Prev</Button>
          <Button>Next</Button>
        </div>
      </Box>
      <Divider />
      <Card>
        <CardContent>
          <Box p={1} maxWidth={500}>
            <TextField
              fullWidth
              id="searchField"
              name="searchText"
              variant="outlined"
              placeholder="Search payroll"
            />
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default Toolbar;
