import { getRequest, putRequest } from "api/request";

function get(orgId) {
  return getRequest(`orgs/${orgId}/settings`);
}

function update(orgId, payload) {
  return putRequest(`orgs/${orgId}/settings`, payload);
}

export default { get, update };
