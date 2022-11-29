import { useContext } from "react";

import Context from "./Context";

export { default as Provider } from "./Provider";


export default function usePayroll() {  
  return useContext(Context);
}
