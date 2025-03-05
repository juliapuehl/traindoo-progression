import {t} from 'i18n-js';
import {LibraryEntryTextArea} from './LibraryEntryTextArea';
import {useExerciseLibraryDescriptionConnect} from './model/useExerciseLibraryDescriptionConnect';

type Props = {
  exerciseName: string;
};

export const LibraryEntryDescriptionComponent = ({exerciseName}: Props) => {
  const {exerciseDescription, changeExerciseDescription} =
    useExerciseLibraryDescriptionConnect(exerciseName);
  return (
    <LibraryEntryTextArea
      title={t('LIBRARY_ENTRY_DESCRIPTION_TITLE')}
      initialText={exerciseDescription}
      changeValue={changeExerciseDescription}
    />
  );
};
