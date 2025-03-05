import {
  createTheme,
  FormControlLabel,
  FormGroup,
  Switch,
  ThemeProvider,
  Typography,
} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getSelectedCycleIndex,
  getSelectedTrainingIndex,
  getShowLastWeek,
  toggleShowLastWeek,
} from '../store/trainingSlice';
import {primary_green} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

export const WorkoutAthleteLastWeekSwitch = () => {
  const dispatch = useDispatch();
  const showLastWeek = useSelector(getShowLastWeek);
  const selectedTrainingCycle = useSelector(getSelectedCycleIndex);
  const trainingIndex = useSelector(getSelectedTrainingIndex);

  const isFirstTrainingFirstCycle =
    selectedTrainingCycle === 1 && trainingIndex === 0;

  const editClicked = (value: boolean) => {
    dispatch(toggleShowLastWeek(value));
  };

  useEffect(() => {
    if (isFirstTrainingFirstCycle) {
      dispatch(toggleShowLastWeek(false));
    }
  }, [dispatch, isFirstTrainingFirstCycle]);

  const customTheme = createTheme({
    palette: {
      primary: {
        main: primary_green,
      },
    },
  });

  return (
    <FormGroup style={styles.headline}>
      <FormControlLabel
        control={
          <ThemeProvider theme={customTheme}>
            <Switch
              checked={showLastWeek}
              onChange={(event) => editClicked(event.target.checked)}
              color="primary"
              style={{opacity: isFirstTrainingFirstCycle ? 0 : 1}}
              disabled={isFirstTrainingFirstCycle}
            />
          </ThemeProvider>
        }
        label={
          <Typography
            style={{
              ...sharedStyle.textStyle.title1,
            }}
          >
            {showLastWeek && !isFirstTrainingFirstCycle
              ? t('PLANNING_ATHLETE_VALUES_LAST')
              : t('PLANNING_ATHLETE_VALUES_THIS')}
          </Typography>
        }
        color="white"
        labelPlacement="start"
      />
    </FormGroup>
  );
};

type Styles = {
  headline: CSSProperties;
};

const styles: Styles = {
  headline: {flexDirection: 'row'},
};
