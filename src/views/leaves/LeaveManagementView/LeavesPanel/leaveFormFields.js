import * as Yup from "yup";

export const leaveFormFields = ({ employeeOptions, leaveTypeOptions }) => [
  {
    label: "Employee Id",
    name: "employeeId",
    required: true,
    defaultValue: -1,
    validation: Yup.string()
      .oneOf(
        employeeOptions
          .filter((lt) => lt.value !== -1)
          .map(({ value }) => value, "Choose employee")
      )
      // .notOneOf([-1], "Chooe employee")
      .required("Choose employee"),
    select: true,
    selectOptions: employeeOptions,
    GridProps: { sm: 12, md: 6 },
  },

  {
    label: "Leave Type",
    name: "leaveType",
    required: true,
    defaultValue: -1,
    validation: Yup.string()
      .oneOf(
        leaveTypeOptions
          .filter((lt) => lt.value !== -1)
          .map(({ value }) => value),
        "Choose a leave type"
      )
      // .notOneOf([0], "Choose a leave type")
      .required("Choose a valid leave type"),
    select: true,
    selectOptions: leaveTypeOptions,
    GridProps: { sm: 12, md: 6 },
  },
  {
    label: "Start Date",
    name: "startDate",
    type: "date",
    required: true,
    defaultValue: new Date().toISOString().slice(0, 10),
    validation: Yup.date("Provide a start date")
      .min(
        new Date().toISOString().slice(0, 10),
        "Date from past is not allowed"
      )
      .required("Specify start date of leave"),
    GridProps: { sm: 12, md: 6 },
  },
  {
    label: "End Date",
    name: "endDate",
    type: "date",
    required: true,
    defaultValue: new Date().toISOString().slice(0, 10),
    validation: Yup.date("Provide an end date").required(
      "Specify end date of leave"
    ),
    GridProps: { sm: 12, md: 6 },
  },
  {
    label: "Comment (Note)",
    name: "comment",
    validation: Yup.string(),
    GridProps: { sm: 12 },
  },
];
