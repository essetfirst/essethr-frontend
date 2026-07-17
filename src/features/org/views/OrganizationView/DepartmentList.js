import React from "react";
import PropTypes from "prop-types";

import clsx from "clsx";
import { Box, InputAdornment, ButtonGroup, Button, TextField, Dialog, DialogContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@mui/icons-material";
import TableComponent from "components/TableComponent";
import DepartmentForm from "./DepartmentForm";

const StyledRoot = styled(Box)({
  padding: 0,
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "35ch",
  background: theme.palette.background.paper,
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  backdropFilter: "blur(5px)",
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
    <StyledRoot className={clsx(className)}>
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <StyledTextField
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
      </Box>
      <StyledDialog open={formDialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <DepartmentForm
            departmentId={selectedId}
            departmentsMap={departmentsMap}
            onCancel={handleDialogClose}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </StyledDialog>
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
    </StyledRoot>
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
