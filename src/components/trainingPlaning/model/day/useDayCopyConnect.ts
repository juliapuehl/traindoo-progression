import {useDispatch, useSelector} from 'react-redux';
import {
  getSelectedTrainingId,
  getTrainingDay,
  setCopyDay,
} from '../../../../store/trainingSlice';

export const useDayCopyConnect = () => {
  const dispatch = useDispatch();

  const dayPlan = useSelector(getTrainingDay);

  const trainingId = useSelector(getSelectedTrainingId);
  const copyDay = async () => {
    dispatch(setCopyDay({day: dayPlan, trainingId}));
  };

  return copyDay;
};
