import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "api";
import useOrg from "features/org/providers";

export function leavesQueryKey(orgId) {
  return ["leaves", orgId];
}

export function useLeavesQuery() {
  const { currentOrg } = useOrg();

  const query = useQuery({
    queryKey: leavesQueryKey(currentOrg),
    queryFn: async () => {
      const res = await API.leaves.getAll({ query: {} });
      if (!res?.success) throw new Error(res?.error || "Failed to load leaves");
      return res.leaves || res.data || [];
    },
    enabled: Boolean(currentOrg),
    staleTime: 30_000,
  });

  return {
    ...query,
    leaves: query.data || [],
    fetchLeaves: query.refetch,
  };
}

export function useInvalidateLeaves() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["leaves"] });
}
