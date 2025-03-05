import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId} from '../../../logic/firestore';
import {getExerciseLibraryEntryMuscleGroups} from '../../../store/reduxFirestoreLibraryGetter';

import {RootState} from '../../../store/store';
import {editLibraryEntry} from '../../../utils/editingLibraryHelper';

export const useExerciseLibraryMuscleGroupsConnect = (exerciseName: string) => {
  const userId = useSelector(getUserId);
  const firestore = useFirestore();
  const exerciseMuscleGroups = useSelector((state: RootState) =>
    getExerciseLibraryEntryMuscleGroups(state, exerciseName),
  );
  const addMuscleGroup = (muscleGroup: string) => {
    const newMuscleGroup = [...exerciseMuscleGroups, muscleGroup];
    const changesArray = [{key: 'muscleGroup', value: newMuscleGroup}];
    editLibraryEntry(userId, firestore, exerciseName, changesArray);
  };
  const removeMuscleGroup = (muscleGroup: string) => {
    const newMuscleGroup = exerciseMuscleGroups.filter(
      (group) => group !== muscleGroup,
    );
    const changesArray = [{key: 'muscleGroup', value: newMuscleGroup}];
    editLibraryEntry(userId, firestore, exerciseName, changesArray);
  };
  return {exerciseMuscleGroups, addMuscleGroup, removeMuscleGroup};
};
