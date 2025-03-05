import {Close} from '@mui/icons-material';
import {Button, IconButton} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {t} from 'i18n-js';
import {Moment} from 'moment';
import {CSSProperties, useState} from 'react';
import {
  background_color_dark,
  medium_gray,
  primary_green,
  white,
} from '../../styles/colors';
import {useCreateCollectionConnect} from '../bottomTrainingMenu/model/collection/useCreateCollectionConnect';
import {useProgressionCalculation} from './model/useProgressionCalculation';
import {useTrackingSession} from './model/useTrackingSession';
import {ProgressionTableComponent} from './ProgressionTableComponent';

type Props = {
  handleClose: () => void;
  open: boolean;
  startDate: Moment;
  selectedDailyId: string;
  selectedWeeklyId: string;
};
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  bgcolor: background_color_dark,
  border: '2px solid #000',
  borderRadius: 8,
  boxShadow: 24,
  p: 1,
};
export const NewWeekProgressionPopover = (props: Props) => {
  const {createProgressionWeek} = useCreateCollectionConnect();
  const {endSession} = useTrackingSession();
  const {loading, progressionData, changeProgressionData} =
    useProgressionCalculation();
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const handleCreateClicked = () => {
    createProgressionWeek(
      props.startDate,
      props.selectedDailyId,
      props.selectedWeeklyId,
      progressionData,
    );
    endSession('Create');
    props.handleClose();
  };

  const closeModal = (closeEvent: string) => {
    endSession(closeEvent);
    props.handleClose();
  };
  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => closeModal('OutsideClick')}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={styles.closeBtnContainer}>
            <IconButton
              style={styles.cancel}
              onClick={() => closeModal('CloseClick')}
            >
              <Close />
            </IconButton>
          </div>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign="center"
            color={white}
          >
            {t('PROGRESSION_POPOVER_TITLE')}
          </Typography>
          {progressionData?.length != 0 ? (
            <Box sx={styles.componentsContainer}>
              <ProgressionTableComponent
                progressionData={progressionData}
                setAllAccepted={setButtonEnabled}
                changeProgressionData={changeProgressionData}
              />
              <div style={styles.createBtnContainer}>
                <Button
                  style={
                    buttonEnabled ? styles.createEnabled : styles.createDisabled
                  }
                  onClick={handleCreateClicked}
                  disabled={!buttonEnabled}
                >
                  {t('PROGRESSION_CREATE')}
                </Button>
              </div>
            </Box>
          ) : (
            <Typography
              id="modal-modal-title"
              component="h2"
              textAlign="center"
              color={white}
              padding="30px"
            >
              {t('PROGRESSION_NO_DATA')}
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  createBtnContainer: CSSProperties;
  closeBtnContainer: CSSProperties;
  componentsContainer: CSSProperties;
  createEnabled: CSSProperties;
  createDisabled: CSSProperties;
  cancel: CSSProperties;
};

const styles: Styles = {
  closeBtnContainer: {
    display: 'flex',
    justifyContent: 'right',
  },
  createBtnContainer: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'right',
  },
  componentsContainer: {
    padding: 2,
  },
  createEnabled: {
    color: white,
    background: primary_green,
  },
  createDisabled: {
    color: white,
    background: medium_gray,
    opacity: 0.5,
  },
  cancel: {
    color: white,
  },
};
