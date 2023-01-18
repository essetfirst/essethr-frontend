import React from "react";
import PropTypes from "prop-types";
import AddCircleIcon from "@material-ui/icons/AddCircle";

// import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";

import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@material-ui/icons";

import TableComponent from "../../../components/TableComponent";

import HolidayForm from "./HolidayForm";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "35ch",
    background: theme.palette.background.paper,
  },
  dialog: {
    backdropFilter: "blur(5px)",
  },
}));

const HolidayList = ({
  holidays,
  holidaysMap,
  onAddHoliday,
  onUpdateHoliday,
  onDeleteHoliday,
  onSortParamsChange,
}) => {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearchTermChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const [selectedHoliday, setSelectedHoliday] = React.useState(null);

  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const handleDialogOpen = () => setFormDialogOpen(true);
  const handleDialogClose = () => setFormDialogOpen(false);

  const handleAddClick = () => {
    setSelectedHoliday(null);
    handleDialogOpen();
  };

  const handleEditClick = (_id) => {
    setSelectedHoliday(_id);
    handleDialogOpen();
  };

  const handleDeleteClick = (_id) => {
    onDeleteHoliday(_id);
  };

  const handleFormSubmit = (holidayInfo) => {
    selectedHoliday ? onUpdateHoliday(holidayInfo) : onAddHoliday(holidayInfo);
    handleDialogClose();
    setSelectedHoliday("");
  };

  return (
    <Box>
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          className={classes.textField}
          name="searchTerm"
          onChange={handleSearchTermChange}
          value={searchTerm}
          placeholder="Search holidays"
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClick}
            startIcon={<AddCircleIcon />}
          >
            Create
          </Button>
        </ButtonGroup>
        <Dialog
          open={formDialogOpen}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="sm"
          className={classes.dialog}
        >
          <DialogContent>
            <HolidayForm
              holiday={holidaysMap[selectedHoliday]}
              onCancel={handleDialogClose}
              onSubmit={handleFormSubmit}
            />
          </DialogContent>
        </Dialog>
      </Box>
      <TableComponent
        size="small"
        columns={[
          { label: "Name", field: "name" },
          {
            label: "Date",
            field: "date",
            renderCell: ({ date }) => moment(date).format("MMMM Do"),
          },
          {
            label: "Half Day ",
            field: "halfDate",
            align: "center",
            renderCell: ({ halfDay }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={halfDay}
                    indeterminate={!halfDay}
                  />
                }
              />
            ),
          },
          {
            label: "Included in Payroll ",
            field: "inPayroll",
            align: "center",
            renderCell: ({ inPayroll }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={inPayroll}
                    indeterminate={!inPayroll}
                  />
                }
              />
            ),
          },
        ]}
        data={(holidays || []).filter((h) => {
          try {
            const { name, date } = h;
            const searchTermLower = searchTerm.toLowerCase();
            return (
              name.toLowerCase().includes(searchTermLower) ||
              moment(date)
                .format("MMMM Do")
                .toLowerCase()
                .includes(searchTermLower)
            );
          } catch (error) {
            return false;
          }
        })}
        selectionEnabled
        onSortParamsChange={onSortParamsChange}
        rowActions={[
          {
            label: "Edit Holiday",
            icon: <EditIcon fontSize="small" color="primary" />,
            handler: ({ _id }) => handleEditClick(_id),
          },
          {
            label: "Delete Holiday",
            icon: <DeleteIcon fontSize="small" color="error" />,
            handler: ({ _id }) => handleDeleteClick(_id),
          },
        ]}
      />
    </Box>
  );
};

HolidayList.propTypes = {
  holidays: PropTypes.array,
  holidaysMap: PropTypes.object,
  onAddHoliday: PropTypes.func,
  onUpdateHoliday: PropTypes.func,
  onDeleteHoliday: PropTypes.func,
};

export default HolidayList;
