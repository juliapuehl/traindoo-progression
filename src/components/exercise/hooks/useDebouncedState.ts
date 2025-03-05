import {useCallback, useEffect, useRef, useState} from 'react';

export const useDebouncedState = <T>(
  initialValue: T,
  updateValue: (newValue: T) => void,
  debounceMs = 1000,
): [T, (newValue: T) => void, (newValue: T) => void] => {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    setState(initialValue);
  }, [initialValue]);

  const timeoutRef = useRef(null);

  const checkAndClear = () => {
    if (!timeoutRef.current) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const handleChange = useCallback(
    (newValue: T) => {
      setState(newValue);

      checkAndClear();

      timeoutRef.current = setTimeout(() => updateValue(newValue), debounceMs);
    },
    [debounceMs, updateValue],
  );

  useEffect(() => () => checkAndClear(), []);

  return [
    state,
    handleChange,
    (newValue: T) => {
      setState(newValue);
      updateValue(newValue);
      checkAndClear();
    },
  ];
};
