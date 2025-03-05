import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {RootState} from '../../../../store/store';
import {
  getExerciseName,
  getSelectedTrainingId,
  getSelectedDayIndex,
  resetCopyExercise,
} from '../../../../store/trainingSlice';
import {editExerciseName} from '../../../../utils/editingTrainingHelper';

export const useExerciseNameConnect = (exerciseIndex: number) => {
  const exerciseName = useSelector((state: RootState) =>
    getExerciseName(state, exerciseIndex),
  );

  const firestore = useFirestore();
  const dispatch = useDispatch();

  const trainingId = useSelector(getSelectedTrainingId);
  const athleteUserId = useSelector(getCurrentAthleteId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const uploadName = (text: string) => {
    editExerciseName(
      trainingId,
      dayIndex,
      exerciseIndex,
      text,
      athleteUserId,
      firestore,
    );
    dispatch(resetCopyExercise());
  };

  return {value: exerciseName, save: uploadName};
};
