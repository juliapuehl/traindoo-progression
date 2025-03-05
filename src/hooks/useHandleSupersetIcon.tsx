import {uuid4} from '@sentry/utils';
import {t} from 'i18n-js';
import {cloneDeep} from 'lodash';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {specificTrainingDataQuery} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {
  getExercises,
  getSelectedDayIndex,
  getSelectedTrainingId,
  getSupersetMeta,
} from '../store/trainingSlice';
import {dayIndicesArray} from '../traindoo_shared/types/Training';

export const useHandleSupersetIcon = (exerciseIndex: number) => {
  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);
  const athleteUserId = useSelector(getCurrentAthleteId);
  const firestore = useFirestore();
  const exercises = useSelector(getExercises);
  const supersetMeta = useSelector(getSupersetMeta);

  const exerciseIndexAbove = exerciseIndex - 1;
  const superIdAbove = exerciseIndex
    ? exercises['exercise' + exerciseIndexAbove]?.supersetId
    : undefined;

  const superExerciseArrayAbove = supersetMeta?.[superIdAbove]?.exerciseIndices
    ? cloneDeep(supersetMeta[superIdAbove]?.exerciseIndices)
    : [];

  const superId = exercises['exercise' + exerciseIndex]?.supersetId;

  const superExerciseArray = supersetMeta?.[superId]?.exerciseIndices
    ? cloneDeep(supersetMeta[superId]?.exerciseIndices)
    : [];

  const isTopElementOfSuperset =
    superExerciseArray?.sort()[0] === exerciseIndex;

  const triggerDelete = superId && !isTopElementOfSuperset;

  const pathExercise =
    'trainingDays.' + dayIndicesArray[dayIndex] + '.exercises.exercise';

  const pathSupersetMeta =
    'trainingDays.' + dayIndicesArray[dayIndex] + '.supersetMeta';

  const getPathSuperset = (index: number) => {
    return pathExercise + index + '.supersetId';
  };

  const highlightIcon = Boolean(superId) && !isTopElementOfSuperset;

  const addExercisePartOfSuperset = () => {
    const changeObject = {};
    // Case Exercise above is also part of a superset => overwrite supersetAbove with own superset info
    if (superIdAbove) {
      superExerciseArrayAbove.forEach((index: number) => {
        changeObject[getPathSuperset(index)] = superId;
      });
      const newArray = superExerciseArray.concat(superExerciseArrayAbove);
      newArray.sort();
      changeObject[pathSupersetMeta + '.' + superId + '.exerciseIndices'] =
        newArray;
      changeObject[pathSupersetMeta + '.' + superIdAbove] =
        firestore.FieldValue.delete();
      // Case Exercise above is not part of a superset => add to current superset
    } else {
      changeObject[getPathSuperset(exerciseIndexAbove)] = superId;
      superExerciseArray.push(exerciseIndexAbove);
      changeObject[pathSupersetMeta + '.' + superId + '.exerciseIndices'] =
        superExerciseArray;
    }
    return changeObject;
  };
  const addExerciseNotPartOfSuperset = () => {
    const changeObject = {};
    // Case Exercise above is part of a superset => add to supersetAbove
    if (superIdAbove) {
      superExerciseArrayAbove.push(exerciseIndex);
      superExerciseArrayAbove.sort();
      changeObject[pathSupersetMeta + '.' + superIdAbove + '.exerciseIndices'] =
        superExerciseArrayAbove;
      changeObject[getPathSuperset(exerciseIndex)] = superIdAbove;
      // Case Exercise above is not part of a superset => create new superset
    } else {
      const newId = uuid4();
      const newMetaObject = {
        id: newId,
        index: exerciseIndex,
        name: t('PLANNING_ICON_EXERCISE_LINK_DEFAULT_NAME'),
        exerciseIndices: [exerciseIndex, exerciseIndexAbove],
      };
      changeObject[pathSupersetMeta + '.' + newId] = newMetaObject;
      changeObject[getPathSuperset(exerciseIndex)] = newId;
      changeObject[getPathSuperset(exerciseIndexAbove)] = newId;
    }
    return changeObject;
  };

  const addToSuperset = () => {
    let changeObject = {};
    // Case Exercise is already part of a superset
    if (superId) {
      changeObject = addExercisePartOfSuperset();
      // Case Exercise is not part of a superset
    } else {
      changeObject = addExerciseNotPartOfSuperset();
    }
    return changeObject;
  };

  const deleteSuperset = () => {
    const changeObject = {};
    superExerciseArray.forEach((index: number) => {
      changeObject[getPathSuperset(index)] = firestore.FieldValue.delete();
    });
    changeObject[pathSupersetMeta + '.' + superId] =
      firestore.FieldValue.delete();
    return changeObject;
  };

  return {
    supersetHandler: () => {
      const changeObject = triggerDelete ? deleteSuperset() : addToSuperset();
      firestore.update(
        specificTrainingDataQuery(athleteUserId, trainingId),
        changeObject,
      );
    },
    highlightIcon: highlightIcon,
  };
};
