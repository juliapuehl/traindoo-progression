import {forwardRef, ReactNode} from 'react';

export const MenuDivider = () => (
  <hr className="h-px my-0 bg-gray-200 border-0 w-full"></hr>
);

export const Menu = forwardRef<HTMLDivElement, {children: ReactNode}>(
  function Menu({children, ...props}, ref) {
    return (
      <div className="hidden absolute z-30" {...props} ref={ref}>
        <div className="flex flex-col bg-white rounded-lg border-gray-100 border-solid border-2 shadow-lg">
          {children}
        </div>
      </div>
    );
  },
);
