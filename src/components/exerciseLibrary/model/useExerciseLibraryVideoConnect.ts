import {useSelector} from 'react-redux';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import {getUserId} from '../../../logic/firestore';
import {getExerciseLibraryEntryVideos} from '../../../store/reduxFirestoreLibraryGetter';

import {RootState} from '../../../store/store';
import {WebMediaContent} from '../../../traindoo_shared/types/ExerciseLibrary';
import {editLibraryEntry} from '../../../utils/editingLibraryHelper';

export const useExerciseLibraryVideoConnect = (exerciseName: string) => {
  const userId = useSelector(getUserId);
  const firestore = useFirestore();
  const firebase = useFirebase();
  const videos =
    useSelector((state: RootState) =>
      getExerciseLibraryEntryVideos(state, exerciseName),
    ) ?? [];
  const addVideo = (newVideo: WebMediaContent) => {
    const changesArray = [{key: 'videoLinks', value: [...videos, newVideo]}];
    editLibraryEntry(userId, firestore, exerciseName, changesArray);
  };
  const deleteVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);

    const changesArray = [{key: 'videoLinks', value: newVideos}];
    editLibraryEntry(userId, firestore, exerciseName, changesArray);
    firebase
      .storage()
      .ref(`user/${userId}/exerciseLibrary/videos/${videos[index].name}`)
      .delete();
  };

  return {
    videos,
    addVideo,
    deleteVideo,
  };
};
