import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId} from '../../../logic/firestore';
import {getExerciseLibraryEntryDescription} from '../../../store/reduxFirestoreLibraryGetter';
import {RootState} from '../../../store/store';
import {editLibraryEntry} from '../../../utils/editingLibraryHelper';

export const useExerciseLibraryDescriptionConnect = (exerciseName: string) => {
  const userId = useSelector(getUserId);
  const firestore = useFirestore();
  const exerciseDescription = useSelector((state: RootState) =>
    getExerciseLibraryEntryDescription(state, exerciseName),
  );
  const changeExerciseDescription = (newText: string) => {
    const changesArray = [{key: 'description', value: newText}];
    editLibraryEntry(userId, firestore, exerciseName, changesArray);
  };

  return {
    exerciseDescription,
    changeExerciseDescription,
  };
};
