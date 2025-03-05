import {Chip, Stack} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {light_gray, white} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {muscleTypeArray} from '../../traindoo_shared/types/ExerciseLibrary';
import SimpleSelect from '../SimpleSelect';
import {useExerciseLibraryMuscleGroupsConnect} from './model/useExerciseLibraryMuscleGroupsConnect';

type Props = {
  exerciseName: string;
};

export const LibraryEntryMuscleGroupComponent = ({exerciseName}: Props) => {
  const {exerciseMuscleGroups, removeMuscleGroup, addMuscleGroup} =
    useExerciseLibraryMuscleGroupsConnect(exerciseName);

  const muscleGroupItems: Array<{label: string; value: string}> = [
    {
      label: t('LIBRARY_ADD_MUSCLE_GROUP'),
      value: t('LIBRARY_ADD_MUSCLE_GROUP'),
    },
  ];
  muscleTypeArray?.forEach((element) => {
    if (!exerciseMuscleGroups?.includes(element)) {
      muscleGroupItems.push({label: t(element), value: element});
    }
  });
  return (
    <div style={styles.container}>
      <div style={sharedStyle.textStyle.title2}>
        {t('LIBRARY_MUSCLE_GROUP_TITLE')}
      </div>
      <SimpleSelect
        native={true}
        value={t('LIBRARY_ADD_MUSCLE_GROUP')}
        items={muscleGroupItems}
        onChange={addMuscleGroup}
        style={styles.simpleSelect}
      />

      <Stack direction="row" spacing={1}>
        {exerciseMuscleGroups?.map((group) => (
          <Chip
            key={group}
            label={t(group)}
            onDelete={() => removeMuscleGroup(group)}
            variant="outlined"
            style={styles.label}
            sx={{
              backgroundColor: light_gray,
              ...sharedStyle.textStyle.primary_white_capital,
            }}
          />
        ))}
      </Stack>
    </div>
  );
};

type Style = {
  simpleSelect: CSSProperties;
  container: CSSProperties;
  label: CSSProperties;
};
const styles: Style = {
  label: {color: white},
  simpleSelect: {marginTop: 16, marginBottom: 16},
  container: {marginBottom: 16},
};
