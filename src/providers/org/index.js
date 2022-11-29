import { useContext } from "react";

import Context from "./Context";

export { default as Provider } from "./Provider";

export default function useOrg() {
  return useContext(Context);
}
