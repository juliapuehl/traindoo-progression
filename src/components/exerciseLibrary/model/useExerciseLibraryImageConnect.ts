import {useSelector} from 'react-redux';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import {getUserId} from '../../../logic/firestore';
import {getExerciseLibraryEntryImages} from '../../../store/reduxFirestoreLibraryGetter';
import {RootState} from '../../../store/store';
import {WebMediaContent} from '../../../traindoo_shared/types/ExerciseLibrary';
import {editLibraryEntry} from '../../../utils/editingLibraryHelper';

export const useExerciseLibraryImageConnect = (exerciseName: string) => {
  const userId = useSelector(getUserId);
  const firestore = useFirestore();
  const firebase = useFirebase();

  const images = useSelector((state: RootState) =>
    getExerciseLibraryEntryImages(state, exerciseName),
  );
  const addImage = (newImage: WebMediaContent) => {
    const changesArray = [{key: 'photoLinks', value: [...images, newImage]}];
    editLibraryEntry(userId, firestore, exerciseName, changesArray);
  };
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const changesArray = [{key: 'photoLinks', value: newImages}];
    editLibraryEntry(userId, firestore, exerciseName, changesArray);
    firebase
      .storage()
      .ref(`user/${userId}/exerciseLibrary/images/${images[index].name}`)
      .delete();
  };

  return {
    images,
    addImage,
    removeImage,
  };
};
