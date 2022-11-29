import { useContext } from "react";

import Context from "./Context";

export { default as withAuth } from "./with";
export { default as Provider } from "./Provider";

export default function useAuth() {
  return useContext(Context);
}
