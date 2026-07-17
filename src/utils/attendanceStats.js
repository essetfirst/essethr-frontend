/** Group flat attendance rows by date for dashboard charts. */
export default function groupAttendanceByDate(records) {
  if (!Array.isArray(records)) return {};
  return records.reduce((acc, row) => {
    if (!row?.date) return acc;
    const key = String(row.date).slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
}

/** Normalize backend remark values for charts (on_time → present). */
export function normalizeRemark(remark) {
  const value = String(remark || "").toLowerCase();
  if (value === "on_time" || value === "ontime" || value === "present") return "present";
  if (value === "late") return "late";
  if (value === "absent") return "absent";
  return value;
}

export function countByRemark(records, targetRemark) {
  const list = Array.isArray(records) ? records : [];
  return list.filter((item) => normalizeRemark(item?.remark) === targetRemark).length;
}
