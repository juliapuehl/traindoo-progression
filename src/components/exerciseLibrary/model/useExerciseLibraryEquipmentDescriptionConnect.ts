import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId} from '../../../logic/firestore';
import {getExerciseLibraryEntryEquipmentDescription} from '../../../store/reduxFirestoreLibraryGetter';
import {RootState} from '../../../store/store';
import {editLibraryEntry} from '../../../utils/editingLibraryHelper';

export const useExerciseLibraryEquipmentDescriptionConnect = (
  exerciseName: string,
) => {
  const userId = useSelector(getUserId);
  const firestore = useFirestore();

  const exerciseEquipmentDescription = useSelector((state: RootState) =>
    getExerciseLibraryEntryEquipmentDescription(state, exerciseName),
  );
  const changeExerciseEquipmentDescription = (newText: string) => {
    const changesArray = [{key: 'equipmentDesc', value: newText}];
    editLibraryEntry(userId, firestore, exerciseName, changesArray);
  };

  return {
    exerciseEquipmentDescription,
    changeExerciseEquipmentDescription,
  };
};
