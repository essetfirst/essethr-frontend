import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box } from "@material-ui/core";
import { EditAttributes as EditIcon } from "@material-ui/icons";

import API from "../../../api";
import useOrg from "../../../providers/org";

import PageView from "../../../components/PageView";

import EmployeeForm from "../../../components/employee/EmployeeForm";
import EmployeeFormDialog from "../../../components/employee/EmployeeFormDialog";

const EmployeeEditView = ({ id }) => {
  const { org, updateEmployee } = useOrg();

  const navigate = useNavigate();

  const params = useParams();
  const employeeId = id || params.id;

  const [employee, setEmployee] = React.useState(null);

  const fetchEmployee = async (employeeId) => {
    try {
      const { success, employee, error } = await API.employees.getById(
        employeeId
      );

      if (success) {
        setEmployee(employee);
      } else {
        console.error(error);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  React.useEffect(async () => {
    const foundEmployee = (org.employees || []).find(
      (e) => e._id === employeeId
    );
    if (foundEmployee) {
      setEmployee(foundEmployee);
    } else {
      await fetchEmployee(employeeId);
    }
  }, [employeeId]);

  const handleEditEmployee = async (employeeInfo) => {
    try {
      const { success, error } = await API.employees.editById(
        employeeInfo._id,
        employeeInfo
      );
      if (success) {
        updateEmployee(employeeInfo);
        // Show dialog
        return true;
      } else {
        console.error(error);
        // show dialog
        return false;
      }
    } catch (e) {
      console.error(e.message);
      return false;
    }
  };

  const handleCancel = () => navigate("/app/employees", { replace: true });

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <PageView
      title="Edit employee"
      pageTitle="Edit employee"
      icon={<EditIcon fontSize="small" />}
    >
      <EmployeeFormDialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <p>Loading || Success || Error</p>
        </Box>
      </EmployeeFormDialog>

      <EmployeeForm
        employee={employee}
        submitLabel={"Update"}
        onSubmit={handleEditEmployee}
        onCancel={handleCancel}
      />
    </PageView>
  );
};

export default EmployeeEditView;
