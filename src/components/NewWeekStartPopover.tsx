import {Button} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useNewWeekStartDateConnect} from '../hooks/useNewWeekStartDateConnect';
import {
  getDailyCheckArray,
  getLastDailyCheckId,
  getLastWeeklyCheckId,
  getWeeklyCheckArray,
} from '../logic/firestore';
import {getAthleteStartDay, getCurrentAthleteId} from '../store/athleteSlice';
import {
  primary_green,
  sidebar_color_dark,
  ultra_light_gray,
  white,
} from '../styles/colors';
import {editAthleteStartDayInWeek} from '../utils/editingAthleteHelper';
import {getIndexForWeekday, getWeekdayArray} from '../utils/helper';
import SimpleSelect from './SimpleSelect';
import {CollectionDatePicker} from './bottomTrainingMenu/CollectionDatePicker';
import {useCreateCollectionConnect} from './bottomTrainingMenu/model/collection/useCreateCollectionConnect';
import {NewWeekProgressionPopover} from './progressionFeature/NewWeekProgressionPopover';
import {useTrackingSession} from './progressionFeature/model/useTrackingSession';

type Props = {
  handleClose: () => void;
  creationMethod: 'new' | 'copy' | 'progression';
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
export const NewWeekStartPopover = (props: Props) => {
  const {startNewSession} = useTrackingSession();
  const athleteStartDay = useSelector(getAthleteStartDay);
  const dailyCheckArray = useSelector(getDailyCheckArray);
  const lastDailyCheckId = useSelector(getLastDailyCheckId);
  const weeklyCheckArray = useSelector(getWeeklyCheckArray);
  const lastWeeklyCheckId = useSelector(getLastWeeklyCheckId);
  const [selectedDailyCheck, setSelectedDailyCheck] =
    useState(lastDailyCheckId);
  const [selectedWeeklyCheck, setSelectedWeeklyCheck] =
    useState(lastWeeklyCheckId);
  const [openProgressionPopover, setOpenProgressionPopover] = useState(false);

  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);

  const {createNewWeek, copyLastWeek, filterIdsToAdjust} =
    useCreateCollectionConnect();
  const {endDate, excludeArray, minDate, setEndDate, setStartDate, startDate} =
    useNewWeekStartDateConnect();

  const handleStartDayChange = (dayName: string) => {
    const startDayIndex = getIndexForWeekday(dayName);
    if (startDayIndex !== undefined) {
      editAthleteStartDayInWeek(startDayIndex, athleteUserId, firestore);
    }
  };
  const weeklyExists = weeklyCheckArray.find(
    (element) => element.id === selectedWeeklyCheck,
  );
  const dailyExists = dailyCheckArray.find(
    (element) => element.id === selectedDailyCheck,
  );

  const buttonDisabled = !dailyExists || !weeklyExists;
  const handleNewWeek = async () => {
    const startDateMoment = moment(
      moment.utc(moment(startDate).endOf('day')),
    ).startOf('day');
    switch (props.creationMethod) {
      case 'copy':
        await copyLastWeek(
          startDateMoment,
          selectedDailyCheck,
          selectedWeeklyCheck,
        );
        startNewSession(
          'copy week',
          filterIdsToAdjust(startDateMoment).newWeekNumber + 1,
        );
        props.handleClose();
        break;
      case 'new':
        await createNewWeek(
          startDateMoment,
          selectedDailyCheck,
          selectedWeeklyCheck,
        );
        startNewSession(
          'empty week',
          filterIdsToAdjust(startDateMoment).newWeekNumber + 1,
        );
        props.handleClose();
        break;
      case 'progression':
        startNewSession(
          'progression',
          filterIdsToAdjust(startDateMoment).newWeekNumber + 1,
        );
        setOpenProgressionPopover(true);
        break;
    }
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
            {t('PLANNING_NEW_WEEK_POPOVER_TITLE')}
          </Typography>
          <Typography
            id="modal-modal-description"
            align={'center'}
            sx={{mt: 2}}
            color={white}
          >
            {t('PLANNING_NEW_WEEK_POPOVER_TEXT')}
          </Typography>
          <div style={styles.selector}>
            <SimpleSelect
              style={styles.selectorStyle}
              items={weeklyCheckArray.map((element) => {
                return {label: element.name, value: element.id};
              })}
              value={selectedWeeklyCheck}
              label={t('PLANNING_NEW_WEEK_WEEKLY_CHECK')}
              onChange={setSelectedWeeklyCheck}
            />
            <SimpleSelect
              style={styles.selectorStyle}
              items={dailyCheckArray.map((element) => {
                return {label: element.name, value: element.id};
              })}
              value={selectedDailyCheck}
              label={t('PLANNING_NEW_WEEK_DAILY_CHECK')}
              onChange={setSelectedDailyCheck}
            />
            <SimpleSelect
              style={styles.selectorStyle}
              items={getWeekdayArray().map((day) => {
                return {label: day, value: day};
              })}
              value={getWeekdayArray()[athleteStartDay]}
              label={t('SETTINGS_ATHLETE_START_DAY')}
              onChange={handleStartDayChange}
            />
          </div>
          <div style={styles.datePickerContainer}>
            <CollectionDatePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              minDate={minDate}
              excludeDateIntervals={excludeArray}
            />
          </div>

          <div style={styles.optionContainer}>
            <Button
              disabled={buttonDisabled}
              style={styles.cancel}
              onClick={handleNewWeek}
            >
              {t('PLANNING_NEW_WEEK_POPOVER_CONFIRM')}
            </Button>
            <Button
              style={styles.confirm}
              onClick={() => {
                props.handleClose();
              }}
            >
              {t('PLANNING_NEW_WEEK_POPOVER_ABORT')}
            </Button>
          </div>
        </Box>
      </Modal>
      <NewWeekProgressionPopover
        handleClose={() => {
          setOpenProgressionPopover(false);
          props.handleClose();
        }}
        open={openProgressionPopover}
        startDate={moment(moment.utc(moment(startDate).endOf('day'))).startOf(
          'day',
        )}
        selectedDailyId={selectedDailyCheck}
        selectedWeeklyId={selectedWeeklyCheck}
      />
    </div>
  );
};

type Styles = {
  datePickerContainer: CSSProperties;
  selector: CSSProperties;
  confirm: CSSProperties;
  cancel: CSSProperties;
  optionContainer: CSSProperties;
  selectorStyle: CSSProperties;
};

const styles: Styles = {
  datePickerContainer: {
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'center',
  },
  selector: {
    marginTop: 32,
    marginRight: 16,
    marginLeft: 16,
    display: 'flex',
    flexDirection: 'column',
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
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  selectorStyle: {
    marginBottom: 32,
  },
};
