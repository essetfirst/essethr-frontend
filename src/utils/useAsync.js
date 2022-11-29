import { useEffect } from "react";

export default function useAsync(asyncFn, onSuccess, onFailed) {
  useEffect(() => {
    let isMounted = true;
    asyncFn()
      .then((data) => {
        if (isMounted) onSuccess && onSuccess(data);
      })
      .catch((e) => isMounted && onFailed && onFailed(e));
    return () => {
      isMounted = false;
    };
  }, [asyncFn, onSuccess, onFailed]);
}
