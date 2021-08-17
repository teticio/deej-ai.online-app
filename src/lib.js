import { useState, useEffect } from "react";

export const createArray = length => [...Array(length)];

var timerId;

export const debounceFunction = function (func, delay) {
  // Cancels the setTimeout method execution
  clearTimeout(timerId)

  // Executes the func after delay time.
  timerId = setTimeout(func, delay)
}

export const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(
    () => JSON.parse(sessionStorage.getItem(key)) || defaultValue
  );
  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}
