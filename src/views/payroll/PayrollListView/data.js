export const employees = {
  1: {
    id: 1,
    name: "Abraham Gebrekidan",
    avatar: "https://picsum.photos/200",
  },
  2: {
    id: 2,
    name: "Anteneh Tesfaye",
    avatar: "https://picsum.photos/300",
  },
  3: {
    id: 3,
    name: "Amanuel Abebe",
    avatar: "https://picsum.photos/400",
  },
  4: {
    id: 4,
    name: "Endalk Hussien",
    avatar: "https://picsum.photos/500",
  },
};

export const getEmployees = () => Object.values(employees);

export const payrolls = {
  1: {
    id: 1,
    type: "monthly",
    title: "Payroll for August 2020",
    from: "01-08-2020",
    to: "31-08-2020",
    payDate: "28-09-2020",
    totalEmployeesPaid: 2,
    totalPaidAmount: 124500,
    status: "approved",
    payslips: [1, 2, 4],
  },
  2: {
    id: 2,
    type: "monthly",
    title: "Payroll for September 2020",
    from: "01-09-2020",
    to: "30-09-2020",
    payDate: "28-09-2020",
    totalEmployeesPaid: 2,
    totalPaidAmount: 124500,
    status: "pending",
    payslips: [3, 4],
  },
};
export const getPayrolls = () => Object.values(payrolls);

export const payslips = {
  1: {
    id: 1,
    payrollId: 1,
    employeeId: 1,
    earnings: {},
    deductions: {},
    earningsTotal: 12667,
    deductionsTotal: 2020,
    netIncome: 12667 - 2020,
  },
  2: {
    id: 2,
    payrollId: 1,
    employeeId: 2,
    earnings: {},
    deductions: {},
    earningsTotal: 13533,
    deductionsTotal: 1250,
    netIncome: 13533 - 1250,
  },
  3: {
    id: 3,
    payrollId: 2,
    employeeId: 1,
    earnings: {},
    deductions: {},
    earningsTotal: 15533,
    deductionsTotal: 250,
    netIncome: 15533 - 250,
  },
  4: {
    id: 4,
    payrollId: 2,
    employeeId: 2,
    earnings: {},
    deductions: {},
    earningsTotal: 14533,
    deductionsTotal: 1150,
    netIncome: 14533 - 1150,
  },
};

export const getEmployee = (id) => employees[id];

export const getPayroll = (id) => payrolls[id];

export const getPayslip = (id) => {
  if (!payslips[id]) {
    return null;
  }
  const { employeeId, payrollId } = payslips[id];
  const { type, from, to, payDate } = payrolls[payrollId];
  const { name, avatar } = employees[employeeId];
  return { name, avatar, type, from, to, payDate, ...payslips[id] };
};
export const getPayrollSlips = (id) =>
  payrolls[id] ? payrolls[id].payslips.map(getPayslip) : [];
