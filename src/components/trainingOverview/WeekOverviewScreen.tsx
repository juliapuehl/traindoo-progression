import {Button, createTheme, Grid, ThemeProvider} from '@mui/material';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {getCurrentAthleteId} from '../../store/athleteSlice';
import {
  getSelectedTraining,
  setSelectedDayIndex,
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
} from '../../traindoo_shared/types/Training';
import {getUserWeightMeasurement} from '../../traindoo_shared/units/unitSelectors';
import {useCalculateLoadFrontend} from '../../traindoo_shared/units/useCalculateLoadFrontend';
import {valueIsGiven} from '../../utils/helper';
import FixedBottomNavigation from '../bottomTrainingMenu/BottomNavigation';

const WeekOverviewScreen = () => {
  const currentTrainingWeek = useSelector(getSelectedTraining);
  const measurement = useSelector(getUserWeightMeasurement);
  const dispatch = useDispatch();
  const calculateWeightFrontend = useCalculateLoadFrontend();
  const athleteId = useSelector(getCurrentAthleteId);

  const navigate = useNavigate();
  const location = useLocation();

  const customTheme = createTheme({
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

  const viewButtonText = t('PLANNING_NAVIGATION_BUTTON_CYCLEVIEW');

  const getTrainings = () => {
    const trainings = [];
    if (currentTrainingWeek) {
      Object.keys(currentTrainingWeek.trainingDays).forEach((key) => {
        if (currentTrainingWeek.trainingDays[key].noTraining === false) {
          trainings.push(currentTrainingWeek.trainingDays[key]);
        }
      });
      trainings.sort((a, b) => a.index - b.index);
    }
    return trainings;
  };

  const changeView = () => {
    if (location.pathname === '/week-overview') {
      navigate('/cycle-overview');
    } else {
      navigate('/week-overview');
    }
  };

  const handleExerciseClick = (dayIndex) => {
    dispatch(setSelectedDayIndex(dayIndex));
    navigate('/trainings');
  };

  const containsNumber = (str) => {
    return /\d/.test(str);
  };

  const getSetInfo = (set: SetTypeTrainer): string => {
    let setInfo = '';
    if (valueIsGiven(set?.load)) {
      setInfo = setInfo.concat(
        calculateWeightFrontend(set.load).toString(),
        set?.load?.toString()?.includes('%') || !containsNumber(set.load)
          ? ' '
          : measurement + ' ',
      );
    }
    if (valueIsGiven(set?.reps)) {
      setInfo = setInfo.concat(
        valueIsGiven(set.load) ? ' x ' : '',
        set.reps,
        ' ',
      );
    }
    if (valueIsGiven(set?.rpe)) {
      setInfo = setInfo.concat('@ ', set.rpe, ' ');
    }
    if (valueIsGiven(set?.percentOneRm)) {
      setInfo = setInfo.concat(
        '@ ',

        `${parseFloat(set.percentOneRm) * 100}`,
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

  const createExercises = (exercises: ExerciseType[], dayIndex: number) => {
    return Object.keys(exercises)
      .sort((a, b) => parseFloat(a.slice(8)) - parseFloat(b.slice(8)))
      .map((key) => {
        return (
          <div
            key={key}
            style={styles.sessionContainer}
            onClick={() => handleExerciseClick(dayIndex)}
          >
            <div
              style={{
                ...sharedStyle.textStyle,
                ...styles.exerciseText,
              }}
            >
              {exercises[key].name}
            </div>
            <div
              onClick={() => handleExerciseClick(dayIndex)}
              style={styles.exerciseContainer}
            >
              {createSetDetails(exercises[key].sets)}
            </div>
          </div>
        );
      });
  };

  const createTrainingSession = () => {
    const sessions: DayType[] = getTrainings();
    return Object.keys(sessions).map((key) => {
      return (
        <Grid item xs={3} key={key}>
          <div style={styles.sessionContainer}>
            <div>
              {sessions[key]?.date
                ? moment(sessions[key]?.date).format('ddd') +
                  ', ' +
                  moment(sessions[key]?.date).format('l')
                : '-'}
            </div>
            <div style={{...sharedStyle.textStyle.title2, ...styles.text}}>
              {sessions[key].name}
            </div>
          </div>
          {createExercises(sessions[key].exercises, sessions[key].index)}
        </Grid>
      );
    });
  };
  if (!athleteId) {
    return <div style={styles.warning}>{t('NAVIGATION_NO_ATHLETE')}</div>;
  } else {
    return (
      <div style={styles.main}>
        <div style={styles.headerContainer}>
          <div style={{...sharedStyle.textStyle.title2, ...styles.input}}>
            {`${currentTrainingWeek?.name} | ${
              currentTrainingWeek?.days[0]
            } - ${
              currentTrainingWeek?.days[currentTrainingWeek?.days.length - 1]
            }`}
          </div>
          <ThemeProvider theme={customTheme}>
            <div style={{...styles.detailContainer}}>
              <Button onClick={changeView}>{viewButtonText}</Button>
            </div>
          </ThemeProvider>
        </div>
        <Grid
          container
          columns={{xs: 4, sm: 8, md: 12}}
          spacing={0}
          wrap="nowrap"
        >
          {createTrainingSession()}
        </Grid>
        <FixedBottomNavigation />
      </div>
    );
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
  exerciseText: CSSProperties;
  setText: CSSProperties;
  detailContainer: CSSProperties;
};

const styles: Styles = {
  main: {
    backgroundColor: background_color_dark,
    paddingBottom: 200,
    width: '100%',
  },
  exerciseContainer: {
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
  exerciseText: {color: '#000', fontWeight: 'bold'},
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

export default WeekOverviewScreen;
