import { useState, useEffect } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialValue: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  // Initialize state with a function to read from localStorage
  const [value, setValue] = useState<T>(() => {
    // Try to get from localStorage
    const storedValue = window.localStorage.getItem(key);

    if (storedValue !== null) {
      return JSON.parse(storedValue) as T;
    }

    // Handle function initializer
    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  // Update localStorage when value changes
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
