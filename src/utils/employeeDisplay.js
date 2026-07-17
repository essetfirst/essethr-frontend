/** Format employee display name from common record shapes. */
export function formatEmployeeName(employee) {
  if (!employee) return "Unknown";
  if (employee.name) return employee.name;
  const parts = [employee.firstName, employee.surName || employee.lastName].filter(Boolean);
  return parts.join(" ").trim() || "Unknown";
}

/** Resolve employee id → name using a map keyed by _id string. */
export function employeeNameFromMap(employeesMap, employeeId) {
  if (!employeeId) return "—";
  const emp = employeesMap?.[String(employeeId)];
  return formatEmployeeName(emp) || "Unknown";
}

/** Resolve department id → label using org departments map. */
export function departmentNameFromMap(departmentsMap, departmentId) {
  if (!departmentId) return "Unassigned";
  const dept = departmentsMap?.[String(departmentId)];
  if (dept?.name) return dept.name;
  if (/^[a-f0-9]{24}$/i.test(String(departmentId))) return "Unassigned";
  return String(departmentId);
}

/** Leave type label (DB uses `title` or `name`). */
export function leaveTypeLabel(leaveType, leaveTypeMap = {}) {
  if (!leaveType) return "—";
  const mapped = leaveTypeMap[String(leaveType)];
  if (mapped) return mapped.title || mapped.name || mapped.label;
  if (typeof leaveType === "string" && !/^[a-f0-9]{24}$/i.test(leaveType)) {
    return leaveType;
  }
  return "Leave";
}
