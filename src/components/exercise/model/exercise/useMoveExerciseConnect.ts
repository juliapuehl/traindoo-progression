import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {
  getExercises,
  getSelectedDayIndex,
  getSelectedTrainingId,
  getSupersetMeta,
  resetCopyExercise,
} from '../../../../store/trainingSlice';
import {moveExercise} from '../../../../utils/editingTrainingHelper';

export const useMoveExerciseConnect = (exerciseIndex: number) => {
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const athleteUserId = useSelector(getCurrentAthleteId);
  const exercises = useSelector(getExercises);
  const supersetMeta = useSelector(getSupersetMeta);
  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const handleMoveExercise = (up: boolean) => {
    moveExercise(
      exercises,
      exerciseIndex,
      supersetMeta,
      up,
      trainingId,
      dayIndex,
      athleteUserId,
      firestore,
    );

    dispatch(resetCopyExercise());
  };

  return {
    moveExerciseUp: () => handleMoveExercise(true),
    moveExerciseDown: () => handleMoveExercise(false),
    exercisesAmount: exercises ? Object.keys(exercises)?.length : 0,
  };
};
