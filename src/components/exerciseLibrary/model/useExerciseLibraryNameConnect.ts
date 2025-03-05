import {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {isEmpty, useFirestore} from 'react-redux-firebase';
import {useGetAllAthleteIds} from '../../../hooks/useGetAllActiveAthletes';
import {getUserId} from '../../../logic/firestore';
import {
  getExerciseLibrary,
  getExerciseLibraryEntry,
  getExerciseLibraryPrimarySecondary,
} from '../../../store/reduxFirestoreLibraryGetter';
import {getStore} from '../../../store/store';
import {
  editNameLibraryEntry,
  getLinkedExercises,
} from '../../../utils/editingLibraryHelper';
import {LinkedExercisesType} from './useExerciseLibraryDeleteConnect';
import {useLibraryEntryNameTaken} from './useExerciseLibraryNameTaken';

export const useExerciseLibraryNameConnect = (exerciseName: string) => {
  const getAthletesIds = useGetAllAthleteIds();
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const linkedExercises = useRef<LinkedExercisesType>();

  const exerciseLibrary = useSelector(getExerciseLibrary);
  const {secondaryExercises} = useSelector(getExerciseLibraryPrimarySecondary);
  const checkIfNameExists = useLibraryEntryNameTaken();

  const [loadingName, setLoadingName] = useState(false);

  const exerciseIsUsed = async () => {
    setLoadingName(true);

    const athleteIds = await getAthletesIds();
    const result = await getLinkedExercises(
      athleteIds,
      userId,
      firestore,
      exerciseName,
      secondaryExercises,
      exerciseLibrary,
    );
    console.log('result', result);
    linkedExercises.current = result;
    setLoadingName(false);
    if (isEmpty(result)) {
      return false;
    } else {
      return true;
    }
  };

  const changeExerciseName = async (newExerciseName: string) => {
    const state = getStore().getState();
    const libraryEntry = getExerciseLibraryEntry(state, exerciseName);
    const nameTaken = checkIfNameExists(newExerciseName);
    const forbiddenChar = newExerciseName.match(/[*/[\]~.]/g) !== null;
    if (nameTaken) {
      throw 'nameTaken';
    } else if (forbiddenChar) {
      throw 'forbiddenChar';
    } else if (newExerciseName.length > 80) {
      throw 'nameTooLong';
    } else {
      const newEntry = {...libraryEntry, name: newExerciseName};
      await editNameLibraryEntry(
        userId,
        firestore,
        exerciseName,
        newExerciseName.trim(),
        newEntry,
        linkedExercises.current,
      );
    }
  };

  return {
    exerciseName,
    loadingName,
    exerciseIsUsed,
    changeExerciseName,
  };
};
