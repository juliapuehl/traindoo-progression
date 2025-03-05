import {Box, Modal, Typography} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useChangeAthleteState} from '../hooks/useChangeAthleteState';
import {
  primary_green,
  red,
  sidebar_color_dark,
  ultra_light_gray,
  white,
} from '../styles/colors';
import {AthleteActiveState} from '../traindoo_shared/types/User';
import {AlertPopover} from './AlertPopover';
import Button from './Button';

type Props = {
  handleClose: () => void;
  athleteUserId: string;
  open: boolean;
};
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: sidebar_color_dark,
  border: '2px solid #000',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
};

export const PendingAthletePopover = (props: Props) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const changeAthleteState = useChangeAthleteState(props.athleteUserId);
  const handleAthleteStateChange = async (newState: AthleteActiveState) => {
    changeAthleteState(newState);
    props.handleClose();
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => props.handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign="center"
            color={white}
          >
            {t('ATHLETE_STATE_PENDING_TITLE')}
          </Typography>
          <Typography
            id="modal-modal-description"
            align={'center'}
            sx={{mt: 2}}
            color={white}
          >
            {t('ATHLETE_STATE_PENDING_TEXT')}
          </Typography>
          <div style={styles.optionContainer}>
            <Button
              style={styles.button}
              onClick={() => {
                handleAthleteStateChange('active');
              }}
              color={primary_green}
              text={t('ATHLETE_STATE_PENDING_ACTIVATE')}
            />
            <Button
              style={styles.button}
              onClick={() => {
                setShowDeleteAlert(true);
              }}
              color={red}
              text={t('ATHLETE_STATE_PENDING_DELETE')}
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
          <div style={styles.buttonContainer}>
            <Button
              onClick={() => {
                props.handleClose();
              }}
              color={ultra_light_gray}
              text={t('ATHLETE_INACTIVE_CANCEL')}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  buttonContainer: CSSProperties;
  selector: CSSProperties;
  optionContainer: CSSProperties;
  button: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'center',
  },
  selector: {
    marginTop: 32,
    marginRight: 16,
    marginLeft: 16,
    display: 'flex',
    justifyContent: 'space-between',
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
};
