export const leaveFormFields = ({ employeeOptions, leaveTypeOptions }) => [
  {
    label: "Employee Id",
    name: "employeeId",
    required: true,
    defaultValue: -1,
    select: true,
    selectOptions: employeeOptions,
    GridProps: { sm: 12, md: 6 },
  },
  {
    label: "Leave Type",
    name: "leaveType",
    required: true,
    defaultValue: -1,
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
    GridProps: { sm: 12, md: 6 },
  },
  {
    label: "End Date",
    name: "endDate",
    type: "date",
    required: true,
    defaultValue: new Date().toISOString().slice(0, 10),
    GridProps: { sm: 12, md: 6 },
  },
  {
    label: "Comment (Note)",
    name: "comment",
    GridProps: { sm: 12 },
  },
];

export default leaveFormFields;
