import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {makeStyles} from '@mui/styles';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getTrainerTagNames, getUserId} from '../logic/firestore';
import {
  light_gray,
  primary_green,
  red,
  sidebar_color_dark,
  ultra_light_gray,
  white,
} from '../styles/colors';
import {addNewAthleteTag, addTagToAthlete} from '../utils/editingUserHelper';
import BasicTextField from './BasicTextField';
import Button from './Button';
import {TraindooColorPicker} from './check_editor/TraindooColorPicker';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      color: white,
      backgroundColor: primary_green,
      cursor: 'pointer',
    },
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: sidebar_color_dark,
  border: '2px solid #000',
  overflow: 'hidden',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
  padding: 0,
};

type Props = {
  open: boolean;
  handleClose: () => void;
  athleteUserId?: string;
};

export const AddTagModal = (props: Props) => {
  const [tagColor, setTagColor] = useState<string>();
  const [tagName, setTagName] = useState('');
  const [error, setError] = useState('');
  const userId = useSelector(getUserId);
  const trainerTagNames = useSelector(getTrainerTagNames);
  const firestore = useFirestore();

  const handleAddTag = () => {
    setTimeout(() => {
      setError('');
    }, 4000);
    const newTagName = tagName.trim();
    if (newTagName.length > 25) {
      setError(t('ADD_TAG_ERROR_TO_LONG'));
    } else if (trainerTagNames.includes(tagName)) {
      setError(t('ADD_TAG_ERROR_TAKEN'));
    } else {
      const tag = {
        title: tagName,
        date: moment().toISOString(),
        style: {backgroundColor: tagColor},
      };
      addNewAthleteTag(tag, userId, firestore);
      setTagName('');
      setTagColor(undefined);
      if (props.athleteUserId) {
        addTagToAthlete(tag, userId, props.athleteUserId, firestore);
      }
      props.handleClose();
    }
  };
  return (
    <Modal
      open={props.open}
      onClose={() => props.handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div style={styles.scrollView}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign="center"
            color={white}
          >
            {t('ADD_TAG_TITLE')}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h2"
            textAlign="center"
            color={white}
            style={styles.text}
          >
            {t('ADD_TAG_TEXT')}
          </Typography>
          <TraindooColorPicker
            color={tagColor}
            setColor={setTagColor}
            title={t('ADD_TAG_COLOR_PICKER')}
          />
          <BasicTextField
            label={t('ADD_TAG_NAME')}
            value={tagName}
            onChange={(value) => {
              setError('');
              setTagName(value);
            }}
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
        </div>
        <div style={styles.buttonContainer}>
          <Button
            style={styles.cancel}
            disabled={tagName === '' || !tagColor}
            onClick={() => {
              handleAddTag();
            }}
            text={t('ADD_TAG_CTA_CREATE')}
          />
          <Button
            color={light_gray}
            style={styles.confirm}
            onClick={() => {
              props.handleClose();
            }}
            text={t('ADD_TAG_CTA_CANCEL')}
          />
        </div>
      </Box>
    </Modal>
  );
};

type Styles = {
  buttonContainer: CSSProperties;
  confirm: CSSProperties;
  cancel: CSSProperties;
  delete: CSSProperties;
  selectContainer: CSSProperties;
  scrollView: CSSProperties;
  nameTextField: CSSProperties;
  name: CSSProperties;
  colorContainer: CSSProperties;
  headline: CSSProperties;
  text: CSSProperties;
  colorButton: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {
    height: 60,
    width: '100%',
    position: 'absolute',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    bottom: 0,
    display: 'flex',
    paddingBottom: 32,
    zIndex: 1,
    background:
      'linear-gradient(rgba(41, 45, 57, 0), rgba(41, 45, 57, 0.5),rgba(41, 45, 57, 1) ,rgba(41, 45, 57,1)',
  },
  selectContainer: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
  },
  confirm: {
    color: white,
    background: ultra_light_gray,
  },
  delete: {
    color: white,
    background: red,
  },
  cancel: {
    color: white,
    background: primary_green,
  },
  scrollView: {
    maxHeight: 600,
    overflow: 'auto',
    padding: 32,
    paddingBottom: 60,
  },
  name: {
    display: 'flex',
    alignItems: 'center',
    width: 280,
    marginTop: 2,
    marginLeft: 8,
  },
  nameTextField: {maxHeight: 120, overflow: 'auto'},
  colorContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  headline: {
    marginBottom: 16,
  },
  text: {
    marginBottom: 16,
  },
  colorButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: 'white',
    borderStyle: 'solid',
  },
};
