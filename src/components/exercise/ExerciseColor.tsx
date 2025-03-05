import {HTMLProps} from 'react';
import {twMerge} from 'tailwind-merge';

type ColorType = 'neutral' | 'primary' | 'secondary';

export const ExerciseColor = ({
  className,
  color = 'neutral',
  ...props
}: HTMLProps<HTMLDivElement> & {color?: ColorType}) => {
  return (
    <div
      className={twMerge(
        'bg-medium_gray text-white rounded-l-lg p-1 flex items-center text-center min-w-[1.75rem] -m-2 mr-2',
        color === 'primary' && 'bg-emerald-400',
        color === 'secondary' && 'bg-cyan-400',
        className,
      )}
      {...props}
    />
  );
};
