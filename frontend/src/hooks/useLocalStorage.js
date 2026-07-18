import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state in localStorage
 * 
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value
 * @returns {[any, Function]} State and setter function
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'dark');
 */
const useLocalStorage = (key, initialValue) => {
  // Get stored value from localStorage
  const readStoredValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readStoredValue);

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;