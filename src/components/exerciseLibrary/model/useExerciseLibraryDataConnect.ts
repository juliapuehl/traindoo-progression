import {useSelector} from 'react-redux';
import {getExerciseLibrary} from '../../../store/reduxFirestoreLibraryGetter';

export const useExerciseLibraryDataConnect = () => {
  const exerciseLibraryArray = useSelector(getExerciseLibrary);
  return exerciseLibraryArray;
};
