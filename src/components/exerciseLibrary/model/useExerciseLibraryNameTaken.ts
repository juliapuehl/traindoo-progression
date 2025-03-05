import {useSelector} from 'react-redux';
import {getExerciseLibraryNames} from '../../../store/reduxFirestoreLibraryGetter';

export const useLibraryEntryNameTaken = () => {
  const libraryEntryNames = useSelector(getExerciseLibraryNames);
  const checkIfTaken = (exerciseName: string) => {
    const index = libraryEntryNames.findIndex(
      (entry) => entry.trim() === exerciseName.trim(),
    );
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  };
  return checkIfTaken;
};
