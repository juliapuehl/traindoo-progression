import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {
  getSelectedDayIndex,
  getSelectedTrainingId,
} from '../../../../store/trainingSlice';
import {deleteDay} from '../../../../utils/editingTrainingHelper';

export const useDayDeleteConnect = () => {
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);
  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const handleDeleteDay = async () => {
    await deleteDay(trainingId, dayIndex, athleteUserId, firestore);
  };

  return handleDeleteDay;
};
