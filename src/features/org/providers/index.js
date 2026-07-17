import { useContext } from "react";

import Context from "./Context";

export { default as Provider } from "./Provider";

export default function useOrg() {
  const ctx = useContext(Context);
  return ctx ?? { org: null, currentOrg: null, state: {}, fetchOrg: () => {} };
}
