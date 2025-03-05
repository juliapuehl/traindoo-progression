import {useDispatch, useSelector} from 'react-redux';
import {getDayName, resetCopyExercise} from '../../../../store/trainingSlice';
import {useEditDay} from './useEditDay';

export const useDayNameConnect = () => {
  const dispatch = useDispatch();
  const dayName = useSelector(getDayName);
  const editDay = useEditDay();

  const save = (text: string) => {
    const newName = text.trim();
    editDay('name', newName);
    dispatch(resetCopyExercise());
  };
  return {firestoreDayName: dayName, saveDayName: save};
};
