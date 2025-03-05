import {CircularProgress} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {primary_green, red} from '../../styles/colors';
import ButtonCustom from '../Button';
import {LibraryEntryDeleteModal} from './LibraryEntryDeleteModal';
import {useExerciseLibraryDeleteConnect} from './model/useExerciseLibraryDeleteConnect';

type Props = {
  exerciseName: string;
  changeSelectedExercise: (newName: string) => void;
};

export const LibraryEntryDeleteComponent = ({
  exerciseName,
  changeSelectedExercise,
}: Props) => {
  const {
    changeExerciseName,
    exerciseArchived,
    deleteLoading,
    exerciseIsUsed,
    toggleArchive,
    deleteExercise,
    combineWithNewExercise,
  } = useExerciseLibraryDeleteConnect(exerciseName);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = () => {
    exerciseIsUsed().then((result) => {
      if (result) {
        setDeleteOpen(true);
      } else {
        deleteExercise();
        changeSelectedExercise('');
      }
    });
  };

  const deleteButtonText = t('LIBRARY_ENTRY_DELETE_BUTTON');
  const deleteFunction = handleDelete;
  const showDeleteButton = true;

  return (
    <div style={styles.buttonContainer}>
      {deleteLoading ? (
        <CircularProgress color="primary" />
      ) : (
        <>
          {showDeleteButton && (
            <ButtonCustom
              color={red}
              text={deleteButtonText}
              onClick={deleteFunction}
              style={styles.deleteButton}
            />
          )}
          <ButtonCustom
            color={exerciseArchived ? primary_green : red}
            text={
              exerciseArchived
                ? t('LIBRARY_UNARCHIVE_EXERCISE_BUTTON')
                : t('LIBRARY_ARCHIVE_EXERCISE_BUTTON')
            }
            onClick={toggleArchive}
            style={styles.deleteButton}
          />
        </>
      )}

      <LibraryEntryDeleteModal
        handleClose={() => setDeleteOpen(false)}
        open={deleteOpen}
        handleChangeEntry={(newName: string) => {
          combineWithNewExercise(newName);
          setDeleteOpen(false);
        }}
        handleRename={(newName: string) => {
          changeExerciseName(newName);
          setDeleteOpen(false);
        }}
        exerciseName={exerciseName}
        changeSelectedExercise={changeSelectedExercise}
      />
    </div>
  );
};

type Style = {
  buttonContainer: CSSProperties;
  deleteButton: CSSProperties;
};
const styles: Style = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: 24,
  },
  deleteButton: {
    width: 200,
    margin: 8,
  },
};
