import {twMerge} from 'tailwind-merge';
import {IconButtonBase, IconButtonProps} from './IconButtonBase';

export const RoundedIconButton = ({
  className = '',
  ...props
}: IconButtonProps & {active?: boolean}) => (
  <IconButtonBase
    className={twMerge(
      `bg-gray-300 rounded-xl  
        hover:bg-gray-200 hover:shadow-inner 
        active:bg-gray-300`,
      className,
    )}
    {...props}
  />
);
