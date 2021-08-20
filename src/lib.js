import { useState, useEffect } from "react";

export const createArray = length => [...Array(length)];

var timerId;

export const debounceFunction = function (func, delay) {
  clearTimeout(timerId)
  timerId = setTimeout(func, delay)
}

export const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

export function VerticalSpacer({ px = 10 }) {
  return (
    <div style={{ marginTop: `${px}px` }} />
  );
}

export function HorizontalSpacer({ px = 10 }) {
  return (
    <div style={{ width: `${px}px` }} />
  );
}
