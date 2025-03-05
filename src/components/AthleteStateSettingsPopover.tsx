import {Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useChangeAthleteState} from '../hooks/useChangeAthleteState';
import {
  red,
  sidebar_color_dark,
  ultra_light_gray,
  white,
} from '../styles/colors';
import {AthleteActiveState} from '../traindoo_shared/types/User';
import {AddTagModal} from './AddTagModal';
import {AlertPopover} from './AlertPopover';
import Button from './Button';
import {TagSelector} from './TagSelector';

const style = {
  position: 'absolute' as const,
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
  athleteUserId: string;
};

export const AthleteStateSettingsPopover = (props: Props) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [openTagModal, setOpenTagModal] = useState(false);
  const changeAthleteState = useChangeAthleteState(props.athleteUserId);

  const handleAthleteStateChange = async (newState: AthleteActiveState) => {
    changeAthleteState(newState);
    props.handleClose();
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
            style={styles.headline}
          >
            {t('ATHLETE_STATE_TITLE')}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h2"
            textAlign="center"
            color={white}
            style={styles.text}
          >
            {t('ATHLETE_STATE_TEXT')}
          </Typography>
          <div style={styles.optionContainer}>
            <Button
              style={styles.button}
              onClick={() => handleAthleteStateChange('inactive')}
              color={ultra_light_gray}
              text={t('ATHLETE_STATE_DEACTIVATE')}
            />
            <Button
              style={styles.button}
              onClick={() => {
                setShowDeleteAlert(true);
              }}
              color={red}
              text={t('ATHLETE_INACTIVE_DELETE')}
            />
            <AlertPopover
              open={showDeleteAlert}
              handleClose={() => setShowDeleteAlert(false)}
              confirm={() => handleAthleteStateChange('noTrainer')}
              abortText={t('SETTINGS_ATHLETE_REMOVE_ALERT_CANCEL')}
              confirmText={t('SETTINGS_ATHLETE_REMOVE_ALERT_CONFIRM')}
              headline={t('SETTINGS_ATHLETE_REMOVE_ALERT_TITLE')}
              text={t('SETTINGS_ATHLETE_REMOVE_ALERT_TEXT')}
            />
          </div>
          <Typography
            variant="subtitle1"
            component="h2"
            textAlign="center"
            color={white}
            style={styles.headlineTag}
          >
            {t('TAG_SELECTOR_TITLE')}
          </Typography>
          <TagSelector
            style={styles.name}
            textFieldStyle={styles.nameTextField}
            openNewTag={() => setOpenTagModal(true)}
            athleteUserId={props.athleteUserId}
          />
          <Button
            onClick={() => {
              props.handleClose();
            }}
            color={ultra_light_gray}
            text={t('SETTINGS_ATHLETE_CLOSE')}
          />
        </div>
        <AddTagModal
          athleteUserId={props.athleteUserId}
          open={openTagModal}
          handleClose={() => setOpenTagModal(false)}
        />
      </Box>
    </Modal>
  );
};

type Styles = {
  buttonContainer: CSSProperties;
  selectContainer: CSSProperties;
  scrollView: CSSProperties;
  nameTextField: CSSProperties;
  name: CSSProperties;
  colorContainer: CSSProperties;
  headline: CSSProperties;
  text: CSSProperties;
  optionContainer: CSSProperties;
  button: CSSProperties;
  headlineTag: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {},
  selectContainer: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
  },
  scrollView: {
    maxHeight: 600,
    padding: 32,
    paddingBottom: 60,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  optionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    minWidth: 140,
    marginTop: 16,
  },
  headlineTag: {
    marginTop: 32,
  },
};
