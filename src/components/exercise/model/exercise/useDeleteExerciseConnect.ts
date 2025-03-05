import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {getStore, RootState} from '../../../../store/store';
import {
  getExercises,
  getSelectedDayIndex,
  getSelectedTrainingId,
  getSupersetMeta,
  resetCopyExercise,
} from '../../../../store/trainingSlice';
import {removeExercise} from '../../../../utils/editingTrainingHelper';

export const useDeleteExerciseConnect = (exerciseIndex: number) => {
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const deleteExercise = useCallback(() => {
    const state = getStore().getState() as RootState;
    const supersetMeta = getSupersetMeta(state);
    const dayIndex = getSelectedDayIndex(state);
    const trainingId = getSelectedTrainingId(state);
    const athleteId = getCurrentAthleteId(state);
    const exercises = getExercises(state);
    removeExercise(
      exercises,
      supersetMeta,
      exerciseIndex,
      trainingId,
      dayIndex,
      athleteId,
      firestore,
    );
    dispatch(resetCopyExercise());
  }, [firestore, dispatch, exerciseIndex]);

  return {
    deleteExercise,
  };
};
