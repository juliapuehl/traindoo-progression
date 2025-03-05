import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {primary_green, sidebar_color_dark, white} from '../../styles/colors';
import ButtonCustom from '../Button';
import {ExerciseLibrarySearch} from './ExerciseLibrarySearch';

type Props = {
  handleClose: () => void;
  open: boolean;
  exerciseName: string;
  handleRename: (newName: string) => void;
  handleChangeEntry: (newName: string) => void;
  changeSelectedExercise: (newName: string) => void;
};

export const LibraryEntryDeleteModal = ({
  exerciseName,
  open,
  handleClose,
  handleChangeEntry,
  handleRename,
  changeSelectedExercise,
}: Props) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              textAlign="center"
              style={styles.title}
              color={white}
            >
              {t('LIBRARY_ENTRY_DELETE_MODAL_TITLE')}
            </Typography>
            <Typography
              id="modal-modal-title"
              variant="subtitle2"
              component="h2"
              textAlign="center"
              style={styles.text}
              color={white}
            >
              {t('LIBRARY_ENTRY_DELETE_MODAL_USED')}
            </Typography>

            <ExerciseLibrarySearch
              handleChange={handleChangeEntry}
              handleRename={handleRename}
              style={styles.search}
              exerciseName={exerciseName}
              changeSelectedExercise={changeSelectedExercise}
            />

            <div style={styles.buttonContainer}>
              <ButtonCustom
                text={t('LIBRARY_ENTRY_DELETE_MODAL_CANCEL')}
                onClick={handleClose}
                color={primary_green}
                style={styles.button}
              />
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  modal: CSSProperties;
  button: CSSProperties;
  buttonContainer: CSSProperties;
  search: CSSProperties;
  title: CSSProperties;
  text: CSSProperties;
};

const styles: Styles = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: sidebar_color_dark,
    border: '2px solid #000',
    borderRadius: 8,
    boxShadow: '2px 2px 1px rgba(0, 0, 0, 0.2)',
    maxWidth: 400,
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
    maxWidth: 200,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    alignItems: 'center',
  },
  search: {width: '100%', marginBottom: 32},
  title: {marginBottom: 16},
  text: {marginBottom: 16},
};
