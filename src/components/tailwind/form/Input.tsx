import {DetailedHTMLProps, forwardRef, InputHTMLAttributes} from 'react';
import {twMerge} from 'tailwind-merge';

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {className = '', ...props},
  ref,
) {
  return (
    <input
      ref={ref}
      className={twMerge(
        `bg-gray-200 rounded-lg text-center h-6 min-w-0
      transition-colors
      hover:bg-gray-100`,
        className,
      )}
      {...props}
    />
  );
});
