import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {getStore, RootState} from '../../../../store/store';
import {
  getExerciseCopiedExists,
  getExerciseCopy,
  getExerciseCopyName,
  getExercises,
  getSelectedDayIndex,
  getSelectedTrainingId,
  getSupersetMeta,
} from '../../../../store/trainingSlice';
import {addCopiedExerciseToTraining} from '../../../../utils/editingTrainingHelper';

export const usePasteExerciseConnect = (exerciseIndex: number) => {
  const exerciseCopyAvailable = useSelector(getExerciseCopiedExists);
  const firestore = useFirestore();
  const exerciseCopyName = useSelector(getExerciseCopyName);

  const pasteExercise = useCallback(
    (positionWithinSuperset: string) => {
      const addToSuperset =
        positionWithinSuperset === 'middleExercise' ||
        positionWithinSuperset === 'lastExercise';
      const state = getStore().getState() as RootState;
      const supersetMeta = getSupersetMeta(state);
      const dayIndex = getSelectedDayIndex(state);
      const trainingId = getSelectedTrainingId(state);
      const athleteId = getCurrentAthleteId(state);
      const exercises = getExercises(state);
      const exerciseCopy = getExerciseCopy(state);

      const exercise = exercises?.['exercise' + exerciseIndex];

      if (exerciseCopy) {
        addCopiedExerciseToTraining(
          exerciseIndex,
          exercises,
          dayIndex,
          firestore,
          athleteId,
          trainingId,
          exerciseCopy,
          addToSuperset ? exercise.supersetId : undefined,
          supersetMeta,
        );
      }
    },
    [exerciseIndex, firestore],
  );

  return {
    pasteExercise,
    copiedExerciseName: exerciseCopyName,
    showInsertIcon: exerciseCopyAvailable,
  };
};
