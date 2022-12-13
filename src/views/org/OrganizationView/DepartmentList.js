import React from "react";
import PropTypes from "prop-types";

import clsx from "clsx";
import {
  makeStyles,
  Box,
  InputAdornment,
  ButtonGroup,
  Button,
  TextField,
  Dialog,
  DialogContent,
} from "@material-ui/core";

import {
  AddOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@material-ui/icons";
import TableComponent from "../../../components/TableComponent";
import DepartmentForm from "./DepartmentForm";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {},
  textField: {
    width: "35ch",
    background: theme.palette.background.paper,
  },
}));

const DepartmentList = ({
  className,
  departments,
  departmentsMap,
  onCreateDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
}) => {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearchTermChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };
  const [selectedId, setSelectedId] = React.useState("");

  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const handleDialogOpen = () => setFormDialogOpen(true);
  const handleDialogClose = () => {
    setFormDialogOpen(false);
    setSelectedId("");
  };

  const handleCreateClick = () => {
    handleDialogOpen();
  };

  const handleEditClick = (id) => {
    setSelectedId(id);
    handleDialogOpen();
  };

  const handleDeleteClick = (_id) => {
    console.log(_id);
    onDeleteDepartment(_id);
  };

  const handleFormSubmit = (departmentInfo) => {
    console.log("DepartmentId: ", selectedId);
    selectedId
      ? onUpdateDepartment(departmentInfo)
      : onCreateDepartment(departmentInfo);

    handleDialogClose();
  };

  return (
    <div className={clsx(classes.root, className)}>
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <div>
          <TextField
            className={classes.textField}
            name="searchTerm"
            onChange={handleSearchTermChange}
            value={searchTerm}
            placeholder="Search departments"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateClick}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </ButtonGroup>
        <Dialog open={formDialogOpen} onClose={handleDialogClose}>
          <DialogContent>
            <DepartmentForm
              departmentId={selectedId}
              departmentsMap={departmentsMap}
              onCancel={handleDialogClose}
              onSubmit={handleFormSubmit}
            />
          </DialogContent>
        </Dialog>
      </Box>
      <TableComponent
        size="small"
        columns={[
          { field: "name", label: "Name", sortable: true },
          { field: "location", label: "Location" },
          // {
          //   field: "parent",
          //   label: "Parent",
          //   renderCell: ({ parent }) => `${parent || "-"}`,
          // },
        ]}
        data={(departments || []).filter((d) =>
          String(d.name).includes(searchTerm)
        )}
        rowActions={[
          {
            label: "Edit department",
            icon: <EditIcon fontSize="small" color="primary" />,
            handler: ({ _id }) => handleEditClick(_id),
          },
          {
            label: "Delete department",
            icon: <DeleteIcon fontSize="small" color="error" />,
            handler: ({ _id }) => handleDeleteClick(_id),
          },
        ]}
      />
    </div>
  );
};

DepartmentList.propTypes = {
  className: PropTypes.string,
  departments: PropTypes.array,
  departmentMap: PropTypes.object,
  onCreateDepartment: PropTypes.func,
  onUpdateDepartment: PropTypes.func,
  onDeleteDepartment: PropTypes.func,
};

export default DepartmentList;
