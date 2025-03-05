import {isEmpty} from 'lodash';
import {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useGetAllAthleteIds} from '../../../hooks/useGetAllActiveAthletes';
import {getUserId} from '../../../logic/firestore';
import {
  getExerciseLibrary,
  getExerciseLibraryEntry,
  getExerciseLibraryEntryArchived,
  getExerciseLibraryPrimarySecondary,
} from '../../../store/reduxFirestoreLibraryGetter';
import {getStore, RootState} from '../../../store/store';
import {
  deleteLibraryEntry,
  editChangeToNewLibraryEntry,
  editLibraryEntry,
  editNameLibraryEntry,
  getLinkedExercises,
} from '../../../utils/editingLibraryHelper';
import {useLibraryEntryNameTaken} from './useExerciseLibraryNameTaken';

export type LinkedExercisesType = {
  plans: {
    [athleteId: string]: {[planId: string]: string[]};
  };
  dayTemplates: {[dayTemplateId: string]: string[]};
  weekTemplates: {
    [weekTemplateId: string]: {
      oldArray: Array<{
        dayKey: string;
        dayName: string;
        exercises: any;
        noTraining: boolean;
      }>;
      paths: Array<{
        dayKey: string;
        exerciseKey: string;
      }>;
    };
  };
  cycleTemplates: {
    [cycleTemplateId: string]: {
      [weekTemplateId: string]: {
        oldArray: Array<{
          dayKey: string;
          dayName: string;
          exercises: any;
          noTraining: boolean;
        }>;
        paths: Array<{
          weekKey: string;
          dayKey: string;
          exerciseKey: string;
        }>;
      };
    };
  };

  secondaryExercises: string[];
};

export const useExerciseLibraryDeleteConnect = (exerciseName: string) => {
  const getAthletesIds = useGetAllAthleteIds();
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const linkedExercises = useRef<LinkedExercisesType>();
  const exerciseArchived = useSelector((state: RootState) =>
    getExerciseLibraryEntryArchived(state, exerciseName),
  );
  const exerciseLibrary = useSelector(getExerciseLibrary);
  const {secondaryExercises} = useSelector(getExerciseLibraryPrimarySecondary);
  const checkIfNameExists = useLibraryEntryNameTaken();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const exerciseIsUsed = async () => {
    setDeleteLoading(true);

    const athleteIds = await getAthletesIds();
    const result = await getLinkedExercises(
      athleteIds,
      userId,
      firestore,
      exerciseName,
      secondaryExercises,
      exerciseLibrary,
    );
    linkedExercises.current = result;
    setDeleteLoading(false);
    if (
      isEmpty(result.cycleTemplates) &&
      isEmpty(result.dayTemplates) &&
      isEmpty(result.plans) &&
      isEmpty(result.weekTemplates) &&
      isEmpty(result.secondaryExercises)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const combineWithNewExercise = async (newExerciseName: string) => {
    await editChangeToNewLibraryEntry(
      userId,
      firestore,
      exerciseName,
      newExerciseName,
      linkedExercises.current,
    );
  };

  const deleteExercise = async () => {
    await deleteLibraryEntry(userId, firestore, exerciseName);
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

  const toggleArchive = async () => {
    const changesArray = [{key: 'archived', value: !exerciseArchived}];
    await editLibraryEntry(userId, firestore, exerciseName, changesArray);
  };

  return {
    changeExerciseName,
    exerciseArchived,
    deleteLoading,
    exerciseIsUsed,
    combineWithNewExercise,
    toggleArchive,
    deleteExercise,
  };
};
