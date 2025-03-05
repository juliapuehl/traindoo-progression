import {createPopper} from '@popperjs/core';
import {t} from 'i18n-js';
import {useCallback, useEffect, useRef} from 'react';

type Props = {
  note: string;
  showPopOver: boolean;
  btnRef: any;
  setShowPopOver: (newValue: boolean) => void;
};
export const NotePopover = ({
  note,
  showPopOver,
  btnRef,
  setShowPopOver,
}: Props) => {
  const popoverRef = useRef(null);
  createPopper(btnRef.current, popoverRef.current, {
    placement: 'left',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });
  const handleClick = useCallback((e: MouseEvent) => {
    if (
      popoverRef.current &&
      e.target &&
      (popoverRef.current.contains(e.target) ||
        btnRef.current.contains(e.target))
    )
      return;
    setShowPopOver(false);
  }, []);
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  return (
    <div
      className={
        (showPopOver ? '' : 'hidden ') +
        'shadow-lg bg-gray-300 border-0 mr-6 block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg'
      }
      ref={popoverRef}
    >
      <div>
        <div
          className={
            'bg-gray-300 opacity-75 font-semibold p-3 mb-0 border-b border-solid border-slate-100 uppercase rounded-t-lg'
          }
        >
          {t('PLANNING_ATHLETE_HEADLINE_NOTE')}
        </div>
        <div className="p-3">{note}</div>
      </div>
    </div>
  );
};
