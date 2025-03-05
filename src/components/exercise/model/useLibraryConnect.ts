import {t} from 'i18n-js';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId} from '../../../logic/firestore';
import {getExerciseLibrary} from '../../../store/reduxFirestoreLibraryGetter';
import {createLibraryEntry} from '../../../utils/editingLibraryHelper';
import {useLibraryEntryNameTaken} from '../../exerciseLibrary/model/useExerciseLibraryNameTaken';

export const useLibraryConnect = () => {
  const library = useSelector(getExerciseLibrary);

  const searchStrings = useMemo(
    () =>
      library
        ? Object.values(library)
            .sort((a, b) =>
              a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase()),
            )
            .filter((entry) => !entry.archived)
            .map((entry) => entry.name)
        : [],
    [library],
  );

  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const checkIfNameExists = useLibraryEntryNameTaken();

  const checkExerciseName = (
    name: string,
  ): {
    success: boolean;
    status: 'taken' | 'forbiddenChar' | 'tooLong' | 'accepted';
    message?: string;
  } => {
    if (!name) {
      return {success: false, status: 'forbiddenChar'};
    }
    if (checkIfNameExists(name))
      return {
        success: false,
        status: 'taken',
        message: t('LIBRARY_ADD_MODAL_NAME_TAKEN'),
      };

    if (name?.match(/[*/[\]~.]/g) !== null)
      return {
        success: false,
        status: 'forbiddenChar',
        message: t('LIBRARY_ADD_MODAL_FORBIDDEN_CHAR'),
      };

    if (name.length > 80)
      return {
        success: false,
        status: 'tooLong',
        message: t('LIBRARY_ADD_MODAL_TOO_LONG'),
      };

    return {
      success: true,
      status: 'accepted',
    };
  };

  const createNewExercise = async (name: string) => {
    console.log('createNewExercise', name, userId);
    await createLibraryEntry(userId, firestore, name.trim());
  };

  return {
    searchStrings,
    createNewExercise,
    checkExerciseName,
  };
};
