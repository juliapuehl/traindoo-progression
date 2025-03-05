import {useRef, useEffect, ReactNode} from 'react';

import {Menu} from './Menu';

export const useContextMenu = () => {
  const menuRef = useRef(null);

  let blocking = false;

  const reset = () => {
    if (blocking) return;

    menuRef.current.style.display = 'none';

    window.removeEventListener('click', reset);
    window.removeEventListener('contextmenu', reset);
  };

  useEffect(
    () => () => {
      window.removeEventListener('contextmenu', reset);
      window.removeEventListener('click', reset);
    },
    [],
  );

  return {
    onTrigger: (event: any) => {
      blocking = true;
      event.preventDefault();

      const posX = event.clientX + window.scrollX;
      const posY = event.clientY + window.scrollY;

      menuRef.current.style.display = 'initial';

      if (event.clientX + menuRef.current.offsetWidth > window.innerWidth) {
        menuRef.current.style.left = posX - menuRef.current.offsetWidth + 'px';
      } else {
        menuRef.current.style.left = posX + 'px';
      }

      if (event.clientY + menuRef.current.offsetHeight > window.innerHeight) {
        menuRef.current.style.top = posY - menuRef.current.offsetHeight + 'px';
      } else {
        menuRef.current.style.top = posY + 'px';
      }

      window.addEventListener('click', reset);
      window.addEventListener('contextmenu', reset);

      setTimeout(() => (blocking = false), 100);
    },
    Menu: (props: {children: ReactNode}) => <Menu ref={menuRef} {...props} />,
  };
};
