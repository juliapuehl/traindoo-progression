import {twMerge} from 'tailwind-merge';
import {IconButtonBase, IconButtonProps} from './IconButtonBase';

export const CircleIconButton = ({
  className = '',
  ...props
}: IconButtonProps) => (
  <IconButtonBase
    className={twMerge(
      `bg-gray-300 rounded-full 
    hover:bg-gray-200 hover:shadow-inner 
    active:bg-gray-300`,
      className,
    )}
    {...props}
  />
);
