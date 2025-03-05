import {Refresh} from '@mui/icons-material';
import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useCycleTargetConnect} from '../hooks/useCycleTargetConnect';
import {
  getCurrentAthleteId,
  getCurrentAthleteOneRMCycleSetting,
  getCurrentAthleteOneRMCycleValues,
  getCurrentAthleteOneRMTable,
  getCurrentAthleteOneRMValues,
} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {getSelectedCycleIndex} from '../store/trainingSlice';
import {dark_gray, ultra_light_gray} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {trainerOneRMTableOptions} from '../traindoo_shared/types/User';
import {useCalculateLoadBackend} from '../traindoo_shared/units/useCalculateLoadBackend';
import {useCalculateLoadFrontend} from '../traindoo_shared/units/useCalculateLoadFrontend';
import {
  setAthleteOneRM,
  setAthleteOneRMCycle,
} from '../utils/editingAthleteHelper';
import IconWithTooltip from './IconWithTooltip';
import OneRmInput from './OneRmInput';

const OneRMCard = () => {
  const calculateLoadFrontend = useCalculateLoadFrontend();
  const calculateLoadBackend = useCalculateLoadBackend();
  const oneRMTable = useSelector(getCurrentAthleteOneRMTable);
  const oneRMValues = useSelector(getCurrentAthleteOneRMValues);
  const selectedCycleIndex = useSelector(getSelectedCycleIndex);
  const {
    displayUpdateIcon,
    getExercisesWithPrimaryExercise,
    processingPrimaryExercise,
    updateCycleTargetExercises,
  } = useCycleTargetConnect();
  const oneRMCycleValues = useSelector((state: RootState) =>
    getCurrentAthleteOneRMCycleValues(state, selectedCycleIndex),
  );
  const showOneRMCycle = useSelector((state: RootState) =>
    getCurrentAthleteOneRMCycleSetting(state),
  );
  const athleteUserId = useSelector(getCurrentAthleteId);
  const selectedCycle = useSelector(getSelectedCycleIndex);
  const firestore = useFirestore();
  const handleChange = (value: number, path: string) => {
    const newValue = parseFloat(calculateLoadBackend(value).toString());
    setAthleteOneRM(newValue, path, athleteUserId, firestore);
  };
  const handleChangeCycle = (value: number, path: string) => {
    const cyclePath = 'cycle' + selectedCycle + '.' + path;
    // New values get calculated with frontend value => improved rounding
    getExercisesWithPrimaryExercise(path, value);
    const newValue = parseFloat(calculateLoadBackend(value).toString());
    setAthleteOneRMCycle(newValue, cyclePath, athleteUserId, firestore);
  };
  const generateOneRmInput = () => {
    return (
      <div style={styles.valueContainer}>
        <span style={sharedStyle.textStyle.primary_white_capital}>
          {t('PLANNING_ONERM_GENERAL_TITLE')}
        </span>
        {oneRMTable === trainerOneRMTableOptions.calisthenics && (
          <div>
            <OneRmInput
              key={'input1'}
              uploadValue={(value: number) =>
                handleChange(value, 'oneRM_muscleUp')
              }
              label={t('PLANNING_ONERM_MUSCLE_UP')}
              value={calculateLoadFrontend(oneRMValues?.oneRM_muscleUp)}
            />
            <OneRmInput
              key={'input2'}
              uploadValue={(value: number) => handleChange(value, 'oneRM_dip')}
              label={t('PLANNING_ONERM_DIP')}
              value={calculateLoadFrontend(oneRMValues?.oneRM_dip)}
            />
            <OneRmInput
              key={'input3'}
              uploadValue={(value: number) =>
                handleChange(value, 'oneRM_pullUp')
              }
              label={t('PLANNING_ONERM_PULL_UP')}
              value={calculateLoadFrontend(oneRMValues?.oneRM_pullUp)}
            />
            <OneRmInput
              key={'input4'}
              uploadValue={(value: number) =>
                handleChange(value, 'oneRM_squat')
              }
              label={t('PLANNING_ONERM_SQUAT')}
              value={calculateLoadFrontend(oneRMValues?.oneRM_squat)}
            />
          </div>
        )}
        {oneRMTable === trainerOneRMTableOptions.powerlifting && (
          <div>
            <OneRmInput
              key={'input5'}
              uploadValue={(value: number) =>
                handleChange(value, 'oneRM_squat')
              }
              label={t('PLANNING_ONERM_SQUAT')}
              value={calculateLoadFrontend(oneRMValues?.oneRM_squat)}
            />
            <OneRmInput
              key={'input6'}
              uploadValue={(value: number) =>
                handleChange(value, 'oneRM_bench')
              }
              label={t('PLANNING_ONERM_BENCHPRESS')}
              value={calculateLoadFrontend(oneRMValues?.oneRM_bench)}
            />
            <OneRmInput
              key={'input7'}
              uploadValue={(value: number) =>
                handleChange(value, 'oneRM_deadlift')
              }
              label={t('PLANNING_ONERM_DEADLIFT')}
              value={calculateLoadFrontend(oneRMValues?.oneRM_deadlift)}
            />
          </div>
        )}
      </div>
    );
  };
  const generateCycleOneRmInput = () => {
    return (
      <div style={styles.valueCycleOuterContainer}>
        <div style={styles.valueCycleContainer}>
          <span style={sharedStyle.textStyle.primary_white_capital}>
            {t('PLANNING_ONERM_CYCLE_TITLE')}
          </span>
          {oneRMTable === trainerOneRMTableOptions.calisthenics && (
            <div>
              <OneRmInput
                uploadValue={(value: number) =>
                  handleChangeCycle(value, 'oneRM_muscleUp')
                }
                label={t('PLANNING_ONERM_MUSCLE_UP')}
                value={calculateLoadFrontend(oneRMCycleValues?.oneRM_muscleUp)}
                hideLabel
              />
              <OneRmInput
                uploadValue={(value: number) =>
                  handleChangeCycle(value, 'oneRM_dip')
                }
                label={t('PLANNING_ONERM_DIP')}
                value={calculateLoadFrontend(oneRMCycleValues?.oneRM_dip)}
                hideLabel
              />
              <OneRmInput
                uploadValue={(value: number) =>
                  handleChangeCycle(value, 'oneRM_pullUp')
                }
                label={t('PLANNING_ONERM_PULL_UP')}
                value={calculateLoadFrontend(oneRMCycleValues?.oneRM_pullUp)}
                hideLabel
              />
              <OneRmInput
                uploadValue={(value: number) =>
                  handleChangeCycle(value, 'oneRM_squat')
                }
                label={t('PLANNING_ONERM_SQUAT')}
                value={calculateLoadFrontend(oneRMCycleValues?.oneRM_squat)}
                hideLabel
              />
            </div>
          )}
          {oneRMTable === trainerOneRMTableOptions.powerlifting && (
            <div>
              <OneRmInput
                uploadValue={(value: number) =>
                  handleChangeCycle(value, 'oneRM_squat')
                }
                value={calculateLoadFrontend(oneRMCycleValues?.oneRM_squat)}
                hideLabel
                label={t('PLANNING_ONERM_SQUAT')}
              />
              <OneRmInput
                uploadValue={(value: number) =>
                  handleChangeCycle(value, 'oneRM_bench')
                }
                label={t('PLANNING_ONERM_BENCHPRESS')}
                value={calculateLoadFrontend(oneRMCycleValues?.oneRM_bench)}
                hideLabel
              />
              <OneRmInput
                uploadValue={(value: number) =>
                  handleChangeCycle(value, 'oneRM_deadlift')
                }
                label={t('PLANNING_ONERM_DEADLIFT')}
                value={calculateLoadFrontend(oneRMCycleValues?.oneRM_deadlift)}
                hideLabel
              />
            </div>
          )}
        </div>
        {(displayUpdateIcon || processingPrimaryExercise) && (
          <IconWithTooltip
            description={t('PLANNING_ONERM_CYCLE_UPDATE_TOOLTIP')}
            muiIcon={Refresh}
            onClick={updateCycleTargetExercises}
            loading={processingPrimaryExercise}
          />
        )}
      </div>
    );
  };
  return (
    <div style={styles.container}>
      <div style={styles.row}>
        {generateOneRmInput()}
        {showOneRMCycle && generateCycleOneRmInput()}
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  row: CSSProperties;
  valueContainer: CSSProperties;
  valueCycleContainer: CSSProperties;
  valueCycleOuterContainer: CSSProperties;
};

const styles: Styles = {
  container: {
    borderRadius: 8,
    padding: 8,
    color: ultra_light_gray,
    backgroundColor: dark_gray,
    display: 'flex',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  valueContainer: {
    marginRight: 8,
  },
  valueCycleContainer: {
    width: 120,
  },
  valueCycleOuterContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default OneRMCard;
