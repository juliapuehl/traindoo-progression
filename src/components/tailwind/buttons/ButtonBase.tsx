import {ButtonHTMLAttributes, DetailedHTMLProps, Ref} from 'react';
import {twMerge} from 'tailwind-merge';

export type ButtonSizes = 'lg' | 'md' | 'sm';

export type ButtonSizeClasses = {
  [key in ButtonSizes]: any;
};

export type ButtonProps = {
  size?: ButtonSizes;
  forwardRef?: Ref<HTMLButtonElement>;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const sizeGuide: ButtonSizeClasses = {
  lg: 'p-3',
  md: 'p-2',
  sm: 'p-1',
};

export const ButtonBase = ({
  size = 'md',
  className = '',
  forwardRef,
  ...props
}: ButtonProps) => {
  return (
    <button
      ref={forwardRef}
      type="button"
      {...props}
      className={twMerge(
        `${sizeGuide[size]} transition-colors
        inline-flex items-center justify-center text-center 
        focus:outline-0 `, //focus:ring-2 focus:ring-highlight-400
        className,
      )}
    />
  );
};
