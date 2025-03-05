import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import {twMerge} from 'tailwind-merge';
import {useResizeObserver} from '../../exercise/hooks/useResizeObserver';

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export const InlineTextArea = forwardRef<HTMLTextAreaElement, InputProps>(
  function InlineTextArea({className = '', value, ...props}, fref) {
    const ref = useRef(null);

    //https://stackoverflow.com/a/17605480
    const autoHeight = () => {
      const elem = ref.current;
      if (!elem) return;
      elem.style.height = '1px';
      elem.style.height = elem.scrollHeight + 'px';
    };

    useLayoutEffect(() => {
      autoHeight();
    }, []);

    useEffect(() => {
      autoHeight();
    }, [value]);

    useResizeObserver(undefined, () => (autoHeight(), false), ref);

    return (
      <textarea
        ref={(el) => {
          ref.current = el;
          if (typeof fref === 'function') {
            fref(el);
          } else if (fref) {
            fref.current = el;
          }
        }}
        className={twMerge(
          `bg-transparent rounded-lg h-6 min-w-0
      transition-colors
      hover:bg-gray-200
      focus:bg-gray-200
      disabled:bg-transparent
      disabled:text-gray-500
      px-2
      resize-none`,
          className,
        )}
        {...props}
        value={value}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.preventDefault();
          event.defaultPrevented = false;
          if (props.onKeyDown) props.onKeyDown(event);
        }}
      />
    );
  },
);
