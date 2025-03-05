import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {CSSProperties, ReactNode, useRef, useState} from 'react';
import {useIsOverflow} from '../hooks/useIsOverflow';
import {primary_green} from '../styles/colors';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  elementKey: string;
  children: ReactNode;
};

export const DashboardElementScrollIndicator = (props: Props) => {
  const {elementKey} = props;
  const [isBottom, setIsBottom] = useState(false);
  const ref = useRef();
  const isOverflow = useIsOverflow(ref);
  const onScrollFunction = () => {
    if (
      document?.getElementById(elementKey)?.scrollHeight -
        (document?.getElementById(elementKey)?.scrollTop +
          document?.getElementById(elementKey)?.clientHeight) <
      10
    ) {
      setIsBottom(true);
    } else if (isBottom === true) {
      setIsBottom(false);
    }
  };
  const handleArrowClick = () => {
    if (isBottom) {
      document.getElementById(elementKey).scrollTop = 0;
    } else {
      document.getElementById(elementKey).scrollTop =
        document.getElementById(elementKey).scrollHeight;
    }
  };
  return (
    <div
      style={{
        ...styles.container,
        ...{paddingBottom: isOverflow ? 30 : 0},
      }}
      ref={ref}
      id={elementKey}
      onScroll={onScrollFunction}
    >
      {props.children}
      <div style={styles.scrollIndicator}>
        {isOverflow ? (
          <IconWithTooltip
            muiIcon={
              isBottom ? KeyboardDoubleArrowUpIcon : KeyboardDoubleArrowDownIcon
            }
            style={styles.scrollIcon}
            onClick={handleArrowClick}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  scrollIndicator: CSSProperties;
  scrollIcon: CSSProperties;
};

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    overflowY: 'auto',
    scrollBehavior: 'smooth',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0 0 8px 8px',
    background:
      'linear-gradient(rgba(67, 67, 67, 0), rgba(67, 67, 67, 0.5),rgba(67, 67, 67, 1) ,rgba(67, 67, 67,1)',
  },
  scrollIcon: {color: primary_green, cursor: 'default'},
};
