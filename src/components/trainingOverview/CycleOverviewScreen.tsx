import {
  Button,
  createTheme,
  Grid,
  Switch,
  ThemeProvider,
  Typography,
} from '@mui/material';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {getCurrentCycleTrainings} from '../../logic/firestore';
import {getCurrentAthleteId} from '../../store/athleteSlice';
import {
  getSelectedCycleIndex,
  setSelectedDayIndex,
  setSelectedTrainingIndex,
} from '../../store/trainingSlice';
import {
  background_color_dark,
  dark_gray,
  primary_green,
  ultra_light_gray,
  white,
} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {
  DayType,
  ExerciseType,
  SetSplitterType,
  SetTypeTrainer,
  TrainingType,
} from '../../traindoo_shared/types/Training';
import {getUserWeightMeasurement} from '../../traindoo_shared/units/unitSelectors';
import {useCalculateLoadFrontend} from '../../traindoo_shared/units/useCalculateLoadFrontend';
import {valueIsGiven} from '../../utils/helper';
import FixedBottomNavigation from '../bottomTrainingMenu/BottomNavigation';

const CycleOverviewScreen = () => {
  const currentCycle = useSelector(getCurrentCycleTrainings);
  const dispatch = useDispatch();
  const [showExerciseDetails, setShowExerciseDetails] = useState(false);
  const selectedCycle = useSelector(getSelectedCycleIndex);
  const totalCycles = currentCycle?.length - 1;
  const measurement = useSelector(getUserWeightMeasurement);
  const calculateWeightFrontEnd = useCalculateLoadFrontend();
  const athleteId = useSelector(getCurrentAthleteId);

  const navigate = useNavigate();
  const location = useLocation();

  const viewButtonText = t('PLANNING_NAVIGATION_BUTTON_WEEKVIEW');

  const customTheme = createTheme({
    palette: {
      primary: {
        main: primary_green,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            '&.MuiButton-root': {
              color: ultra_light_gray,
              opacity: 1,
              minWidth: '16ch',
              width: 70,
            },
          },
        },
      },
    },
  });

  const changeView = () => {
    if (location.pathname === '/week-overview') {
      navigate('/cycle-overview');
    } else {
      navigate('/week-overview');
    }
  };
  const getTrainings = (trainingDays: any) => {
    const trainings = [];
    if (trainingDays) {
      Object.keys(trainingDays).forEach((key) => {
        if (trainingDays[key].noTraining === false) {
          trainings.push(trainingDays[key]);
        }
      });
      trainings.sort((a, b) => a.index - b.index);
    }
    return trainings;
  };

  const handleExerciseClick = (dayIndex: number, trainingWeek: number) => {
    dispatch(setSelectedDayIndex(dayIndex));
    dispatch(setSelectedTrainingIndex(trainingWeek - 1));
    navigate('/trainings');
  };

  const containsNumber = (str) => {
    return /\d/.test(str);
  };

  const getSetInfo = (set: SetTypeTrainer): string => {
    let setInfo = '';
    if (valueIsGiven(set?.load)) {
      setInfo = setInfo.concat(
        calculateWeightFrontEnd(set?.load).toString(),
        set?.load &&
          (String(set?.load).includes('%') || !containsNumber(set?.load))
          ? ' '
          : measurement + ' ',
      );
    }
    if (valueIsGiven(set?.reps)) {
      setInfo = setInfo.concat(
        valueIsGiven(set?.load) ? ' x ' : '',
        set?.reps,
        ' ',
      );
    }
    if (valueIsGiven(set?.rpe)) {
      setInfo = setInfo.concat('@ ', set?.rpe, ' ');
    }
    if (valueIsGiven(set?.percentOneRm)) {
      setInfo = setInfo.concat(
        '@ ',

        `${parseFloat(set?.percentOneRm) * 100}`,
        '% e1RM',
      );
    }
    return setInfo;
  };

  const createSetDetails = (sets: SetSplitterType[]) => {
    return Object.keys(sets)
      .sort((a, b) => parseFloat(a.slice(3)) - parseFloat(b.slice(3)))
      .map((key) => {
        return (
          <div
            key={key}
            style={{
              ...sharedStyle.textStyle,
              ...styles.setText,
            }}
          >
            {getSetInfo(sets[key].trainer)}
          </div>
        );
      });
  };

  const createSessionDetails = (
    exercises: ExerciseType[],
    dayIndex: number,
    trainingWeek: number,
  ) => {
    return Object.keys(exercises)
      .sort((a, b) => parseFloat(a.slice(8)) - parseFloat(b.slice(8)))
      .map((key) => {
        return (
          <div
            key={key}
            style={styles.exerciseContainer}
            onClick={() => handleExerciseClick(dayIndex, trainingWeek)}
          >
            <div
              style={{
                ...sharedStyle.textStyle,
                ...(showExerciseDetails
                  ? styles.exerciseTextDetails
                  : styles.exerciseTextNoDetails),
              }}
            >
              {exercises[key].name}
            </div>
            {showExerciseDetails && (
              <div
                onClick={() => handleExerciseClick(dayIndex, trainingWeek)}
                style={styles.setContainer}
              >
                {createSetDetails(exercises[key].sets)}
              </div>
            )}
          </div>
        );
      });
  };

  const createTrainingSession = (trainingDays: any, trainingWeek: number) => {
    const sessions: DayType[] = getTrainings(trainingDays);
    return Object.keys(sessions).map((key) => {
      return (
        <div
          key={key}
          style={styles.sessionContainer}
          onClick={() => handleExerciseClick(sessions[key].index, trainingWeek)}
        >
          <div
            style={{
              ...sharedStyle.textStyle,
              ...styles.exerciseTextDetails,
            }}
          >
            {sessions[key].name}
          </div>
          <div
            onClick={() =>
              handleExerciseClick(sessions[key].index, trainingWeek)
            }
            style={styles.exerciseContainer}
          >
            {createSessionDetails(
              sessions[key].exercises,
              sessions[key].index,
              trainingWeek,
            )}
          </div>
        </div>
      );
    });
  };

  const createTrainingWeek = () => {
    const weeks: TrainingType[] = currentCycle;
    if (weeks) {
      return Object.keys(weeks)
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => {
          const startMoment = moment(weeks[key].startDate);
          const endMoment = moment(weeks[key].startDate).add(
            weeks[key].days.length - 1,
            'days',
          );
          return (
            <Grid item xs={3} key={key}>
              <div style={styles.sessionContainer}>
                {startMoment.format('ddd') +
                  ' ' +
                  startMoment.format('l') +
                  ' - ' +
                  endMoment.format('ddd') +
                  ' ' +
                  endMoment.format('l')}
                <div style={{...sharedStyle.textStyle.title1, ...styles.text}}>
                  {weeks[key].name}
                </div>
              </div>
              {createTrainingSession(
                weeks[key].trainingDays,
                weeks[key].trainingWeek,
              )}
            </Grid>
          );
        });
    }
    return <div />;
  };
  if (!athleteId) {
    return <div style={styles.warning}>{t('NAVIGATION_NO_ATHLETE')}</div>;
  } else if (selectedCycle !== undefined && totalCycles !== undefined) {
    return (
      <ThemeProvider theme={customTheme}>
        <div style={styles.main}>
          <div style={styles.headerContainer}>
            <div style={{...sharedStyle.textStyle.title1, ...styles.input}}>
              {`${t('OVERVIEW_HEADER_CYCLE')}: ${selectedCycle} | ${
                currentCycle[0]?.days[0]
              } - ${
                currentCycle[totalCycles]?.days[
                  currentCycle[totalCycles]?.days.length - 1
                ]
              }`}
            </div>
            <div style={styles.detailContainer}>
              <ThemeProvider theme={customTheme}>
                <Typography
                  style={{
                    ...sharedStyle.textStyle.primary_white_capital,
                  }}
                >
                  {'Show Exercise Details'}
                </Typography>
                <Switch
                  checked={showExerciseDetails}
                  onChange={(event) =>
                    setShowExerciseDetails(event.target.checked)
                  }
                  color="primary"
                />
              </ThemeProvider>
              <div style={styles.switchButton}>
                <Button onClick={changeView}>{viewButtonText}</Button>
              </div>
            </div>
          </div>

          <Grid
            container
            columns={{xs: 4, sm: 8, md: 12}}
            spacing={0}
            wrap="nowrap"
          >
            {createTrainingWeek()}
          </Grid>
          <FixedBottomNavigation
            hideWeekSelection={true}
            hideViewSelection={false}
          />
        </div>
      </ThemeProvider>
    );
  } else {
    return <div />;
  }
};

type Styles = {
  main: CSSProperties;
  warning: CSSProperties;
  container: CSSProperties;
  sessionContainer: CSSProperties;
  text: CSSProperties;
  input: CSSProperties;
  headerContainer: CSSProperties;
  exerciseContainer: CSSProperties;
  setText: CSSProperties;
  exerciseTextNoDetails: CSSProperties;
  exerciseTextDetails: CSSProperties;
  setContainer: CSSProperties;
  detailContainer: CSSProperties;
  switchButton: CSSProperties;
};

const styles: Styles = {
  main: {
    backgroundColor: background_color_dark,
    paddingBottom: 200,
    width: '100%',
  },
  switchButton: {
    marginLeft: 10,
  },
  exerciseContainer: {
    cursor: 'pointer',
    margin: 4,
  },
  setContainer: {
    cursor: 'pointer',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 4,
    padding: 8,
    backgroundColor: dark_gray,
    borderRadius: 8,
    borderColor: ultra_light_gray,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  container: {
    width: 'fit-content',
    minWidth: '100%',
  },
  warning: {
    paddingLeft: 8,
    paddingBottom: 8,
    paddingTop: 20,
    height: 24,
    color: primary_green,
  },
  sessionContainer: {
    backgroundColor: white,
    padding: 8,
    margin: 4,
    borderRadius: 8,
    cursor: 'pointer',
  },
  text: {color: '#000'},
  exerciseTextNoDetails: {
    color: '#000',
  },
  exerciseTextDetails: {color: '#000', fontWeight: 'bold'},
  setText: {marginLeft: 2},
  input: {
    paddingLeft: 8,
    backgroundColor: dark_gray,
    border: 'none',
    borderRadius: 8,
    outline: 'none',
    resize: 'none',
    lineHeight: 1,
    paddingTop: 6,
    height: 30,
    marginRight: 8,
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
};

export default CycleOverviewScreen;
