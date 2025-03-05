import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {
  getSelectedDayIndex,
  getSelectedTrainingId,
} from '../../../../store/trainingSlice';
import {dayIndicesArray} from '../../../../traindoo_shared/types/Training';
import {editDay} from '../../../../utils/editingTrainingHelper';

export const useEditDay = () => {
  const firestore = useFirestore();
  const athleteId = useSelector(getCurrentAthleteId);

  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const namePath = 'trainingDays.' + dayIndicesArray[dayIndex] + '.';

  return async (key: string, value: any) => {
    editDay(trainingId, {[namePath + key]: value}, athleteId, firestore);
  };
};
