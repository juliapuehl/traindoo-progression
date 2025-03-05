import {
  ExerciseLibraryEntryType,
  ExerciseLibraryType,
} from '../traindoo_shared/types/ExerciseLibrary';
import {RootState} from './store';

export const getExerciseLibrary = (state: RootState): ExerciseLibraryType => {
  return state.firestore.data.exerciseLibrary;
};
export const getExerciseLibraryPrimarySecondary = (state: RootState) => {
  const library = getExerciseLibrary(state);
  const primaryExercises: ExerciseLibraryEntryType[] = [];
  const secondaryExercises: ExerciseLibraryEntryType[] = [];

  if (library) {
    Object.keys(library)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .forEach((key) => {
        if (library[key].category === 'LIBRARY_PRIMARY_EXERCISE') {
          primaryExercises.push(library[key]);
        } else {
          secondaryExercises.push(library[key]);
        }
      });
  }
  return {primaryExercises, secondaryExercises};
};
export const getExerciseLibraryNames = (state: RootState) => {
  const library = getExerciseLibrary(state);
  if (library) {
    return Object.keys(library).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );
  } else {
    return [];
  }
};
export const getExerciseLibraryEntryArchived = (
  state: RootState,
  exerciseName: string,
) => {
  return getExerciseLibrary(state)?.[exerciseName]?.archived ?? false;
};
export const getExerciseLibraryEntryDescription = (
  state: RootState,
  exerciseName: string,
) => {
  return getExerciseLibrary(state)?.[exerciseName]?.description ?? '';
};
export const getExerciseLibraryEntryEquipmentDescription = (
  state: RootState,
  exerciseName: string,
) => {
  return getExerciseLibrary(state)?.[exerciseName]?.equipmentDesc ?? '';
};
export const getExerciseLibraryEntryImages = (
  state: RootState,
  exerciseName: string,
) => {
  return getExerciseLibrary(state)?.[exerciseName]?.photoLinks ?? [];
};
export const getExerciseLibraryEntryVideos = (
  state: RootState,
  exerciseName: string,
) => {
  return getExerciseLibrary(state)?.[exerciseName]?.videoLinks ?? [];
};
export const getExerciseLibraryEntryMuscleGroups = (
  state: RootState,
  exerciseName: string,
) => {
  return getExerciseLibrary(state)?.[exerciseName]?.muscleGroup ?? [];
};
export const getExerciseLibraryEntry = (
  state: RootState,
  exerciseName: string,
) => {
  return getExerciseLibrary(state)?.[exerciseName];
};
