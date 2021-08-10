import { useEffect } from "react";
export const createArray = length => [...Array(length)];

// https://stackoverflow.com/questions/54666401/how-to-use-throttle-or-debounce-with-react-hook
export const useDebouncedEffect = (effect, deps, delay) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps || [], delay]);
}