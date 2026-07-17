import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "api";
import useAuth from "features/auth/providers";

export const orgQueryKey = (orgId) => ["org", orgId];

export function useOrgQuery(orgId) {
  const { auth } = useAuth();
  const enabled = Boolean(auth?.isAuth && orgId);

  return useQuery({
    queryKey: orgQueryKey(orgId),
    queryFn: async () => {
      const res = await API.orgs.getById(orgId);
      if (!res?.success) throw new Error(res?.error || "Failed to load organization");
      return res.org;
    },
    enabled,
    staleTime: 60_000,
  });
}

export function useOrgQueryClient() {
  const qc = useQueryClient();
  return {
    invalidateOrg: (orgId) => qc.invalidateQueries({ queryKey: orgQueryKey(orgId) }),
    setOrgCache: (orgId, org) => qc.setQueryData(orgQueryKey(orgId), org),
  };
}
