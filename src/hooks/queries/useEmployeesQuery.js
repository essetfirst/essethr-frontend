import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "api";
import useAuth from "features/auth/providers";
import useOrg from "features/org/providers";

export const employeesQueryKey = (orgId, params = {}) => ["employees", orgId, params];

export function useEmployeesQuery(params = {}) {
  const { auth } = useAuth();
  const { currentOrg, org } = useOrg();
  const orgId = currentOrg || org?._id;

  return useQuery({
    queryKey: employeesQueryKey(orgId, params),
    queryFn: async () => {
      const res = await API.employees.getAll({ query: { ...params, org: orgId } });
      if (!res?.success) throw new Error(res?.error || "Failed to load employees");
      return {
        employees: res.data ?? res.employees ?? [],
        pagination: res.pagination ?? null,
      };
    },
    enabled: Boolean(auth?.isAuth && orgId),
    staleTime: 30_000,
  });
}

export function useEmployeesQueryClient() {
  const qc = useQueryClient();
  return {
    invalidateEmployees: (orgId) =>
      qc.invalidateQueries({ queryKey: ["employees", orgId] }),
  };
}
