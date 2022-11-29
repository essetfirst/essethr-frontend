import React from "react";

import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Typography,
} from "@material-ui/core";

import { SearchOutlined as SearchIcon } from "@material-ui/icons";

const EmployeeSelectionPanel = ({ employees, onSelectionChange }) => {
  // const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectAll, setSelectAll] = React.useState(false);

  const handleToggle = (value) => () => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
    onSelectionChange && onSelectionChange(newSelected);
  };

  const handleChange = (e) => setSearchTerm(e.target.value);

  const handleAllSelection = (e) => {
    setSelectAll(!selectAll);
    setSelected((selectAll) =>
      selectAll ? employees.map(({ id }) => id) : []
    );
    onSelectionChange && onSelectionChange(selected);
  };

  return (
    <Box height="100%" justifyContent="center">
      <Typography variant="h3" align="center" gutterBottom>
        Select employees for payroll
      </Typography>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            name="searchTerm"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search employee"
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>
      <List>
        <ListItem>
          <ListItemText id={`employee-list-item-0`} primary={"Select all"} />
          <ListItemSecondaryAction>
            <Checkbox
              edge="end"
              onChange={handleAllSelection}
              checked={selectAll}
              inputProps={{ "aria-labelledby": "employee-list-item-0" }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        {employees
          .filter(({ name }) => name.includes(searchTerm))
          .map(({ id, name }) => {
            let labelId = `employee-list-item-${id}`;
            return (
              <ListItem key={id}>
                <ListItemText id={labelId} primary={name} />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(id)}
                    checked={selected.indexOf(id) !== -1}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
};

export default EmployeeSelectionPanel;
