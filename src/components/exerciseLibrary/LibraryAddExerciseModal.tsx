import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {
  primary_green,
  red,
  sidebar_color_dark,
  white,
} from '../../styles/colors';
import BasicTextField from '../BasicTextField';
import ButtonCustom from '../Button';
import {useExerciseLibraryAddConnect} from './model/useExerciseLibraryAddConnect';

type Props = {
  handleClose: () => void;
  open: boolean;
  onCreate: (newId: string) => void;
};

export const LibraryAddExerciseModal = (props: Props) => {
  const [name, setName] = useState('');
  const addEntry = useExerciseLibraryAddConnect();
  const [error, setError] = useState('');

  const handleNewEntry = async () => {
    try {
      await addEntry(name);
      setError('');
      props.handleClose();
    } catch (e) {
      console.log('error', e);
      if (e === 'nameTaken') {
        setError(t('LIBRARY_ADD_MODAL_NAME_TAKEN'));
      } else if (e === 'nameTooLong') {
        setError(t('LIBRARY_ADD_MODAL_TOO_LONG'));
      } else if (e === 'forbiddenChar') {
        setError(t('LIBRARY_ADD_MODAL_FORBIDDEN_CHAR'));
      }
    }

    setTimeout(() => {
      setError('');
    }, 4000);
  };
  const handleChange = (newName: string) => {
    setError('');
    setName(newName);
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => props.handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            textAlign="center"
            style={styles.title}
            color={white}
          >
            {t('LIBRARY_ADD_MODAL_TITLE')}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h2"
            textAlign="center"
            style={styles.text}
            color={white}
          >
            {t('LIBRARY_ADD_MODAL_TEXT')}
          </Typography>
          <BasicTextField
            label={t('LIBRARY_ADD_MODAL_PLACEHOLDER')}
            onChange={handleChange}
            // Class name is required to identify object with intercom
            intercomTarget={'library-add-modal-textfield'}
          />
          {error && (
            <Typography
              id="modal-modal-title"
              variant="subtitle2"
              component="h2"
              textAlign="center"
              style={styles.text}
              color={red}
            >
              {error}
            </Typography>
          )}
          <div style={styles.buttonContainer}>
            <ButtonCustom
              text={t('LIBRARY_ADD_MODAL_CONFIRM')}
              onClick={handleNewEntry}
              color={primary_green}
              style={styles.button}
              disabled={!name}
              intercomTarget={'library-add-modal-confirm-button'}
            />
            <ButtonCustom
              text={t('LIBRARY_ADD_MODAL_CANCEL')}
              onClick={() => props.handleClose()}
              color={primary_green}
              style={styles.button}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  modal: CSSProperties;
  button: CSSProperties;
  buttonContainer: CSSProperties;
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
  title: {marginBottom: 16},
  text: {marginBottom: 16},
};
