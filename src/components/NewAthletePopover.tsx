import {Button} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useFirestore} from 'react-redux-firebase';
import {
  primary_green,
  sidebar_color_dark,
  ultra_light_gray,
  white,
} from '../styles/colors';
import {editAthleteStartDayInWeek} from '../utils/editingAthleteHelper';
import {getIndexForWeekday, getWeekdayArray} from '../utils/helper';
import SimpleSelect from './SimpleSelect';

type Props = {
  confirm: (_: any) => void;
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
export const NewAthletePopover = (props: Props) => {
  const firestore = useFirestore();
  const [selectedCycle, setSelectedCycle] = useState('1');
  const [startDay, setStartDay] = useState(0);
  const values = Array.from(Array(100).keys())
    .filter((item) => item > 0)
    .map((item) => {
      return {label: item.toString(), value: item.toString()};
    });
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
            {t('ATHLETES_CARD_NEW_ATHLETE_TITLE')}
          </Typography>
          <Typography id="modal-modal-description" sx={{mt: 2}} color={white}>
            {t('ATHLETES_CARD_CYCLE_TEXT')}
          </Typography>

          <div style={styles.selector}>
            <SimpleSelect
              style={styles.selectorStyle}
              value={selectedCycle}
              items={values}
              label={'Cycle'}
              onChange={setSelectedCycle}
            />
          </div>
          <Typography id="modal-modal-description" sx={{mt: 2}} color={white}>
            {t('ATHLETES_CARD_START_DAY_TEXT')}
          </Typography>
          <div style={styles.selector}>
            <SimpleSelect
              style={styles.selectorStyle}
              items={getWeekdayArray().map((day) => {
                return {label: day, value: day};
              })}
              value={getWeekdayArray()[startDay]}
              label={t('SETTINGS_ATHLETE_START_DAY')}
              onChange={(value) => {
                setStartDay(getIndexForWeekday(value));
              }}
            />
          </div>
          <div style={styles.buttonContainer}>
            <Button
              style={styles.cancel}
              onClick={() => {
                props.handleClose();
              }}
            >
              {t('ATHLETES_CARD_CYCLE_CANCEL')}
            </Button>
            <Button
              disabled={selectedCycle === undefined}
              style={styles.confirm}
              onClick={() => {
                props.handleClose();

                if (startDay !== undefined) {
                  editAthleteStartDayInWeek(
                    startDay,
                    props.athleteUserId,
                    firestore,
                  );
                }

                props.confirm(parseInt(selectedCycle, 10));
              }}
            >
              {t('ATHLETES_CARD_CYCLE_CONFIRM')}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  buttonContainer: CSSProperties;
  selector: CSSProperties;
  confirm: CSSProperties;
  cancel: CSSProperties;
  selectorStyle: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
  },
  selector: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'space-between',
  },
  confirm: {
    color: white,
    background: ultra_light_gray,
  },
  cancel: {
    color: white,
    background: primary_green,
  },
  selectorStyle: {
    marginBottom: 32,
  },
};
