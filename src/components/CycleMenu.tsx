import {Menu, MenuItem} from '@mui/material';
import {t} from 'i18n-js';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentCycleTrainingsLength} from '../logic/firestore';
import {getAthleteTotalCycle} from '../store/athleteSlice';
import {
  getSelectedCycleIndex,
  getSelectedTrainingIndex,
  setIndexSelectedCycle,
  setSelectedTrainingIndex,
} from '../store/trainingSlice';

type Props = {
  anchorEl: any;
  open: boolean;
  handleClose: () => void;
};

const CycleMenu = (props: Props) => {
  const totalCycle = useSelector(getAthleteTotalCycle);
  const dispatch = useDispatch();
  const amountTrainings = useSelector(getCurrentCycleTrainingsLength);
  const selectedCycle = useSelector(getSelectedCycleIndex);
  const selectedTrainingIndex = useSelector(getSelectedTrainingIndex);

  const handleClick = (index: number) => {
    dispatch(setIndexSelectedCycle(index + 1));
    dispatch(setSelectedTrainingIndex(-1));
    props.handleClose();
  };
  // TODO: Change Cycle Index and Training Index at the same time to avoid training index going to 0 first
  useEffect(() => {
    if (selectedTrainingIndex === -1) {
      // Always select the last week of a cycle
      dispatch(setSelectedTrainingIndex(amountTrainings - 1));
    }
  }, [dispatch, amountTrainings, selectedCycle, selectedTrainingIndex]);

  const generateMenu = () => {
    const viewArray = [];
    for (let index = 0; index < totalCycle; index++) {
      viewArray.push(
        <MenuItem key={'cycleItem' + index} onClick={() => handleClick(index)}>
          {t('PLANNING_NAVIGATION_MENU_ITEMS', {index: index + 1})}
        </MenuItem>,
      );
    }
    return viewArray;
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
      {generateMenu()}
    </Menu>
  );
};

export default CycleMenu;
