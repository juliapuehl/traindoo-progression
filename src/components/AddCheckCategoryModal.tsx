import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {v4 as uuidv4} from 'uuid';
import {useCheckCategoryTaken} from '../hooks/useCheckCategoryTaken';
import {getUserId} from '../logic/firestore';
import {
  addCategoryToCheck,
  getSelectedDailyCheckTemplateId,
} from '../store/checkEditorSlice';
import {primary_green, red, sidebar_color_dark, white} from '../styles/colors';
import {addCheckCategoryLibrary} from '../utils/editingCheckHelper';
import BasicTextField from './BasicTextField';
import ButtonCustom from './Button';

type Props = {
  handleClose: () => void;
  open: boolean;
  index: number;
  type: 'daily' | 'weekly' | 'generic';
};

export const AddCheckCategoryModal = (props: Props) => {
  const [newName, setNewName] = useState('');
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const checkIfNameExists = useCheckCategoryTaken();
  const [error, setError] = useState('');
  const checkId = useSelector(getSelectedDailyCheckTemplateId);
  const addCategory = useSelector(addCategoryToCheck);

  const handleRename = async () => {
    const nameTaken = checkIfNameExists(newName);
    const forbiddenChar = newName.match(/[*/[\]~.]/g) !== null;
    if (nameTaken) {
      setError(t('LIBRARY_ADD_MODAL_NAME_TAKEN'));
    } else if (forbiddenChar) {
      setError(t('LIBRARY_ADD_MODAL_FORBIDDEN_CHAR'));
    } else if (newName.length > 80) {
      setError(t('LIBRARY_ADD_MODAL_TOO_LONG'));
    } else {
      setError('');
      const categoryId = uuidv4();
      await addCheckCategoryLibrary(
        newName.trim(),
        categoryId,
        userId,
        firestore,
      );
      addCategory(
        newName.trim(),
        categoryId,
        checkId,
        props.index,
        userId,
        firestore,
        props.type,
      );
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
            {t('CHECKEDITOR_ADD_CATEGORY')}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h2"
            textAlign="center"
            color={white}
            style={styles.text}
          >
            {t('CHECKEDITOR_ADD_CATEGORY_TEXT')}
          </Typography>
          <BasicTextField
            label={t('CHECKEDITOR_ADD_CATEGORY_PLACEHOLDER')}
            onChange={handleChange}
            autoFocus
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
              text={t('CHECKEDITOR_ADD_CATEGORY_CONFIRM')}
              onClick={handleRename}
              color={primary_green}
              style={styles.button}
              disabled={!newName}
            />
            <ButtonCustom
              text={t('CHECKEDITOR_ADD_CATEGORY_CANCEL')}
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
