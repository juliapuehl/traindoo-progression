import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  useDailyCheckNameTaken,
  useGenericCheckNameTaken,
  useWeeklyCheckNameTaken,
} from '../hooks/useCheckNameTaken';
import {getUserId} from '../logic/firestore';
import {primary_green, red, sidebar_color_dark, white} from '../styles/colors';
import {
  createNewDailyCheck,
  createNewGenericCheck,
  createNewWeeklyCheck,
} from '../utils/editingCheckHelper';
import BasicTextField from './BasicTextField';
import ButtonCustom from './Button';

type Props = {
  handleClose: () => void;
  open: boolean;
  changeSelectedCheck: (checkId: string) => void;
  type: 'daily' | 'generic' | 'weekly';
};

export const AddCheckModal = (props: Props) => {
  const [newName, setNewName] = useState('');
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const checkIfDailyNameExists = useDailyCheckNameTaken();
  const checkIfWeeklyNameExists = useWeeklyCheckNameTaken();
  const checkIfGenericNameExists = useGenericCheckNameTaken();
  const [error, setError] = useState('');

  const handleRename = async () => {
    let nameTaken = false;
    switch (props.type) {
      case 'daily':
        nameTaken = checkIfDailyNameExists(newName);
        break;
      case 'weekly':
        nameTaken = checkIfWeeklyNameExists(newName);
        break;
      case 'generic':
        nameTaken = checkIfGenericNameExists(newName);
    }
    const forbiddenChar = newName.match(/[*/[\]~.]/g) !== null;
    if (nameTaken) {
      setError(t('LIBRARY_ADD_MODAL_NAME_TAKEN'));
    } else if (forbiddenChar) {
      setError(t('LIBRARY_ADD_MODAL_FORBIDDEN_CHAR'));
    } else if (newName.length > 80) {
      setError(t('LIBRARY_ADD_MODAL_TOO_LONG'));
    } else {
      setError('');
      let docId;
      const trimName = newName.trim();
      switch (props.type) {
        case 'daily':
          docId = await createNewDailyCheck(trimName, userId, firestore);
          break;
        case 'weekly':
          docId = await createNewWeeklyCheck(trimName, userId, firestore);
          break;
        case 'generic':
          docId = await createNewGenericCheck(trimName, userId, firestore);
      }
      props.changeSelectedCheck(docId);
      props.handleClose();
    }
    setTimeout(() => {
      setError('');
    }, 4000);
  };
  const handleChange = (newText: string) => {
    setError('');
    setNewName(newText);
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
            color={white}
            style={styles.headline}
          >
            {t('CHECKEDITOR_ADD_TEMPLATE')}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h2"
            textAlign="center"
            color={white}
            style={styles.text}
          >
            {t('CHECKEDITOR_ADD_TEMPLATE_TEXT')}
          </Typography>
          <BasicTextField
            label={t('CHECKEDITOR_ADD_TEMPLATE_PLACEHOLDER')}
            onChange={handleChange}
            intercomTarget="add-check-modal-textfield"
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
              text={t('CHECKEDITOR_ADD_TEMPLATE_CONFIRM')}
              onClick={handleRename}
              color={primary_green}
              style={styles.button}
              disabled={!newName}
              intercomTarget="add-check-modal-confirm-button"
            />
            <ButtonCustom
              text={t('CHECKEDITOR_ADD_TEMPLATE_CANCEL')}
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
  headline: CSSProperties;
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
  headline: {
    marginBottom: 16,
  },
  text: {
    marginBottom: 16,
  },
};
