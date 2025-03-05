import {twMerge} from 'tailwind-merge';
import {ButtonBase, ButtonProps, ButtonSizeClasses} from './ButtonBase';

const sizeGuide: ButtonSizeClasses = {
  lg: 'text-lg py-2',
  md: 'text-md py-1',
  sm: 'text-sm py-0',
};

export const TextButton = ({
  text,
  className = '',
  size = 'md',
  ...props
}: {text: string} & ButtonProps) => {
  return (
    <ButtonBase
      className={twMerge(
        sizeGuide[size],
        `bg-gray-200 rounded-xl
      hover:bg-gray-100
      active:bg-gray-300
      `,
        className,
      )}
      {...props}
    >
      {text}
    </ButtonBase>
  );
};
