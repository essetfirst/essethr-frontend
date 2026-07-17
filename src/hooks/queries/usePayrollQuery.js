import { useQuery } from "@tanstack/react-query";
import API from "api";
import useAuth from "features/auth/providers";
import useOrg from "features/org/providers";

export const payrollsQueryKey = (orgId) => ["payrolls", orgId];

export function usePayrollsQuery() {
  const { auth } = useAuth();
  const { currentOrg, org } = useOrg();
  const orgId = currentOrg || org?._id;

  return useQuery({
    queryKey: payrollsQueryKey(orgId),
    queryFn: async () => {
      const res = await API.payroll.getAll({ query: { org: orgId } });
      if (!res?.success) throw new Error(res?.error || "Failed to load payrolls");
      return res.payrolls ?? res.data ?? [];
    },
    enabled: Boolean(auth?.isAuth && orgId),
    staleTime: 60_000,
  });
}
