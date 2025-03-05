import {twMerge} from 'tailwind-merge';
import {IconButtonBase, IconButtonProps} from './IconButtonBase';

export const IconButton = ({className = '', ...props}: IconButtonProps) => (
  <IconButtonBase
    className={twMerge(
      `rounded-full
      text-white
        hover:bg-gray-100
        active:bg-gray-300`,
      className,
      props.disabled && 'hover:bg-transparent active:bg-transparent opacity-20',
    )}
    {...props}
  />
);
