import {
  CircularProgress,
  IconButton,
  SvgIconTypeMap,
  Tooltip,
} from '@mui/material';
import {OverridableComponent} from '@mui/material/OverridableComponent';
import React, {CSSProperties} from 'react';

type Props = {
  style?: CSSProperties;
  styleActive?: CSSProperties;
  active?: boolean;
  onClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/ban-types
  muiIcon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  description?: string;
  hide?: boolean;
  eventClick?: (event: React.MouseEvent<HTMLElement>) => void;
  size?: 'small' | 'medium' | 'large';
  type?: 'submit';
  disabled?: boolean;
  intercomTarget?: string;
  loading?: boolean;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
};

const IconWithTooltip = (props: Props) => {
  return (
    <div>
      {props.loading ? (
        <CircularProgress color="primary" size={20} />
      ) : (
        <>
          {!props.hide && (
            //placement!
            <Tooltip
              title={props.description ? props.description : ''}
              placement={props.placement ? props.placement : 'bottom'}
            >
              <span>
                <IconButton
                  style={
                    props.active && props.styleActive
                      ? props.styleActive
                      : props.style
                  }
                  disabled={props.disabled}
                  color="inherit"
                  data-intercom-target={props.intercomTarget}
                  className={props.intercomTarget}
                  size={props.size ? props.size : 'large'}
                  type={props.type}
                  onClick={(event) => {
                    if (props.onClick) {
                      props.onClick();
                    }
                    if (props.eventClick) {
                      props.eventClick(event);
                    }
                  }}
                >
                  <props.muiIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};

export default IconWithTooltip;
