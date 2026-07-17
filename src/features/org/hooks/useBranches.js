import { useCallback, useEffect, useMemo, useState } from "react";
import API from "api";
import useOrg from "features/org/providers";

function toMap(list, key = "_id") {
  return (list || []).reduce((acc, item) => {
    if (item?.[key] != null) acc[item[key]] = item;
    return acc;
  }, {});
}

/**
 * Shared branch context for the active company.
 * Branches are org records linked by `companySlug`; switching branch updates `currentOrg`.
 */
export default function useBranches() {
  const { org, currentOrg, setCurrentOrg } = useOrg();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBranches = useCallback(async () => {
    const orgId = currentOrg || org?._id;
    if (!orgId) return;

    setLoading(true);
    setError(null);
    try {
      const { success, branches: list, error: apiError } =
        await API.orgs.getBranches(orgId);
      if (success) {
        setBranches(Array.isArray(list) ? list : []);
      } else {
        setError(apiError || "Failed to load branches.");
      }
    } catch (e) {
      setError(e.message || "Failed to load branches.");
    } finally {
      setLoading(false);
    }
  }, [currentOrg, org?._id]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const branchesMap = useMemo(() => toMap(branches), [branches]);

  const departmentsByOrg = useMemo(() => {
    const map = {};
    branches.forEach((b) => {
      (b.departments || []).forEach((d) => {
        map[d._id] = { ...d, org: b._id };
      });
    });
    return map;
  }, [branches]);

  const positionsByOrg = useMemo(() => {
    const map = {};
    branches.forEach((b) => {
      (b.positions || []).forEach((p) => {
        map[p._id] = { ...p, org: b._id };
      });
    });
    return map;
  }, [branches]);

  const branchLabel = useCallback(
    (orgId) => {
      const row = branchesMap[orgId];
      if (!row) return "—";
      return row.branch || row.name || "Main";
    },
    [branchesMap]
  );

  const activeBranch = branchesMap[currentOrg || org?._id] || org;
  const companyName = activeBranch?.name || org?.name || "";

  return {
    branches,
    branchesMap,
    departmentsByOrg,
    positionsByOrg,
    branchLabel,
    activeBranch,
    companyName,
    currentOrg,
    setCurrentOrg,
    fetchBranches,
    loading,
    error,
  };
}
