import {Menu, MenuItem} from '@mui/material';
import {t} from 'i18n-js';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentCycleTrainingsLength} from '../logic/firestore';
import {getAthleteTotalCycle, getCurrentAthleteId} from '../store/athleteSlice';
import {
  getSelectedCycleIndex,
  setIndexSelectedCycle,
} from '../store/trainingSlice';
import {
  addToAthleteTotalCycles,
  removeFromAthleteTotalCycles,
} from '../utils/editingAthleteHelper';
import {AlertPopover} from './AlertPopover';

type Props = {
  anchorEl: any;
  open: boolean;
  handleClose: () => void;
  setOpenInsertTemplate: (open: boolean) => void;
  setOpenNewTemplate: (open: boolean) => void;
};

const NewCycleMenu = (props: Props) => {
  const athleteUserId = useSelector(getCurrentAthleteId);
  const firestore = useFirestore();
  const athleteTotalCycle = useSelector(getAthleteTotalCycle);
  const totalTrainings = useSelector(getCurrentCycleTrainingsLength);
  const selectedCycle = useSelector(getSelectedCycleIndex);
  const dispatch = useDispatch();

  const [openAlertNewCycle, setOpenAlertNewCycle] = useState(false);
  const [openAlertDeleteCycle, setOpenAlertDeleteCycle] = useState(false);

  const handleAddCycle = () => {
    addToAthleteTotalCycles(athleteTotalCycle, athleteUserId, firestore);
    dispatch(setIndexSelectedCycle(athleteTotalCycle + 1));
    props.handleClose();
  };

  const handleDeleteCycle = () => {
    removeFromAthleteTotalCycles(
      athleteTotalCycle,
      totalTrainings,
      athleteUserId,
      dispatch,
      firestore,
    );
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
          setOpenAlertNewCycle(true);
        }}
      >
        {t('PLANNING_NAVIGATION_MENU_NEW_CYCLE')}
      </MenuItem>

      {totalTrainings === 0 &&
        selectedCycle === athleteTotalCycle &&
        athleteTotalCycle > 1 && (
          <MenuItem onClick={() => setOpenAlertDeleteCycle(true)}>
            {t('PLANNING_NAVIGATION_MENU_DELETE_CYCLE')}
          </MenuItem>
        )}
      {
        <MenuItem
          onClick={() => {
            props.setOpenInsertTemplate(true);
            props.handleClose();
          }}
        >
          {t('PLANNING_NEW_CYCLE_USE_TEMPLATE')}
        </MenuItem>
      }
      {totalTrainings !== 0 && (
        <MenuItem
          onClick={() => {
            props.setOpenNewTemplate(true);
            props.handleClose();
          }}
        >
          {t('PLANNING_NEW_CYCLE_ADD_TEMPLATE')}
        </MenuItem>
      )}
      <AlertPopover
        open={openAlertDeleteCycle}
        handleClose={() => setOpenAlertDeleteCycle(false)}
        confirm={handleDeleteCycle}
        abortText={t('PLANNING_NAVIGATION_MENU_ALERT_CANCEL')}
        confirmText={t('PLANNING_NAVIGATION_MENU_ALERT_CONFIRM')}
        headline={t('PLANNING_NAVIGATION_MENU_ALERT_TITLE')}
        text={t('PLANNING_NAVIGATION_MENU_ALERT_TEXT')}
      />
      <AlertPopover
        open={openAlertNewCycle}
        handleClose={() => setOpenAlertNewCycle(false)}
        confirm={handleAddCycle}
        abortText={t('PLANNING_NAVIGATION_NEW_CYCLE_ALERT_CANCEL')}
        confirmText={t('PLANNING_NAVIGATION_NEW_CYCLE_ALERT_CONFIRM')}
        headline={t('PLANNING_NAVIGATION_NEW_CYCLE_ALERT_TITLE')}
        text={t('PLANNING_NAVIGATION_NEW_CYCLE_ALERT_TEXT')}
      />
    </Menu>
  );
};

export default NewCycleMenu;
