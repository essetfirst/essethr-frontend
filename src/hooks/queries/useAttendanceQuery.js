import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "api";
import useOrg from "features/org/providers";
import groupAttendanceByDate from "utils/attendanceStats";
import getWeekDates from "helpers/get-week-dates";

const getDateString = (date) =>
  new Date(date || new Date()).toISOString().slice(0, 10);

export function attendanceQueryKey(orgId, from, to) {
  return ["attendance", orgId, from, to];
}

export function useAttendanceQuery({ fromDate, toDate, attendanceDate } = {}) {
  const { currentOrg } = useOrg();
  const weekDates = getWeekDates(attendanceDate || new Date());
  const from = fromDate || getDateString(weekDates[0]);
  const to = toDate || getDateString(weekDates[weekDates.length - 1]);

  const query = useQuery({
    queryKey: attendanceQueryKey(currentOrg, from, to),
    queryFn: async () => {
      const res = await API.attendance.getAttendance({ from, to });
      if (!res?.success) throw new Error(res?.error || "Failed to load attendance");
      const payload = res.attendance;
      if (Array.isArray(payload)) return groupAttendanceByDate(payload);
      return payload || {};
    },
    enabled: Boolean(currentOrg),
    staleTime: 30_000,
  });

  return {
    ...query,
    attendanceByDate: query.data || {},
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
}

export function useInvalidateAttendance() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["attendance"] });
}
