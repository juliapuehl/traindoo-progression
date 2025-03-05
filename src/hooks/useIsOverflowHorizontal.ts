import {useLayoutEffect, useState} from 'react';

export const useIsOverflowHorizontal = (ref, date) => {
  const [isOverflow, setIsOverflow] = useState(undefined);

  useLayoutEffect(() => {
    const {current} = ref;

    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth;
      setIsOverflow(hasOverflow);
    };

    if (current) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(current);
      }

      trigger();
    }
  }, [ref, date]);

  return isOverflow;
};
