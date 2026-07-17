/** Display metadata for system roles (counts only — full list comes from backend on login). */
export const SYSTEM_ROLES = [
  { key: "ADMIN", name: "Administrator", description: "Full organization access", permissionCount: 44 },
  { key: "HR_MANAGER", name: "HR Manager", description: "HR operations and reports", permissionCount: 39 },
  { key: "SUPERVISOR", name: "Supervisor", description: "Team approvals and read access", permissionCount: 11 },
  { key: "EMPLOYEE", name: "Employee", description: "Self-service only", permissionCount: 10 },
];
