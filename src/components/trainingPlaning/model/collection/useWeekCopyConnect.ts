import {useDispatch, useSelector} from 'react-redux';
import {
  getSelectedTraining,
  setCopyWeek,
} from '../../../../store/trainingSlice';

export const useWeekCopyConnect = () => {
  const dispatch = useDispatch();
  const weekTraining = useSelector(getSelectedTraining);

  const copyWeek = async () => {
    dispatch(setCopyWeek({week: weekTraining, trainingId: weekTraining.id}));
  };

  return {copyWeek};
};
