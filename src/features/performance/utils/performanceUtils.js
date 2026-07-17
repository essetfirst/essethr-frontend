export function employeeLabel(emp) {
  const name = `${emp?.firstName || ""} ${emp?.surName || emp?.lastName || ""}`.trim();
  if (!emp) return "";
  return emp.employeeId ? `${name} (${emp.employeeId})` : name || String(emp._id);
}

export function buildEmployeeMap(employees) {
  return (employees || []).reduce((acc, emp) => {
    acc[String(emp._id)] = emp;
    return acc;
  }, {});
}

export function resolveEmployeeName(employeeMap, employeeId) {
  const emp = employeeMap[String(employeeId)];
  return emp ? employeeLabel(emp) : employeeId;
}

export function reviewStatusColor(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return "primary";
  if (normalized === "submitted") return "secondary";
  if (normalized === "draft") return "default";
  return "default";
}

export function goalStatusColor(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "active") return "primary";
  if (normalized === "closed") return "default";
  return "default";
}

export const REVIEW_STATUSES = ["draft", "submitted", "completed"];

export function reviewStatusHelp(status) {
  switch (String(status).toLowerCase()) {
    case "draft":
      return "Employee fills in self-review, then submits.";
    case "submitted":
      return "Manager/HR adds feedback and completes the review.";
    case "completed":
      return "Review is finalized.";
    default:
      return "";
  }
}
