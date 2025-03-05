import {Edit} from '@mui/icons-material';
import {CircularProgress} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {getExerciseLibraryEntryArchived} from '../../store/reduxFirestoreLibraryGetter';
import {RootState} from '../../store/store';
import {white} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import IconWithTooltip from '../IconWithTooltip';
import {LibraryChangeNameModal} from './LibraryChangeNameModal';
import {useExerciseLibraryNameConnect} from './model/useExerciseLibraryNameConnect';

type Props = {
  exerciseName: string;
  changeSelectedExercise: (name: string) => void;
};

export const LibraryEntryNameComponent = ({
  exerciseName,
  changeSelectedExercise,
}: Props) => {
  const {exerciseIsUsed, loadingName, changeExerciseName} =
    useExerciseLibraryNameConnect(exerciseName);
  const exerciseArchived = useSelector((state: RootState) =>
    getExerciseLibraryEntryArchived(state, exerciseName),
  );

  const [edit, setEdit] = useState(false);

  const openChangeModal = () => {
    exerciseIsUsed().then(() => setEdit(true));
  };
  return (
    <div style={styles.exerciseName}>
      {loadingName ? (
        <CircularProgress color="primary" />
      ) : (
        <>
          <div style={sharedStyle.textStyle.title1}>
            {exerciseArchived
              ? t('LIBRARY_ENTRY_ARCHIVED_TITLE', {
                  exercise_name: exerciseName,
                })
              : exerciseName}
          </div>

          <IconWithTooltip
            loading={loadingName}
            muiIcon={Edit}
            style={styles.icon}
            onClick={openChangeModal}
          />
        </>
      )}
      <LibraryChangeNameModal
        handleClose={() => setEdit(false)}
        open={edit}
        changeSelectedExercise={changeSelectedExercise}
        changeExerciseName={changeExerciseName}
      />
    </div>
  );
};

type Styles = {
  exerciseName: CSSProperties;
  icon: CSSProperties;
};

const styles: Styles = {
  exerciseName: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
    color: white,
  },
};
