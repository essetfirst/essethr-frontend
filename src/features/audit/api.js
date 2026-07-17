import { getRequest } from "api/request";

const auditPath = "/audit-logs";

function getAll(params = {}) {
  const query = new URLSearchParams(params).toString();
  return getRequest(`${auditPath}${query ? `?${query}` : ""}`);
}

export default { getAll };
