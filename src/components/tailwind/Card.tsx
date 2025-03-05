import {DetailedHTMLProps, forwardRef, HTMLAttributes} from 'react';
import {twMerge} from 'tailwind-merge';
import {LoadingSpinner} from './LoadingSpinner';

export type CardProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLInputElement
> & {loading?: boolean};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Input(
  {className = '', children, loading = false, ...props},
  ref,
) {
  return (
    <div
      ref={ref}
      className={twMerge(
        `inline-flex rounded-lg bg-white items-stretch w-full p-2`,
        className,
        loading && 'animate-pulse',
      )}
      {...props}
    >
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <LoadingSpinner />
        </div>
      ) : (
        children
      )}
    </div>
  );
});
