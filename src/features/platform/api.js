import { getRequest, postRequest, putRequest, deleteRequest, patchRequest } from "api/request";

const p = (path, params) => {
  const q = params ? `?${new URLSearchParams(params)}` : "";
  return getRequest(`${path}${q}`);
};

export const essApi = {
  me: () => getRequest("ess/me"),
  payslips: () => getRequest("ess/payslips"),
  attendance: (params) => p("ess/attendance", params),
  leaves: () => getRequest("ess/leaves"),
  announcements: () => getRequest("ess/announcements"),
  approvals: () => getRequest("ess/approvals"),
  activity: () => getRequest("ess/activity"),
  documents: () => getRequest("ess/documents"),
  onboarding: () => getRequest("ess/onboarding"),
};

export const announcementsApi = {
  list: () => getRequest("announcements"),
  create: (data) => postRequest("announcements", data),
  update: (id, data) => putRequest(`announcements/${id}`, data),
  remove: (id) => deleteRequest(`announcements/${id}`),
};

export const shiftsApi = {
  templates: () => getRequest("shifts/templates"),
  createTemplate: (data) => postRequest("shifts/templates", data),
  assignments: (params) => p("shifts/assignments", params),
  assign: (data) => postRequest("shifts/assignments", data),
  removeAssignment: (id) => deleteRequest(`shifts/assignments/${id}`),
};

export const workflowsApi = {
  templates: () => getRequest("workflows/templates"),
  createTemplate: (data) => postRequest("workflows/templates", data),
  requests: (params) => p("workflows/requests", params),
  submit: (data) => postRequest("workflows/requests", data),
  approve: (id, data) => postRequest(`workflows/requests/${id}/approve`, data),
  reject: (id, data) => postRequest(`workflows/requests/${id}/reject`, data),
};

export const recruitmentApi = {
  jobs: () => getRequest("recruitment/jobs"),
  createJob: (data) => postRequest("recruitment/jobs", data),
  candidates: (params) => p("recruitment/candidates", params),
  createCandidate: (data) => postRequest("recruitment/candidates", data),
  updateStage: (id, data) => putRequest(`recruitment/candidates/${id}/stage`, data),
  updateCandidate: (id, data) => putRequest(`recruitment/candidates/${id}`, data),
  hire: (id, data) => postRequest(`recruitment/candidates/${id}/hire`, data || {}),
};

export const onboardingApi = {
  templates: () => getRequest("onboarding/templates"),
  createTemplate: (data) => postRequest("onboarding/templates", data),
  instances: (params) => p("onboarding/instances", params),
  start: (data) => postRequest("onboarding/instances", data),
  completeTask: (id, taskId) => postRequest(`onboarding/instances/${id}/tasks/${taskId}/complete`),
};

export const offboardingApi = {
  templates: () => getRequest("offboarding/templates"),
  createTemplate: (data) => postRequest("offboarding/templates", data),
  instances: (params) => p("offboarding/instances", params),
  start: (data) => postRequest("offboarding/instances", data),
  completeTask: (id, taskId) => postRequest(`offboarding/instances/${id}/tasks/${taskId}/complete`),
};

export const reportsApi = {
  schedules: () => getRequest("reports/schedules"),
  createSchedule: (data) => postRequest("reports/schedules", data),
  toggleSchedule: (id, active) => patchRequest(`reports/schedules/${id}`, { active }),
  removeSchedule: (id) => deleteRequest(`reports/schedules/${id}`),
};

export const benefitsApi = {
  list: () => getRequest("benefits"),
  create: (data) => postRequest("benefits", data),
};

export const expensesApi = {
  list: (params) => p("expenses", params),
  create: (data) => postRequest("expenses", data),
  updateStatus: (id, status) => patchRequest(`expenses/${id}/status`, { status }),
};

export const performanceApi = {
  goals: (params) => p("performance/goals", params),
  createGoal: (data) => postRequest("performance/goals", data),
  updateGoal: (id, data) => putRequest(`performance/goals/${id}`, data),
  reviews: (params) => p("performance/reviews", params),
  createReview: (data) => postRequest("performance/reviews", data),
  updateReview: (id, data) => putRequest(`performance/reviews/${id}`, data),
  submitReview: (id, data) => postRequest(`performance/reviews/${id}/submit`, data),
  completeReview: (id, data) => postRequest(`performance/reviews/${id}/complete`, data),
};

export const trainingApi = {
  courses: () => getRequest("training/courses"),
  createCourse: (data) => postRequest("training/courses", data),
  records: (params) => p("training/records", params),
  assign: (data) => postRequest("training/records", data),
  updateProgress: (id, data) => putRequest(`training/records/${id}/progress`, data),
};

export const analyticsApi = {
  dashboard: () => getRequest("analytics/dashboard"),
  intelligence: () => getRequest("analytics/intelligence"),
  operations: () => getRequest("analytics/operations"),
  listViews: () => getRequest("analytics/views"),
  saveView: (data) => postRequest("analytics/views", data),
  deleteView: (name) => deleteRequest(`analytics/views/${encodeURIComponent(name)}`),
};

export const searchApi = {
  global: (q) => p("search", { q }),
};

export const inboxApi = {
  workQueue: () => getRequest("inbox/work-queue"),
};

export const notificationsApi = {
  inbox: () => getRequest("notifications/inbox"),
  markRead: (id) => patchRequest(`notifications/${id}/read`, {}),
  markAllRead: () => postRequest("notifications/read-all", {}),
  testEmail: (email) => postRequest("notifications/test-email", email ? { email } : {}),
};

export const payrollApiExt = {
  lock: (id) => postRequest(`payrolls/${id}/lock`),
  finalize: (id) => postRequest(`payrolls/${id}/finalize`),
  addAdjustment: (id, data) => postRequest(`payrolls/${id}/adjustments`, data),
  validate: (id) => getRequest(`payrolls/${id}/validate`),
  comparison: (id) => getRequest(`payrolls/${id}/comparison`),
};
