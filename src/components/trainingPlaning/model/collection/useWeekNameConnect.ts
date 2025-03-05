import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {
  getSelectedTrainingId,
  getWeekName,
} from '../../../../store/trainingSlice';
import {editWeekName} from '../../../../utils/editingTrainingHelper';

export const useWeekNameConnect = () => {
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);
  const trainingId = useSelector(getSelectedTrainingId);
  const weekName = useSelector(getWeekName);

  const save = (text: string) => {
    const newName = text.trim();
    editWeekName(trainingId, newName, athleteUserId, firestore);
  };
  return {firWeekName: weekName, saveWeekName: save};
};
