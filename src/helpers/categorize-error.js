export default function categorizeError(e) {
  return String(e).startsWith("Failed to fetch") ||
    String(e).includes("SyntaxError: JSON.parse") ||
    String(e).includes("NetworkError") ||
    String(e).startsWith("Unexpected token")
    ? "Something went wrong. Check your internet connection!"
    : e.message;
}

// class PayrollDAO {
// 	static async getPayrollHours({ employees, from, to }) {
// 		try {
// 			const attendanceByEmployee = {};
// 			const leavesByEmployee = {};
// 			const holidaysByDate = {};

// 			Object.keys(attendanceByEmployee).map((eId) => {
// 				let regularHours = 0;
// 				let leaveHours = 0;
// 				let overtimeHours = 0;
// 				let commissionDates = [];

// 				let d = from;
// 				for (
// 					let d = from;
// 					d <= to;
// 					d = new Date(new Date(d).getTime() + 24 * 3600000)
// 				) {
// 					const { workedHours } = attendanceByEmployee[eId][d];
// 					if (
// 						holidaysByDate[d] &&
// 						(workedHours > 7 || leavesByEmployee[eId].includes(d))
// 					) {
// 						overtimeHours += workedHours;
// 					} else {
// 						regularHours += workedHours;
// 						leaveHours += leavesByEmployee[eId].includes(d)
// 							? 10
// 							: 0;
// 					}

// 					regularHours += attendanceByEmployee[eId][d].workedHours;
// 				}
// 			});

// 			return [
// 				{
// 					employeeId,
// 					fromDate,
// 					toDate,
// 					regular,
// 					overtime,
// 					leave,
// 					status,
// 				},
// 			];
// 		} catch (e) {
// 			return { error: e, server: true };
// 		}
// 	}
// }
