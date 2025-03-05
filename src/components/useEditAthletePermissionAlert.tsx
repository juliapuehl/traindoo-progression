import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  getDontShowEditAthleteValuesWarning,
  getUserId,
  specificUserQuery,
} from '../logic/firestore';
import {RootState} from '../store/store';
import {setAthleteEditTime} from '../store/trainingSlice';
import {primary_green, ultra_light_gray, white} from '../styles/colors';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const useEditAthletePermissionAlert = (onConfirm: () => void) => {
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const userId = useSelector(getUserId);
  const path = 'trainer.webSettings.dontShowEditAthleteValuesWarning';
  const dontShowEditAthleteValuesWarning = useSelector((state: RootState) =>
    getDontShowEditAthleteValuesWarning(state),
  );

  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [allowChange, setAllowChange] = useState(
    dontShowEditAthleteValuesWarning,
  );

  const handleClickAlert = () => {
    !allowChange ? setShowWarning(true) : onConfirm();
  };

  const pressConfirm = () => {
    setAllowChange(true);
    setShowWarning(false);
    dispatch(setAthleteEditTime(moment().toISOString()));
    onConfirm();
    if (dontAskAgain) {
      firestore.update(specificUserQuery(userId), {
        [path]: true,
      });
    }
  };
  const pressCancel = () => {
    setShowWarning(false);
  };

  const AlertModal = (
    <div>
      <Modal
        open={showWarning}
        onClose={pressCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {t('ATHLETE_PERMISSION_ALERT_WARNING')}
          </Typography>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            {t('ATHLETE_PERMISSION_ALERT_TEXT')}
          </Typography>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            {t('ATHLETE_PERMISSION_ALERT_TEXT_2')}
          </Typography>
          <div style={styles.buttonContainer}>
            <Button style={styles.confirm} onClick={pressConfirm}>
              {t('ATHLETE_PERMISSION_ALERT_CONFIRM')}
            </Button>
            <Button style={styles.cancel} onClick={pressCancel}>
              {t('ATHLETE_PERMISSION_ALERT_CANCEL')}
            </Button>
          </div>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={dontAskAgain}
                  onChange={() => {
                    setDontAskAgain(!dontAskAgain);
                  }}
                />
              }
              label={t('ATHLETE_PERMISSION_ALERT_DONT_ASK_AGAIN')}
            />
          </FormGroup>
        </Box>
      </Modal>
    </div>
  );
  return {AlertModal, handleClickAlert};
};

type Styles = {
  buttonContainer: CSSProperties;
  confirm: CSSProperties;
  cancel: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
  },
  confirm: {
    color: white,
    background: primary_green,
  },
  cancel: {
    color: white,
    background: ultra_light_gray,
  },
};
