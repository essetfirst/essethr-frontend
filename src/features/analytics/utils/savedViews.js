import { analyticsApi } from "features/platform/api";

const SAVED_VIEWS_KEY = "essethr_analytics_saved_views";

function loadLocalViews() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_VIEWS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalView(name, filters) {
  const views = loadLocalViews().filter((v) => v.name !== name);
  views.unshift({ name, filters, savedAt: new Date().toISOString() });
  localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(views.slice(0, 10)));
  return views;
}

function deleteLocalView(name) {
  const views = loadLocalViews().filter((v) => v.name !== name);
  localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(views));
  return views;
}

export async function loadSavedViews() {
  try {
    const res = await analyticsApi.listViews();
    if (res?.success) return res.views || [];
  } catch {
    /* fall back to local cache */
  }
  return loadLocalViews();
}

export async function saveView(name, filters) {
  try {
    const res = await analyticsApi.saveView({ name, filters });
    if (res?.success) return res.views || [];
  } catch {
    /* fall back to local cache */
  }
  return saveLocalView(name, filters);
}

export async function deleteSavedView(name) {
  try {
    const res = await analyticsApi.deleteView(name);
    if (res?.success) return res.views || [];
  } catch {
    /* fall back to local cache */
  }
  return deleteLocalView(name);
}

export function exportAnalyticsCsv(analytics, intelligence) {
  const rows = [
    ["Metric", "Value"],
    ["Total employees", analytics?.workforce?.total ?? ""],
    ["Active", analytics?.workforce?.active ?? ""],
    ["Inactive", analytics?.workforce?.inactive ?? ""],
    ["Turnover rate", analytics?.turnoverRate ?? ""],
    ["Pending leaves", analytics?.leaves?.pending ?? ""],
    ["Open jobs", analytics?.recruitment?.openJobs ?? ""],
    ["Today attendance", analytics?.attendance?.todayCount ?? ""],
    ["Attrition risk", intelligence?.attritionRisk ?? ""],
  ];
  Object.entries(analytics?.workforce?.byDepartment || {}).forEach(([dept, count]) => {
    rows.push([`Dept: ${dept}`, count]);
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
