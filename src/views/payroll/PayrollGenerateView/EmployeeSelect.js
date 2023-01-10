import React from "react";

import {
  Box,
  Checkbox,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";

import { SearchOutlined as SearchIcon } from "@material-ui/icons";

const EmployeeSelect = ({ employees, onSelectionChange }) => {
  // const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleToggle = (value) => () => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

  const handleAllSelection = (e) => {
    setSelected(
      selected.length !== employees.length ? employees.map(({ id }) => id) : []
    );
  };

  const handleChange = (e) => setSearchTerm(e.target.value);

  // const selectionChange = React.useCallback(
  //   () => onSelectionChange(selected),
  //   [selected, onSelectionChange]
  // );
  // React.useEffect(() => {
  //   selectionChange(selected);
  // }, [selected, selectionChange]);

  return (
    <Box display="flex" flexDirection="column" flex="1">
      <Box p={2}>
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
      </Box>
      <List>
        <ListItem>
          <ListItemText id={`employee-list-item-0`} primary={"Select all"} />
          <ListItemSecondaryAction>
            <Checkbox
              edge="end"
              onChange={handleAllSelection}
              checked={selected.length === employees.length}
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
                <ListItemAvatar>
                  <Avatar alt={name} />
                </ListItemAvatar>
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

export default EmployeeSelect;
