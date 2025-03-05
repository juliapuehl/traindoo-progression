import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {dark_gray} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {LibraryEntryDeleteComponent} from './LibraryEntryDeleteComponent';
import {LibraryEntryDescriptionComponent} from './LibraryEntryDescriptionComponent';
import {LibraryEntryEquipmentDescriptionComponent} from './LibraryEntryEquipmentDescriptionComponent';
import {LibraryEntryImagesContainerComponent} from './LibraryEntryImagesContainerComponent';
import {LibraryEntryMuscleGroupComponent} from './LibraryEntryMuscleGroupComponent';
import {LibraryEntryNameComponent} from './LibraryEntryNameComponent';
import {LibraryEntryVideosComponent} from './LibraryEntryVideosComponent';

type Props = {
  exerciseName: string;
  changeSelectedExercise: (name: string) => void;
};

export const LibraryEntryComponent = ({
  exerciseName,
  changeSelectedExercise,
}: Props) => {
  if (exerciseName) {
    return (
      <div style={styles.container}>
        <LibraryEntryNameComponent
          exerciseName={exerciseName}
          changeSelectedExercise={changeSelectedExercise}
        />
        {/* 
        <LibraryEntryCategoryComponent
          onChange={handleCategoryChange}
          onChangeLinked={handleChangeLinkedPrimaryEx}
          value={exercise?.category}
          linkedExercise={exercise?.linkedPrimaryEx}
    />*/}
        <LibraryEntryMuscleGroupComponent exerciseName={exerciseName} />
        <div style={styles.descriptionContainer}>
          <LibraryEntryDescriptionComponent exerciseName={exerciseName} />
          <LibraryEntryEquipmentDescriptionComponent
            exerciseName={exerciseName}
          />
        </div>

        <LibraryEntryImagesContainerComponent exerciseName={exerciseName} />

        <LibraryEntryVideosComponent exerciseName={exerciseName} />
        <LibraryEntryDeleteComponent
          exerciseName={exerciseName}
          changeSelectedExercise={changeSelectedExercise}
        />
      </div>
    );
  } else {
    return (
      <div style={styles.noExercise}>{t('LIBRARY_ENTRY_NO_SELECTION')}</div>
    );
  }
};

type Style = {
  container: CSSProperties;
  noExercise: CSSProperties;
  descriptionContainer: CSSProperties;
};
const styles: Style = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: dark_gray,
    padding: 8,
    borderRadius: 10,
  },

  noExercise: {
    ...sharedStyle.textStyle.secondary_white_capital,
  },
  descriptionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
};
