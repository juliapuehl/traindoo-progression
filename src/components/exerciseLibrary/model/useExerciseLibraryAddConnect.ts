import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId} from '../../../logic/firestore';
import {createLibraryEntry} from '../../../utils/editingLibraryHelper';
import {useLibraryEntryNameTaken} from './useExerciseLibraryNameTaken';

export const useExerciseLibraryAddConnect = () => {
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const checkIfNameExists = useLibraryEntryNameTaken();

  const addEntry = async (newName: string) => {
    const nameTaken = checkIfNameExists(newName);
    const forbiddenChar = newName.match(/[*/[\]~.]/g) !== null;
    if (nameTaken) {
      throw 'nameTaken';
    } else if (forbiddenChar) {
      throw 'forbiddenChar';
    } else if (newName.length > 80) {
      throw 'nameTooLong';
    } else {
      await createLibraryEntry(userId, firestore, newName.trim());
    }
  };

  return addEntry;
};
