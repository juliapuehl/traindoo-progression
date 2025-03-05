import {CircularProgress} from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {t} from 'i18n-js';
import moment, {Moment} from 'moment';
import {CSSProperties, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useNewCycleStartDateConnect} from '../hooks/useNewCycleStartDateConnect';
import {
  getCurrentCycleTrainings,
  getCycleTemplates,
  getDailyCheckArray,
  getLastDailyCheckId,
  getLastWeeklyCheckId,
  getUserId,
  getWeeklyCheckArray,
} from '../logic/firestore';
import {
  getAthletePlanningStartDate,
  getAthleteStartDay,
  getAthleteTotalCycle,
  getCurrentAthleteId,
} from '../store/athleteSlice';
import {
  getSelectedCycleIndex,
  setIndexSelectedCycle,
} from '../store/trainingSlice';
import {
  light_gray,
  primary_green,
  sidebar_color_dark,
  ultra_light_gray,
  white,
} from '../styles/colors';
import {
  addToAthleteTotalCycles,
  editAthleteStartDayInWeek,
} from '../utils/editingAthleteHelper';
import {
  createNewCycleWithTemplate,
  deleteCycleTemplate,
} from '../utils/editingTrainingHelper';
import {getIndexForWeekday, getWeekdayArray} from '../utils/helper';
import {AlertPopover} from './AlertPopover';
import ButtonCustom from './Button';
import SimpleSelect from './SimpleSelect';
import {SimpleSelectCycleTemplate} from './SimpleSelectCycleTemplate';
import {CollectionDatePicker} from './bottomTrainingMenu/CollectionDatePicker';

type Props = {
  confirm: () => void;
  handleClose: () => void;
  copyWeek: boolean;
  open: boolean;
  startDayArray: Array<{startDate: Moment; startActiveWeek: Moment}>;
};
const loadingStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
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
export const InsertCycleTemplateModal = (props: Props) => {
  const lastDailyCheckId = useSelector(getLastDailyCheckId);
  const lastWeeklyCheckId = useSelector(getLastWeeklyCheckId);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const deleteIndex = useRef(undefined);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedDailyCheck, setSelectedDailyCheck] =
    useState(lastDailyCheckId);
  const [selectedWeeklyCheck, setSelectedWeeklyCheck] =
    useState(lastWeeklyCheckId);
  const athleteUserId = useSelector(getCurrentAthleteId);
  const userId = useSelector(getUserId);
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const athleteStartDay = useSelector(getAthleteStartDay);
  const athleteTotalCycle = useSelector(getAthleteTotalCycle);
  const cycleTemplates = useSelector(getCycleTemplates);
  const currentCycleTrainings = useSelector(getCurrentCycleTrainings);
  const selectedCycle = useSelector(getSelectedCycleIndex);
  const dailyCheckArray = useSelector(getDailyCheckArray);
  const weeklyCheckArray = useSelector(getWeeklyCheckArray);
  const currentAthletePlanningDate = useSelector(getAthletePlanningStartDate);
  const {startDate, setStartDate, minDate} = useNewCycleStartDateConnect();

  const showCheckbox =
    selectedCycle === athleteTotalCycle && currentCycleTrainings?.length === 0;
  const [overwrite, setOverwrite] = useState(showCheckbox);
  useEffect(() => {
    setOverwrite(showCheckbox);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCycle, props.open]);
  const handleChange = () => {
    setOverwrite(!overwrite);
  };

  const handleStartDayChange = (dayName: string) => {
    const startDayIndex = getIndexForWeekday(dayName);
    if (startDayIndex !== undefined) {
      editAthleteStartDayInWeek(startDayIndex, athleteUserId, firestore);
    }
  };

  const handleInsertCycleTemplate = async () => {
    const newCycleNumber =
      overwrite === true ? athleteTotalCycle : athleteTotalCycle + 1;
    !overwrite
      ? addToAthleteTotalCycles(athleteTotalCycle, athleteUserId, firestore)
      : '';
    dispatch(setIndexSelectedCycle(newCycleNumber));
    setLoading(true);
    await createNewCycleWithTemplate(
      currentAthletePlanningDate,
      selectedTemplate,
      moment(startDate).toISOString(),
      newCycleNumber,
      userId,
      selectedDailyCheck,
      selectedWeeklyCheck,
      athleteUserId,
      firestore,
    );
    setSelectedTemplate('');
    setLoading(false);
    props.handleClose();
  };

  const handleDeleteCycle = () => {
    const templateIdDelete = cycleTemplates[deleteIndex.current].id;
    const templateNameDelete = cycleTemplates[deleteIndex.current].name;
    deleteCycleTemplate(
      templateIdDelete,
      templateNameDelete,
      userId,
      firestore,
    );
    setShowDeleteAlert(false);
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          loading ? () => {} : props.handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {loading ? (
          <Box sx={loadingStyle}>
            <CircularProgress color="info" />
          </Box>
        ) : (
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              textAlign="center"
              color={white}
            >
              {t('INSERT_CYCLE_TEMPLATE_HEADLINE')}
            </Typography>
            <Typography
              id="modal-modal-description"
              align={'center'}
              sx={{mt: 2}}
              color={white}
            >
              {t('INSERT_CYCLE_TEMPLATE_TEXT_ONE')}
            </Typography>
            <div style={styles.selector}>
              <SimpleSelectCycleTemplate
                style={styles.selectorStyle}
                items={cycleTemplates.map((template) => {
                  return {label: template.name, value: template.id};
                })}
                value={selectedTemplate}
                label={t('INSERT_CYCLE_TEMPLATE_CYCLE')}
                onClick={(value) => {
                  setSelectedTemplate(value);
                }}
                onDelete={(index: number) => {
                  deleteIndex.current = index;
                  setShowDeleteAlert(true);
                }}
              />
            </div>
            <Typography
              id="modal-modal-description"
              align={'center'}
              sx={{mt: 2}}
              color={white}
            >
              {t('INSERT_CYCLE_TEMPLATE_TEXT_START')}
            </Typography>
            <div style={styles.selectorGroup}>
              <SimpleSelect
                style={styles.selectorStyle}
                items={getWeekdayArray().map((day) => {
                  return {label: day, value: day};
                })}
                value={getWeekdayArray()[athleteStartDay]}
                label={t('SETTINGS_ATHLETE_START_DAY')}
                onChange={(value) => {
                  handleStartDayChange(value);
                }}
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
                items={weeklyCheckArray.map((element) => {
                  return {label: element.name, value: element.id};
                })}
                value={selectedWeeklyCheck}
                label={t('PLANNING_NEW_WEEK_WEEKLY_CHECK')}
                onChange={setSelectedWeeklyCheck}
              />
            </div>
            <div style={styles.buttonHeadline}>
              <Typography
                id="modal-modal-description"
                align={'center'}
                sx={{mt: 2}}
                color={white}
              >
                {t('INSERT_CYCLE_TEMPLATE_TEXT_START_DATE')}
              </Typography>
              <CollectionDatePicker
                startDate={startDate}
                setStartDate={setStartDate}
                minDate={minDate}
              />
            </div>

            {showCheckbox && (
              <div
                style={
                  (styles.buttonContainer,
                  {
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                  })
                }
              >
                <Typography
                  align={'center'}
                  color={white}
                  sx={{mt: 1.25}}
                  id="modal-modal-title"
                >
                  {t('INSERT_CYCLE_TEMPLATE_OVERWRITE')}
                </Typography>
                <Checkbox
                  checked={overwrite}
                  onChange={handleChange}
                  inputProps={{
                    'aria-label': t('INSERT_CYCLE_TEMPLATE_OVERWRITE'),
                  }}
                  style={(styles.button, {color: primary_green})}
                />
              </div>
            )}

            <div style={styles.buttonContainer}>
              <ButtonCustom
                text={t('INSERT_CYCLE_TEMPLATE_CONFIRM')}
                onClick={handleInsertCycleTemplate}
                color={primary_green}
                style={styles.button}
                disabled={
                  !selectedTemplate ||
                  !selectedDailyCheck ||
                  !selectedWeeklyCheck
                }
              />
              <ButtonCustom
                text={t('LIBRARY_CHANGE_NAME_MODAL_CANCEL')}
                onClick={() => props.handleClose()}
                color={light_gray}
                style={styles.button}
              />
            </div>
          </Box>
        )}
      </Modal>
      <AlertPopover
        open={showDeleteAlert}
        handleClose={() => setShowDeleteAlert(false)}
        confirm={() => handleDeleteCycle()}
        abortText={t('SETTINGS_ATHLETE_REMOVE_ALERT_CANCEL')}
        confirmText={t('INSERT_CYCLE_DELETE_CONFIRM')}
        headline={t('INSERT_CYCLE_DELETE_TITLE')}
        text={t('INSERT_CYCLE_DELETE_TEXT')}
      />
    </div>
  );
};

type Styles = {
  buttonContainer: CSSProperties;
  selector: CSSProperties;
  confirm: CSSProperties;
  cancel: CSSProperties;
  optionContainer: CSSProperties;
  button: CSSProperties;
  selectorStyle: CSSProperties;
  buttonHeadline: CSSProperties;
  selectorGroup: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
    maxWidth: 200,
  },
  selector: {
    marginTop: 16,
    marginRight: 16,
    marginLeft: 16,
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
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  selectorStyle: {marginBottom: 16},
  buttonHeadline: {
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  selectorGroup: {
    marginTop: 32,
    marginRight: 16,
    marginLeft: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
};
