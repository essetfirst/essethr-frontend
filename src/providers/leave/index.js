import { useContext } from "react";
import Context from "./Context";

export { default as Provider } from "./Provider";

export default function useLeave() {
  return useContext(Context);
}
