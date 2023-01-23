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
  Typography,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@material-ui/icons";
import TableComponent from "../../../components/TableComponent";
import DepartmentForm from "./DepartmentForm";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  textField: {
    width: "35ch",
    background: theme.palette.background.paper,
  },
  dialog: {
    backdropFilter: "blur(5px)",
  },
}));

const DepartmentList = ({
  className,
  departments,
  onSortParamsChange,
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
    onDeleteDepartment(_id);
  };

  const handleFormSubmit = (departmentInfo) => {
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
            startIcon={<AddCircleIcon />}
          >
            Create
          </Button>
        </ButtonGroup>
        <Dialog
          open={formDialogOpen}
          onClose={handleDialogClose}
          className={classes.dialog}
        >
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
          {
            field: "parent",
            label: "Parent",
            renderCell: ({ parent }) => {
              const { name } = departmentsMap[parent] || {};
              const names = `${name || "N/A"}`;
              return <Typography variant="body2">{names}</Typography>;
            },
          },
        ]}
        // eslint-disable-next-line array-callback-return
        data={(departments || []).filter((d) => {
          try {
            const { name, location } = d;
            const names = `${name || ""} ${location || ""}`;
            return names.toLowerCase().includes(searchTerm.toLowerCase());
          } catch (error) {
          }
        })}
        selectionEnabled
        onSortParamsChange={onSortParamsChange}
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
