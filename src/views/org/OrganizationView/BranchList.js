import React from "react";
import PropTypes from "prop-types";

import * as Yup from "yup";

import { useSnackbar } from "notistack";

import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  Divider,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  AddOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@material-ui/icons";

import API from "../../../api";

import useAuth from "../../../providers/auth";
import useNotificationSnackbar from "../../../providers/notification-snackbar";

import FormikFormFields from "../../../components/common/FormikFormFields";
import TableComponent from "../../../components/TableComponent";

const branchFormFields = [
  {
    label: "Name",
    name: "branch",
    required: true,
    validation: Yup.string().required("'Branch name' is required"),
    GridProps: { sm: 12, md: 4 },
  },
  {
    label: "Phone",
    name: "phone",

    // required: true,
    // validation: Yup.string().required("'Phone' is required"),
    GridProps: { sm: 12, md: 4 },
  },
  { label: "Address", name: "address", GridProps: { sm: 12, md: 4 } },
];

const BranchFormDialog = ({
  open,
  onClose,
  branch,
  onCreateBranch,
  onEditBranch,
}) => {
  const dialogTitle = branch ? "Edit branch" : "Create new branch";
  const submitFormLabel = branch ? "Update" : "Create";
  const handleSubmit = (values) =>
    branch ? onEditBranch(branch._id, values) : onCreateBranch(values);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box>
          <Typography variant="h4" align="center" gutterBottom>
            {dialogTitle}
          </Typography>
        </Box>
        <Divider />
        <FormikFormFields
          submitActionButtonLabel={submitFormLabel}
          initialValues={branch}
          formFields={branchFormFields}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

// const TransferBranch = ({ branches, employees }) => {};

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {},
  textField: {
    width: "35ch",
    background: theme.palette.background.paper,
  },
}));
const BranchList = () => {
  const classes = useStyles();
  const { auth } = useAuth();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { notificationSnackbar } = useNotificationSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  const [branches, setBranches] = React.useState([]);

  const fetchOrganizations = React.useCallback(async () => {
    try {
      const { success, orgs, error } = await API.orgs.getAll({
        query: { createdBy: auth && auth.user && auth.user.email },
      });
      if (success) {
        if (Array.isArray(orgs) && orgs.length > 0) {
          setBranches(orgs);
        }
      } else {
        console.warn(error);
      }
    } catch (e) {
      console.warn(e.message);
    }
  }, [auth]);

  React.useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const [selectedBranch, setSelectedBranch] = React.useState(null);

  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const handleDialogOpen = () => setFormDialogOpen(true);
  const handleDialogClose = () => setFormDialogOpen(false);

  const handleCreateClick = (e) => {
    // setSelectedBranch({
    //   name: branches.length > 0 ? branches[0].name : "Main",
    // });
    handleDialogOpen();
  };
  const handleCreateBranch = async (branchInfo) => {
    try {
      const { success, org, error } = await API.orgs.create({
        ...branchInfo,
        name: branches.length > 0 ? branches[0].name : "Main",
        branch: branchInfo.branch || "Branch No. " + branches.length,
        createdBy: auth.user && auth.user.email,
      });
      if (success) {
        org && org !== undefined && setBranches([...branches, org]);
        notify({ success, message: "New branch created successfully!" });
        handleDialogClose();
      } else {
        console.warn(error);
        notify({ success, error: error || "Failed to create new branch." });
      }
    } catch (e) {
      console.warn(e.message);
      notify({
        success: false,
        error: e.message || "Failed to create new branch.",
      });
    }
  };

  const handleEditClick = async (_id) => {
    const b = branches.filter((b) => b._id === _id);
    b.length > 0 && setSelectedBranch(b[0]);
    handleDialogOpen();
  };
  const handleEditBranch = async (branchId, branchUpdate) => {
    try {
      const { success, org, error } = await API.orgs.editById(branchId, {
        ...branchUpdate,
        createdBy: auth && auth.user && auth.user.email,
        updatedBy: auth && auth.user && auth.user.email,
      });
      if (success) {
        org && org !== undefined && setBranches([...branches, org]);
        notify({
          success,
          error: error || "Branch profile updated successfully.",
        });
        handleDialogClose();
      } else {
        console.warn(error);
        notify({ success, error: error || "Failed to update branch profile." });
      }
    } catch (e) {
      console.warn(e.message);
      notify({
        success: false,
        error: e.message || "Failed to update branch profile.",
      });
    }
  };

  const handleDeleteClick = async (_id) => {
    const b = branches.filter((b) => b._id === _id);
    if (
      b.length > 0 &&
      String(b[0].branch)
        .toLowerCase()
        .includes("main" || "head")
    ) {
      notify({ success: false, message: "You can not delete main branch." });
      return;
    }
    // b.length > 0 && setSelectedBranch(b[0]);
    await handleDeleteBranch(_id);
  };
  const handleDeleteBranch = async (branchId) => {
    try {
      const { success, error } = await API.orgs.deleteById(branchId);
      if (success) {
        notify({
          success,
          error: error || "Branch profile deleted.",
        });
      } else {
        console.warn(error);
        notify({ success, error: error || "Failed to delete branch profile." });
      }
    } catch (e) {
      console.warn(e.message);
      notify({
        success: false,
        error: e.message || "Failed to delete branch profile.",
      });
    }
  };

  return (
    <div>
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <div>
          <TextField
            className={classes.textField}
            name="q"
            onChange={(e) => {}}
            placeholder="Search branches"
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
            Create Branch
          </Button>
        </ButtonGroup>
        <BranchFormDialog
          open={formDialogOpen}
          onClose={handleDialogClose}
          branch={selectedBranch}
          onCreateBranch={handleCreateBranch}
          onEditBranch={handleEditBranch}
        />
      </Box>

      <TableComponent
        size="small"
        columns={[
          {
            label: "Branch",
            field: "branch",
            renderCell: ({ branch = "Main" }) => branch,
          },
          { label: "Phone", field: "phone" },
          { label: "Email", field: "email" },
          { label: "Location", field: "address" },
        ]}
        data={branches}
        rowActions={[
          {
            icon: <EditIcon />,
            label: "Edit branch",
            handler: ({ _id }) => handleEditClick(_id),
          },

          {
            icon: <DeleteIcon />,
            label: "Delete branch",
            handler: ({ _id }) => handleDeleteClick(_id),
            hide:
              branches.length === 0 ||
              branches.length === 1 ||
              branches[0].branch === undefined ||
              String(branches[0].branch).toLowerCase() === "main",
          },
        ]}
      />
    </div>
  );
};

BranchList.propTypes = {
  branches: PropTypes.array,
  onCreateBranch: PropTypes.func,
};

export default BranchList;
