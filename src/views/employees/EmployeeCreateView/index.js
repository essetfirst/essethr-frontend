import React from "react";
import { useNavigate } from "react-router-dom";

import PageView from "../../../components/PageView";
import EmployeeForm from "./Form";

const EmployeeCreateView = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/app/employees", { replace: true });
  };

  return (
    <PageView title="New employee" pageTitle="Create new employee">
      <EmployeeForm submitLabel="Create" onCancel={handleCancel} />
    </PageView>
  );
};

export default EmployeeCreateView;
