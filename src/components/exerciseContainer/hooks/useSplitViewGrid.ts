import {useEffect, useRef} from 'react';

//TODO: test touch capabilities
//TODO: find bugs :)

export const useSplitViewGrid = () => {
  const gridRef = useRef(null);
  const gutterRef = useRef(null);

  const xFixRef = useRef<number>(0);

  const frameRef = useRef<number>();

  const actualValueRef = useRef<number>(0);

  const handleXMove = (clientX: number) => {
    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      //center xPosition on gutter
      const xPos = clientX - xFixRef.current;

      const gridBounding = gridRef.current.getBoundingClientRect();

      const offsetLeft = gridBounding.left;

      const offsetXPos = xPos - offsetLeft;

      // reset cursor to normal resize
      document.body.style.cursor = 'col-resize';

      //dont allow negative x positions which lead to weird resizings
      if (offsetXPos < 0 || offsetXPos > gridBounding.width) {
        //set cursor to show user nothing is happening
        document.body.style.cursor = 'no-drop';
        frameRef.current = undefined;
        return;
      }

      const xPercentage = offsetXPos / gridBounding.width;

      const lfr = 2 * xPercentage;
      const rfr = 2 - lfr;

      gridRef.current.style.gridTemplateColumns = `${lfr}fr 20px ${rfr}fr`;

      //// stop changing layout when min-content width of an element has been hit
      const gutterBounding = gutterRef?.current?.getBoundingClientRect();

      const truePercentage =
        (gutterBounding.left + gutterBounding.width / 2 - offsetLeft) /
        gridBounding.width;

      if (
        truePercentage === actualValueRef.current &&
        Math.abs(xPercentage - truePercentage) > 0.02
      ) {
        //set cursor to show user resize is stuck
        document.body.style.cursor = 'no-drop';
        gridRef.current.style.gridTemplateColumns = `${
          2 * truePercentage
        }fr 20px ${2 - 2 * truePercentage}fr`;
      }

      actualValueRef.current = truePercentage;
      ////

      frameRef.current = undefined;
    });
  };

  const mousemove = (e) => {
    handleXMove(e.clientX);
  };

  const mouseup = () => {
    window.removeEventListener('mouseup', mouseup);
    window.removeEventListener('mousemove', mousemove);
    document.body.style.userSelect = null;
    document.body.style.cursor = null;

    document.getElementById('root').style.pointerEvents = null;
  };

  const mousedown = (e) => {
    actualValueRef.current = 0;
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('mousemove', mousemove);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    document.getElementById('root').style.pointerEvents = 'none';

    const gutterBoundingBefore = gutterRef.current.getBoundingClientRect();
    xFixRef.current =
      e.clientX - gutterBoundingBefore.left - gutterBoundingBefore.width / 2;
  };

  const touchmove = (e: TouchEvent) => {
    e.preventDefault();
    handleXMove(e.changedTouches[0].clientX);
  };

  const touchend = () => {
    document.body.style.userSelect = null;
    gridRef.current.removeEventListener('touchcancel', touchend);
    gridRef.current.removeEventListener('touchend', touchend);
    gridRef.current.removeEventListener('touchmove', touchmove);
  };

  const touchstart = (e: TouchEvent) => {
    e.preventDefault();
    actualValueRef.current = 0;
    document.body.style.userSelect = 'none';

    gridRef.current.addEventListener('touchcancel', touchend);
    gridRef.current.addEventListener('touchend', touchend);
    gridRef.current.addEventListener('touchmove', touchmove);

    const gutterBoundingBefore = gutterRef.current.getBoundingClientRect();
    xFixRef.current =
      e.changedTouches[0].clientX -
      gutterBoundingBefore.left -
      gutterBoundingBefore.width / 2;
  };

  useEffect(() => {
    const el = gutterRef.current;
    el.addEventListener('mousedown', mousedown);
    el.addEventListener('touchstart', touchstart);
    return () => {
      el.removeEventListener('mousedown', mousedown);
      el.removeEventListener('touchstart', touchstart);
    };
  }, []);

  return {gridRef, gutterRef};
};
