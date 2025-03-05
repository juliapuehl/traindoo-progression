import {t} from 'i18n-js';
import {CSSProperties, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {DailyCheckGraphComponent} from '../components/DailyCheckGraphComponent';
import {DailyCheckPlanningComponent} from '../components/DailyCheckPlanningComponent';
import {DailyCheckPlanningComponentNew} from '../components/DailyCheckPlanningComponentNew';
import {WeeklyCheckComponent} from '../components/WeeklyCheckComponent';
import {WeeklyCheckComponentNew} from '../components/WeeklyCheckComponentNew';
import FixedBottomNavigation from '../components/bottomTrainingMenu/BottomNavigation';
import {getCurrentCycleTrainingsLength} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {resetCopyDailyCheckNew} from '../store/trainingSlice';
import {background_color_dark, primary_green} from '../styles/colors';
import {CheckPlanningWeekHeader} from './CheckPlanningWeekHeader';

const DailyCheckPlanningScreen = () => {
  const amountTrainings = useSelector(getCurrentCycleTrainingsLength);
  const athleteId = useSelector(getCurrentAthleteId);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetCopyDailyCheckNew());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const generateWeeks = () => {
    const viewArray = [];
    for (let index = 0; index < amountTrainings; index++) {
      const weekIndex = amountTrainings - 1 - index;
      viewArray.push(
        <div key={'WeekPlanning' + weekIndex} style={styles.contentContainer}>
          <CheckPlanningWeekHeader weekIndex={weekIndex} />
          <DailyCheckPlanningComponentNew weekIndex={weekIndex} />
          <DailyCheckPlanningComponent weekIndex={weekIndex} />
          <WeeklyCheckComponentNew weekIndex={weekIndex} />
          <WeeklyCheckComponent weekIndex={weekIndex} />
        </div>,
      );
    }
    return viewArray;
  };
  if (!athleteId) {
    return <div style={styles.warning}>{t('NAVIGATION_NO_ATHLETE')}</div>;
  } else {
    return (
      <div style={styles.main}>
        <DailyCheckGraphComponent />
        {generateWeeks()}
        <FixedBottomNavigation
          checkPlanningScreen={true}
          hideWeekSelection={true}
          hideViewSelection={true}
        />
      </div>
    );
  }
};

type Styles = {
  main: CSSProperties;
  warning: CSSProperties;
  contentContainer: CSSProperties;
};

const styles: Styles = {
  contentContainer: {},
  main: {
    backgroundColor: background_color_dark,
    paddingBottom: 200,
  },
  warning: {
    paddingLeft: 8,
    paddingBottom: 8,
    paddingTop: 20,
    height: 24,
    color: primary_green,
  },
};

export default DailyCheckPlanningScreen;
