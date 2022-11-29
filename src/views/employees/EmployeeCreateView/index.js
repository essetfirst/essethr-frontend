import React from "react";
import { useNavigate } from "react-router-dom";

import PageView from "../../../components/PageView";

import EmployeeForm from "./Form";

const EmployeeCreateView = () => {
  const navigate = useNavigate();

  // Need positionsMap
  // Need employeesMap
  // Need departmentsMap
  // Need to handle create with out prior positions ||  departments by creating then (input instead of select)
  // Need to show some success dialog if created well
  
  const handleCreateEmployee = (employeeInfo) => {
    return API.employees
      .create(employeeInfo)
      .then(({ success, employee, error }) => {
        if (success) {
          addEmployee(employee);
          // Notify the user somehow
          return true;
        } else {
          console.error(error);
          return false;
        }
      })
      .catch((e) => {
        console.error(e.message);
        return false;
      });
  };

  const handleCancel = () => {
    navigate("/app/employees", { replace: true });
  };

  return (
    <PageView title="New employee" pageTitle="Create new employee">
      <EmployeeForm
        submitLabel="Create"
        onSubmit={handleCreateEmployee}
        onCancel={handleCancel}
      />
    </PageView>
  );
};

export default EmployeeCreateView;
