import {Menu, MenuItem, Typography} from '@mui/material';
import {t} from 'i18n-js';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {getProgressionUserIsUnlocked} from '../../logic/firestore';
import {new_green} from '../../styles/colors';
import {NewWeekStartPopover} from '../NewWeekStartPopover';

type Props = {
  anchorEl: any;
  open: boolean;
  handleClose: () => void;
};

export const NewWeekMenu = (props: Props) => {
  const displayProgressionTool = useSelector(getProgressionUserIsUnlocked);
  const [creationMethod, setCreationMethod] = useState<
    'copy' | 'new' | 'progression'
  >();

  const handleClose = () => {
    setCreationMethod(undefined);
    props.handleClose();
  };

  return (
    <Menu
      id="basic-menu"
      anchorEl={props.anchorEl}
      open={props.open}
      onClose={props.handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem
        onClick={() => {
          setCreationMethod('new');
        }}
      >
        {t('PLANNING_NAVIGATION_MENU_BLANK_WEEK')}
      </MenuItem>

      <MenuItem
        onClick={() => {
          setCreationMethod('copy');
        }}
      >
        {t('PLANNING_NAVIGATION_MENU_COPY_WEEK')}
      </MenuItem>
      {displayProgressionTool && (
        <MenuItem
          onClick={() => {
            setCreationMethod('progression');
          }}
        >
          <Typography fontWeight={1000} color={new_green}>
            {t('PLANNING_NAVIGATION_MENU_PROGRESSION')}
          </Typography>
        </MenuItem>
      )}
      <NewWeekStartPopover
        handleClose={handleClose}
        creationMethod={creationMethod ?? 'copy'}
        open={Boolean(creationMethod)}
      />
    </Menu>
  );
};
