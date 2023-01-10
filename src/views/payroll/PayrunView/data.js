export const employeeHours = [
  { employeeId: 1, standard: 250, leave: 30, holiday: 60 },
  { employeeId: 2, standard: 220, leave: 60, holiday: 60 },
  { employeeId: 3, standard: 197, leave: 90, holiday: 60 },
];

const payrunInfo = [
  {
    from: "01-10-2020",
    to: "28-10-2020",
    period: "November 2020",
    payDate: "29-04-2020",
    frequency: "Monthly",
    paystubs: [
      {
        employeeId: 1,
        paygrade: "C",
        position: "Engineer",
        standardHours: 240,
        leaveHours: 13,
        holidayHours: 7,
        totalHours: 360,
        hourlyRate: 10,
        dailyRate: 240,
        taxRate: 0.25,
        pensionRate: 0.07,
        allowance: 1500,
        earningsTotal: 6000,
        deductionsTotal: 1700,
        net: 4300,
      },
    ],
    totalPaymentAmount: 4300,
  },
];

// eslint-disable-next-line import/no-anonymous-default-export
export default { employeeHours, payrunInfo };
