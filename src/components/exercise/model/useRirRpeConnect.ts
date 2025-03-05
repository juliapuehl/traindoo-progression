import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../store/athleteSlice';
import {RootState} from '../../../store/store';
import {
  getExerciseUseRir,
  getSelectedDayIndex,
  getSelectedTrainingId,
} from '../../../store/trainingSlice';
import {editExercise} from '../../../utils/editingTrainingHelper';

export const useRirRpeConnect = (exerciseIndex: number) => {
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);

  const useRir = useSelector((state: RootState) =>
    getExerciseUseRir(state, exerciseIndex),
  );

  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const switchRirRpe = () => {
    editExercise(
      'useRir',
      !useRir,
      trainingId,
      dayIndex,
      exerciseIndex,
      athleteUserId,
      firestore,
    );
  };

  return {
    useRir,
    switchRirRpe,
  };
};
