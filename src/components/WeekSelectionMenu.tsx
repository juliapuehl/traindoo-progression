import {Menu, MenuItem} from '@mui/material';
import {t} from 'i18n-js';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentCycleTrainingsLength} from '../logic/firestore';
import {setSelectedTrainingIndex} from '../store/trainingSlice';
import {useTrackingSession} from './progressionFeature/model/useTrackingSession';

type Props = {
  anchorEl: any;
  open: boolean;
  handleClose: () => void;
};

const WeekSelectionMenu = (props: Props) => {
  const {registerUserActivity} = useTrackingSession();
  const amountTrainings = useSelector(getCurrentCycleTrainingsLength);

  const dispatch = useDispatch();
  const weekArray = [];

  for (let index = 1; index < amountTrainings + 1; index++) {
    weekArray.push(
      <MenuItem
        key={'week' + index}
        onClick={() => {
          registerUserActivity('selected different week', String(index));
          dispatch(setSelectedTrainingIndex(index - 1));
        }}
      >
        {t('PLANNING_NAVIGATION_BUTTON_WEEK', {index: index})}
      </MenuItem>,
    );
  }
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
      {weekArray}
    </Menu>
  );
};

export default WeekSelectionMenu;
