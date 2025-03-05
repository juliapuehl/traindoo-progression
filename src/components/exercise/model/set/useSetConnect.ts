import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {RootState} from '../../../../store/store';
import {
  getSelectedDayIndex,
  getSelectedTrainingId,
  getTrainingSet,
} from '../../../../store/trainingSlice';
import {editValue} from '../../../../utils/editingTrainingHelper';

export const useSetConnect = (exerciseIndex: number, setIndex: number) => {
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);

  const set = useSelector((state: RootState) =>
    getTrainingSet(state, exerciseIndex, setIndex),
  );
  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const updateSet = async (key: string, value: any) => {
    editValue(
      trainingId,
      dayIndex,
      exerciseIndex,
      setIndex,
      key,
      value,
      athleteUserId,
      firestore,
    );
  };

  return {
    set,
    updateSet,
  };
};
