import React from "react";
import PropTypes from "prop-types";

import { employeeFormFields } from "./data";

import FormikFormFields from "../FormikFormFields";

const EmployeeForm = ({ employee, formFields, submitLabel, ...rest }) => {
  return (
    <FormikFormFields
      formFields={
        Array.isArray(formFields) && formFields.length > 0
          ? formFields
          : employeeFormFields
      }
      initialValues={employee}
      submitActionButtonLabel={submitLabel}
      {...rest}
    />
  );
};

EmployeeForm.propTypes = {
  /**
   * Employee field values
   */
  employee: PropTypes.object(),

  /**
   * A spec of the form fields
   */
  formFields: PropTypes.array,

  /**
   * Form submission handler
   */
  onSubmit: PropTypes.func,

  /**
   * Form cancellation handler
   */
  onCancel: PropTypes.func,

  /**
   * Label for submit button
   */
  submitLabel: PropTypes.string,
};

export default EmployeeForm;
