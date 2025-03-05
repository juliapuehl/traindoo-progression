import {twMerge} from 'tailwind-merge';
import {ButtonBase, ButtonProps, ButtonSizeClasses} from './ButtonBase';

export type IconConstructor = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string;
    titleId?: string;
  }
>;

export type IconButtonProps = {
  icon: IconConstructor;
  iconClassName?: string;
  alt?: string;
} & ButtonProps;

const sizeGuide: ButtonSizeClasses = {
  lg: {
    container: 'p-3',
    icon: 'w-6 h-6',
  },
  md: {
    container: 'p-2',
    icon: 'w-4 h-4',
  },
  sm: {
    container: 'p-1',
    icon: 'w-4 h-4',
  },
};

export const IconButtonBase = ({
  icon,
  alt,
  iconClassName,
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) => {
  const Icon = icon;
  return (
    <ButtonBase
      className={twMerge(
        `inline-flex items-center justify-center text-center`,
        className,
      )}
      {...props}
      size={size}
    >
      <Icon className={iconClassName ?? sizeGuide[size].icon} />
      {alt ? <span className="sr-only">{alt}</span> : null}
    </ButtonBase>
  );
};
