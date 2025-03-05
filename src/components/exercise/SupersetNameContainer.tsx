import {ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';
import {alphabet} from './ExerciseComponent';

export const SupersetNameContainer = ({
  supersetIndex,
  children,
}: {
  supersetIndex: number;
  children: ReactNode;
}) => {
  return (
    <div className="bg-dark_gray rounded-lg inline-flex items-center mt-6 w-full">
      <div
        className={twMerge(
          'bg-gray-500 text-white rounded-l-lg p-1 text-center min-w-[1.75rem]',
          supersetIndex % 2 == 0 ? 'bg-emerald-400' : 'bg-cyan-400',
        )}
      >
        {alphabet[supersetIndex]}
      </div>
      {children}
    </div>
  );
};
