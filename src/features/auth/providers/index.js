import { useContext } from "react";

import Context from "./Context";

export { default as withAuth } from "./with";
export { default as Provider } from "./Provider";

export default function useAuth() {
  const ctx = useContext(Context);
  return (
    ctx ?? {
      auth: { isAuth: false, loading: false, bootstrapping: false },
      login: () => {},
      logout: () => {},
      bootstrapping: false,
    }
  );
}
