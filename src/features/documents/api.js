import { getRequest, deleteRequest, postRequestFileUpload, apiURL } from "api/request";

const path = "/documents";

function list(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null && v !== ""),
  ).toString();
  return getRequest(`${path}${query ? `?${query}` : ""}`);
}

function upload(formData) {
  return postRequestFileUpload(path, formData);
}

function downloadUrl(id) {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const org = localStorage.getItem("org");
  let url = `${apiURL}/documents/${id}/download`;
  if (auth.token) url += `?token=${auth.token}`;
  return url;
}

function remove(id) {
  return deleteRequest(`${path}/${id}`);
}

export default { list, upload, downloadUrl, remove };
