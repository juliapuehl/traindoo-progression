import {Comment} from '@mui/icons-material';
import {Popover, Typography} from '@mui/material';
import {t} from 'i18n-js';
import React, {CSSProperties} from 'react';
import {light_gray, primary_green} from '../styles/colors';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  active?: boolean;
  text: string;
};
export const DailyCheckRemarkIcon = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div>
      <IconWithTooltip
        active={props.active}
        style={styles.remarkIconInactive}
        styleActive={styles.remarkIcon}
        eventClick={handleClick}
        muiIcon={Comment}
        description={t('PLANNING_HEALTH_ICON_SHOW_REMARK')}
        disabled={!props.active}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{p: 2}}>{props.text}</Typography>
      </Popover>
    </div>
  );
};

type Styles = {
  main: CSSProperties;
  remarkIcon: CSSProperties;
  remarkIconInactive: CSSProperties;
};

const styles: Styles = {
  main: {},
  remarkIcon: {
    color: primary_green,
    height: 21.333,
    justifyContent: 'center',
  },
  remarkIconInactive: {
    color: light_gray,
    height: 21.333,
    justifyContent: 'center',
  },
};
