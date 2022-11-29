/*
No-SQL style data-model
employee collection 
{
   id: 1,
    name: "Abraham Gebrekidan",
    firstName: "Abraham",
    lastName: "Gebrekidan",
    avatar: "",

    department: "",
    designation: "",
    payGrade: "",
    allowance: {
      totalAllocated: 100,
      totalUsed: 0,
      used: {
        sick: 10,
      },
      totalRemaining: 0,
      remaining: {
        sick: 10,
      },
    },
    attendance: {
      "09-11-2017": { entryTime: 0, outTime: 0, workedHours: 0 },
      "10-11-2017": { entryTime: 0, outTime: 0, workedHours: 0 },
    },
    leaves: [
      {
        type: "",
        from: "",
        to: "",
        duration: 0,
        status: "",
        createdOn: "",
        requestedOn: "",
        approvedOn: "",
      },
      {
        type: "",
        from: "",
        to: "",
        duration: 0,
        approvedBy: "",
        status: "",
        createdOn: "",
        requestedOn: "",
        approvedOn: "",
      },
    ],
    payslips: {
      "11/20/2020 to 01/20/2021": {},
      "11/20/2020 to 01/20/2021": {},
    },
    documents: {
      "name+upload_date": {},
    },
}
*/
export const orgs = [
  {
    name: "",
    logo: "",
    created: "",
    brief: "",
    departments: {},
    designations: {},
    leaveTypes: {},
    attendance: {
      entryTime: "",
      outTime: "",
      numberOfWorkDays: "",
    },
  },
];

const employeeList = {
  1: {
    id: "1",
    name: "Abraham Gebrekidan",
    firstName: "Abraham",
    lastName: "Gebrekidan",
    avatar: "",
  },
  2: {
    id: "2",
    name: "Anteneh Tesfaye",
    firstName: "Anteneh",
    lastName: "Tesfaye",
    avatar: "",
  },
};

export const allowances = [
  {
    employeeId: 1,
    totalAllocated: 197,
    allocated: {
      annual: 14,
      sick: 6 * 30,
      special: 3,
    },
    totalUsed: 50,
    used: {
      annual: 5,
      sick: 45,
      special: 0,
    },
    totalRemaining: 147,
    remaining: {
      annual: 9,
      sick: 135,
      special: 3,
    },
  },
  {
    employeeId: 2,
    totalAllocated: 198,
    allocated: {
      annual: 15,
      sick: 6 * 30,
      special: 3,
    },
    totalUsed: 10,
    used: {
      annual: 10,
      sick: 0,
      special: 0,
    },
    totalRemaining: 188,
    remaining: {
      annual: 5,
      sick: 6 * 30,
      special: 3,
    },
  },
];

export const leaves = [
  {
    _id: 1,
    employeeId: 1,
    leaveType: "sick",
    from: "01-10-2020",
    to: "01-10-2020",
    duration: 0.5,
    status: "pending",
    createdOn: "01-10-2020",
  },
  {
    _id: 2,
    employeeId: 1,
    leaveType: "annual",
    from: "11-10-2020",
    to: "21-10-2020",
    duration: 10,
    status: "pending",
    createdOn: "09-10-2020",
  },
];

export const employees = {
  getEmployee: (id) => employeeList[id],
  ids: Object.keys(employeeList),
};
