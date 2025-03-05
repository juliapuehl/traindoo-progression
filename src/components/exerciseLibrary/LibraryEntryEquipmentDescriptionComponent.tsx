import {t} from 'i18n-js';
import {LibraryEntryTextArea} from './LibraryEntryTextArea';
import {useExerciseLibraryEquipmentDescriptionConnect} from './model/useExerciseLibraryEquipmentDescriptionConnect';

type Props = {
  exerciseName: string;
};

export const LibraryEntryEquipmentDescriptionComponent = ({
  exerciseName,
}: Props) => {
  const {exerciseEquipmentDescription, changeExerciseEquipmentDescription} =
    useExerciseLibraryEquipmentDescriptionConnect(exerciseName);
  return (
    <LibraryEntryTextArea
      title={t('LIBRARY_ENTRY_DESCRIPTION_EQUIPMENT_TITLE')}
      initialText={exerciseEquipmentDescription}
      changeValue={changeExerciseEquipmentDescription}
    />
  );
};
