import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentCycleTrainings, getUserId} from '../logic/firestore';
import {primary_green, red, sidebar_color_dark, white} from '../styles/colors';
import {createCycleTemplate} from '../utils/editingTrainingHelper';
import BasicTextField from './BasicTextField';
import ButtonCustom from './Button';

type Props = {
  handleClose: () => void;
  open: boolean;
  cycleTemplateNames: string[];
};

export const NewCycleTemplateModal = (props: Props) => {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const cycleTrainings = useSelector(getCurrentCycleTrainings);
  const userId = useSelector(getUserId);

  const firestore = useFirestore();

  const handleCreateTemplate = () => {
    setTimeout(() => {
      setError('');
    }, 5000);
    const forbiddenChar = newName.match(/[*/[\]~.]/g) !== null;
    if (forbiddenChar) {
      setError(t('LIBRARY_ADD_MODAL_FORBIDDEN_CHAR'));
      return;
    }
    if (newName.length > 80) {
      setError(t('LIBRARY_ADD_MODAL_TOO_LONG'));
    }
    if (props.cycleTemplateNames.includes(newName)) {
      setError(t('CREATE_CYCLE_TEMPLATE_ALREADY_EXISTS'));
      return;
    }

    createCycleTemplate(cycleTrainings, newName, userId, firestore)
      .then(() => props.handleClose())
      .catch(() => setError(t('PLANNING_WEEK_TEMPLATE_ADD_ALERT_OVERLAPPING')));
  };
  const handleClose = () => props.handleClose();
  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
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
            {t('CREATE_CYCLE_TEMPLATE_HEADLINE')}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h2"
            textAlign="center"
            color={white}
            style={styles.text}
          >
            {t('CREATE_CYCLE_TEMPLATE_TEXT')}
          </Typography>
          <BasicTextField
            label={t('CREATE_CYCLE_TEMPLATE_PLACEHOLDER')}
            onChange={setNewName}
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
              text={t('CREATE_CYCLE_TEMPLATE_CONFIRM')}
              onClick={handleCreateTemplate}
              color={primary_green}
              style={styles.button}
              disabled={!newName || newName === ''}
            />
            <ButtonCustom
              text={t('LIBRARY_CHANGE_NAME_MODAL_CANCEL')}
              onClick={handleClose}
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
