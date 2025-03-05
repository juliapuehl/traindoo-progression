import {MutableRefObject, useEffect, useMemo, useRef} from 'react';

export type Breakpoints = {
  [index: string]: number;
};

export const useResizeObserver = (
  breakpoints: Breakpoints,
  callback?: (entry: ResizeObserverEntry) => boolean,
  ref?: MutableRefObject<any>,
) => {
  const backupRef = useRef(null);
  const containerRef = ref ?? backupRef;
  const breakpointRef = useRef(null);

  const frameRef = useRef<number>();

  const debouncedResize = (entries: ResizeObserverEntry[]) => {
    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      handleResize(entries);
      frameRef.current = undefined;
    });
  };

  const handle = (width: number) => {
    const breakpoint = Object.entries(breakpoints).find(
      ([_, breakpoint_width]) => width < breakpoint_width,
    );

    if (!containerRef.current) return;

    if (breakpoint) {
      const breakpoint_name = breakpoint[0];

      if (breakpoint_name === breakpointRef.current) return;

      if (breakpointRef.current)
        containerRef.current.classList.remove(breakpointRef.current);

      containerRef.current.classList.add(breakpoint_name);

      breakpointRef.current = breakpoint_name;
    } else {
      containerRef.current.classList.remove(breakpointRef.current);
      breakpointRef.current = null;
    }
  };

  const handleResize = (entries: ResizeObserverEntry[]) => {
    if (callback && !callback(entries[0])) return;

    const {width} = entries[0].contentRect;

    handle(width);
  };

  const resizeObserver = useMemo(() => {
    return new ResizeObserver(debouncedResize);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (callback && !callback(el.offsetWidth)) return;
    handle(el.offsetWidth);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.unobserve(el);
  }, [resizeObserver]);

  return {
    ref: containerRef,
  };
};
