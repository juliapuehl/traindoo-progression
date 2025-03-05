import {useCallback} from 'react';
import {useFirestore} from 'react-redux-firebase';
import {
  getCurrentAthleteId,
  getCurrentAthleteUseRir,
} from '../../../../store/athleteSlice';
import {getStore, RootState} from '../../../../store/store';
import {
  getExercises,
  getSelectedDayIndex,
  getSelectedTrainingId,
  getSupersetMeta,
} from '../../../../store/trainingSlice';
import {addExerciseToTraining} from '../../../../utils/editingTrainingHelper';

export const useAddExerciseConnect = () => {
  const firestore = useFirestore();

  const addExercise = useCallback(
    (exerciseIndex: number) => {
      const state = getStore().getState() as RootState;
      const supersetMeta = getSupersetMeta(state);
      const dayIndex = getSelectedDayIndex(state);
      const trainingId = getSelectedTrainingId(state);
      const athleteId = getCurrentAthleteId(state);
      const exercises = getExercises(state);
      const useRirSettings = getCurrentAthleteUseRir(state);
      addExerciseToTraining(
        exerciseIndex,
        exercises,
        supersetMeta,
        useRirSettings,
        dayIndex,
        firestore,
        athleteId,
        trainingId,
      );
    },
    [firestore],
  );

  return addExercise;
};
