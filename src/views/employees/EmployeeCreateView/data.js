import * as Yup from "yup";

export const employeeFormFields = [
  {
    label: "Employee Id",
    name: "employeeId",
    required: true,
    validation: Yup.string().required("Employee id is required"),
    GridProps: { sm: 12 },
  },
  {
    label: "First name",
    name: "firstName",
    required: true,
    validation: Yup.string().required("First name is required"),
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Middle name",
    name: "surName",
    required: true,
    validation: Yup.string().required("Middle name is required"),
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Last name",
    name: "lastName",
    required: true,
    validation: Yup.string().required("Last name is required"),
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Date of Birth",
    name: "birthDay",
    required: true,
    validation: Yup.string()
      .oneOf(["Male", "male", "female", "Female"])
      .required("Gender is required"),
    defaultValue: "2000-01-01",
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "Gender",
    name: "gender",
    required: true,
    validation: Yup.string()
      .oneOf(["Male", "male", "female", "Female"])
      .required("Gender is required"),
    defaultValue: 0,
    select: true,
    selectOptions: [
      { value: 0, label: "Choose" },
      { value: "Female", label: "Female" },
      { value: "Male", label: "Male" },
    ],
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "National ID",
    name: "nationalID",
    type: "text",
    GridProps: { sm: 12, md: 6, lg: 4 },
  },
  {
    label: "E-mail address",
    name: "email",
    type: "email",
    validation: Yup.string().email("Must be a valid email").max(255),
  },
  {
    label: "Base salary",
    name: "salary",
    validation: Yup.number().positive("Enter valid salary figure"),
    defaultValue: 0,
  },
  {
    label: "",
    name: "hireDate",
    required: true,
    validation: Yup.date().required("Hire date is required"),
    defaultValue: new Date().toISOString().slice(0, 10),
  },
];
