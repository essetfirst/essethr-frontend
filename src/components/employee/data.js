const baseEmployeeFormFields = [
  {
    label: "Employee Id",
    name: "employeeId",
    required: true,
    GridProps: { sm: 12 },
  },
  {
    label: "First name",
    name: "firstName",
    required: true,
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Middle name",
    name: "surName",
    required: true,
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Last name",
    name: "lastName",
    required: true,
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Date of Birth",
    name: "birthDay",
    required: true,
    defaultValue: "2000-01-01",
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Gender",
    name: "gender",
    required: true,
    select: true,
    selectOptions: [
      { value: "Female", label: "Female" },
      { value: "Male", label: "Male" },
    ],
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "National ID",
    name: "nationalID",
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Phone",
    name: "phone",
    required: true,
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Address",
    name: "address",
    required: true,
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Email (Optional)",
    name: "email",
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Department",
    name: "department",
    required: true,
    select: true,
    selectOptions: [],
    GridProps: { sm: 12, md: 6, lg: 6 },
  },
  {
    label: "Job title",
    name: "position",
    required: true,
    select: true,
    selectOptions: [],
    GridProps: { sm: 12, md: 6, lg: 6 },
  },
  {
    label: "Hire date",
    name: "hireDate",
    required: true,
    type: "date",
    GridProps: { sm: 12, md: 6, lg: 6 },
  },
  {
    label: "Work start date",
    name: "startDate",
    required: true,
    type: "date",
    GridProps: { sm: 12, md: 6, lg: 6 },
  },
];

/** Legacy export — use getEmployeeFormFields(org) when org context is available. */
export const employeeFormFields = baseEmployeeFormFields;

export function getEmployeeFormFields(org = {}) {
  return baseEmployeeFormFields.map((field) => {
    if (field.name === "department") {
      return {
        ...field,
        selectOptions: (org.departments || []).map(({ _id, name }) => ({
          label: name,
          value: _id,
        })),
      };
    }
    if (field.name === "position") {
      return {
        ...field,
        selectOptions: (org.positions || []).map(({ _id, title }) => ({
          label: title,
          value: _id,
        })),
      };
    }
    return field;
  });
}

export default employeeFormFields;
