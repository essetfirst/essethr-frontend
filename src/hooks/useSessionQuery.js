import { useQuery } from "@tanstack/react-query";
import API from "api";

/** TanStack Query bridge — validates session via /auth/me without Context churn. */
export default function useSessionQuery({ enabled = true } = {}) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => API.auth.me({ skipAuthRedirect: true }),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
