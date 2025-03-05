import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useChangeAthleteState} from '../hooks/useChangeAthleteState';
import {
  getAthleteCompetitionDate,
  getAthleteFullName,
  getAthleteStartDay,
  getCurrentAthleteId,
  getCurrentAthleteOneRMCycleSetting,
  getCurrentAthleteOneRMTable,
  getCurrentAthletePercentageRoundTarget,
  getCurrentAthleteUseRir,
  getCurrentAthleteWeeklyNotificationSetting,
} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {
  primary_green,
  red,
  sidebar_color_dark,
  ultra_light_gray,
  white,
} from '../styles/colors';
import {trainerOneRMTableOptions} from '../traindoo_shared/types/User';
import {
  editAthleteCompetitionDate,
  editAthleteOneRMCycleTableSettings,
  editAthleteOneRMPercentageRound,
  editAthleteOneRMTableSettings,
  editAthleteStartDayInWeek,
  editAthleteWeeklyNotification,
  editRirSwitch,
} from '../utils/editingAthleteHelper';
import {
  getIndexForWeekday,
  getWeekdayArray,
  getWeekdayForIndex,
} from '../utils/helper';
import {AlertPopover} from './AlertPopover';
import SimpleSelect from './SimpleSelect';
import TraindooDatePicker from './TraindooDatePicker';

const style = {
  maxHeight: '90vh',
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
};

export const AthleteSettingsPopover = (props: Props) => {
  const athleteFullName = useSelector(getAthleteFullName);
  const athleteStartDay = useSelector(getAthleteStartDay);
  const athleteCompetitionDate = useSelector(getAthleteCompetitionDate);
  const athleteUserId = useSelector(getCurrentAthleteId);
  const oneRMTable = useSelector(getCurrentAthleteOneRMTable);
  const startDayString = getWeekdayForIndex(athleteStartDay);
  const firestore = useFirestore();
  const changeAthleteState = useChangeAthleteState(athleteUserId);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const showOneRMCycle = useSelector(getCurrentAthleteOneRMCycleSetting);
  const oneRMRoundTarget = useSelector(getCurrentAthletePercentageRoundTarget);
  const weeklyNotificationSetting = useSelector(
    getCurrentAthleteWeeklyNotificationSetting,
  );
  const handleStartDayChange = (dayName: string) => {
    const startDayIndex = getIndexForWeekday(dayName);
    if (startDayIndex !== undefined) {
      editAthleteStartDayInWeek(startDayIndex, athleteUserId, firestore);
    }
  };
  const useRir = useSelector((state: RootState) =>
    getCurrentAthleteUseRir(state),
  );

  const handleOneRMChange = (option: string) => {
    let tableOption = trainerOneRMTableOptions.none;
    switch (option) {
      case 'Powerlifting':
        tableOption = trainerOneRMTableOptions.powerlifting;
        break;
      case 'Calisthenics':
        tableOption = trainerOneRMTableOptions.calisthenics;
        break;
      default:
        handleOneRMCycleOptionChange('false');
        break;
    }
    editAthleteOneRMTableSettings(athleteUserId, tableOption, firestore);
  };
  const handleOneRMCycleOptionChange = (option: string) => {
    let tableOption = false;
    switch (option) {
      case 'false':
        tableOption = false;
        break;
      case 'true':
        tableOption = true;
        break;
    }
    editAthleteOneRMCycleTableSettings(athleteUserId, tableOption, firestore);
  };
  const handleChangeRoundTarget = (newValue: string) => {
    editAthleteOneRMPercentageRound(
      athleteUserId,
      parseFloat(newValue),
      firestore,
    );
  };

  const handleRemoveAthlete = async () => {
    changeAthleteState('noTrainer');
    props.handleClose();
  };

  const handleWeeklyNotification = async (value: string) => {
    let option = false;
    switch (value) {
      case 'false':
        option = false;
        break;
      case 'true':
        option = true;
        break;
    }
    await editAthleteWeeklyNotification(option, athleteUserId, firestore);
  };

  const handleRpeAndRir = async (value: string) => {
    let tableOption = false;
    switch (value) {
      case 'false':
        tableOption = false;
        break;
      case 'true':
        tableOption = true;
        break;
    }
    await editRirSwitch(athleteUserId, tableOption, firestore);
  };
  const handleCompetitionDate = async (value: string) => {
    await editAthleteCompetitionDate(value, athleteUserId, firestore);
  };

  getWeekdayArray();
  return (
    <div>
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
              {t('SETTINGS_ATHLETE_TITLE', {
                athlete_name: athleteFullName,
              })}
            </Typography>
            <div style={styles.selectContainer}>
              <SimpleSelect
                style={styles.selectStyle}
                items={getWeekdayArray().map((day) => {
                  return {label: day, value: day};
                })}
                value={startDayString}
                label={t('SETTINGS_ATHLETE_START_DAY')}
                onChange={(value) => {
                  handleStartDayChange(value);
                }}
              />
            </div>
            <TraindooDatePicker
              value={athleteCompetitionDate}
              handleChange={handleCompetitionDate}
              headline={t('SETTINGS_ATHLETE_COMPETITION')}
            />
            <SimpleSelect
              style={styles.selectStyle}
              items={[
                {
                  label: t('SETTINGS_ATHLETE_WEEKLY_NOTIFICATION_ON'),
                  value: 'true',
                },
                {
                  label: t('SETTINGS_ATHLETE_WEEKLY_NOTIFICATION_OFF'),
                  value: 'false',
                },
              ]}
              value={weeklyNotificationSetting.toString()}
              label={t('SETTINGS_ATHLETE_WEEKLY_NOTIFICATION')}
              onChange={(value) => {
                handleWeeklyNotification(value);
              }}
            />
            <SimpleSelect
              style={styles.selectStyle}
              items={[
                {
                  label: t('SETTINGS_ATHLETE_RIR'),
                  value: 'true',
                },
                {
                  label: t('SETTINGS_ATHLETE_RPE'),
                  value: 'false',
                },
              ]}
              value={useRir.toString()}
              label={t('SETTINGS_ATHLETE_RIR_SWITCH_TITLE')}
              onChange={(value) => {
                handleRpeAndRir(value);
              }}
            />
            <SimpleSelect
              style={styles.selectStyle}
              items={[
                {
                  label: t('SETTINGS_ATHLETE_ONERM_TABLE_DONT_DISPLAY'),
                  value: trainerOneRMTableOptions.none,
                },
                {
                  label: t('SETTINGS_ATHLETE_ONERM_TABLE_POWERLIFTING'),
                  value: trainerOneRMTableOptions.powerlifting,
                },
                {
                  label: t('SETTINGS_ATHLETE_ONERM_TABLE_CALISTHENICS'),
                  value: trainerOneRMTableOptions.calisthenics,
                },
              ]}
              value={oneRMTable}
              label={t('SETTINGS_ATHLETE_ONERM_TABLE')}
              onChange={(value) => {
                handleOneRMChange(value);
              }}
            />
            {oneRMTable !== trainerOneRMTableOptions.none && (
              <SimpleSelect
                style={styles.selectStyle}
                items={[
                  {
                    label: t('SETTINGS_ATHLETE_ONERM_TABLE_DONT_DISPLAY'),
                    value: 'false',
                  },
                  {
                    label: t('SETTINGS_ATHLETE_ONERM_TABLE_CYCLE_DISPLAY'),
                    value: 'true',
                  },
                ]}
                value={
                  showOneRMCycle !== undefined
                    ? showOneRMCycle.toString()
                    : 'true'
                }
                label={t('SETTINGS_ATHLETE_ONERM_TABLE_CYCLE_TITLE')}
                onChange={(value) => {
                  handleOneRMCycleOptionChange(value);
                }}
              />
            )}
            {oneRMTable !== trainerOneRMTableOptions.none && showOneRMCycle && (
              <SimpleSelect
                style={styles.selectStyle}
                items={[
                  {
                    label: t(
                      'SETTINGS_ATHLETE_ONERM_ROUND_TARGET_ZERO_ZERO_ONE',
                    ),
                    value: '0.01',
                  },
                  {
                    label: t('SETTINGS_ATHLETE_ONERM_ROUND_TARGET_ZERO_ONE'),
                    value: '0.1',
                  },
                  {
                    label: t('SETTINGS_ATHLETE_ONERM_ROUND_TARGET_ZERO_FIVE'),
                    value: '0.5',
                  },
                  {
                    label: t('SETTINGS_ATHLETE_ONERM_ROUND_TARGET_ONE'),
                    value: '1',
                  },
                  {
                    label: t('SETTINGS_ATHLETE_ONERM_ROUND_TWO_FIVE'),
                    value: '2.5',
                  },
                ]}
                value={oneRMRoundTarget.toString()}
                label={t('SETTINGS_ATHLETE_ONERM_ROUND_TITLE')}
                onChange={(value) => {
                  handleChangeRoundTarget(value);
                }}
              />
            )}
            <div style={styles.selectContainer}>
              <Button
                style={styles.delete}
                onClick={() => setShowDeleteAlert(true)}
              >
                {t('SETTINGS_ATHLETE_REMOVE')}
              </Button>
              <AlertPopover
                open={showDeleteAlert}
                handleClose={() => setShowDeleteAlert(false)}
                confirm={handleRemoveAthlete}
                abortText={t('SETTINGS_ATHLETE_REMOVE_ALERT_CANCEL')}
                confirmText={t('SETTINGS_ATHLETE_REMOVE_ALERT_CONFIRM')}
                headline={t('SETTINGS_ATHLETE_REMOVE_ALERT_TITLE')}
                text={t('SETTINGS_ATHLETE_REMOVE_ALERT_TEXT')}
              />
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <Button
              style={styles.confirm}
              onClick={() => {
                props.handleClose();
              }}
            >
              {t('SETTINGS_ATHLETE_CLOSE')}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  buttonContainer: CSSProperties;
  confirm: CSSProperties;
  cancel: CSSProperties;
  delete: CSSProperties;
  selectContainer: CSSProperties;
  scrollView: CSSProperties;
  selectStyle: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {
    height: 128,
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-end',
    bottom: 0,
    display: 'flex',
    paddingBottom: 8,
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
    paddingBottom: 128,
  },
  selectStyle: {
    marginBottom: 32,
  },
};
