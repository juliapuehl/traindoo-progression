import {t} from 'i18n-js';
import {CSSProperties, useEffect} from 'react';
import {useSelector} from 'react-redux';
import TopNavigationComponent from '../components/UI/TopNavigationComponent';
import FixedBottomNavigation from '../components/bottomTrainingMenu/BottomNavigation';
import {WorkoutComponent} from '../components/exerciseContainer/WorkoutComponent';
import {useTrainingScreenConnect} from '../hooks/useTrainingScreenConnect';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {background_color_dark, primary_green} from '../styles/colors';

const TrainingScreen = () => {
  const athleteId = useSelector(getCurrentAthleteId);
  useTrainingScreenConnect();

  useEffect(() => {
    Intercom('trackEvent', 'Training-Screen-Rendered');
  }, []);

  return (
    <div style={styles.main}>
      {!athleteId ? (
        <div style={styles.warning}>{t('NAVIGATION_NO_ATHLETE')}</div>
      ) : (
        <div style={styles.container}>
          <TopNavigationComponent />
          <WorkoutComponent />
          <FixedBottomNavigation />
          {/* <Progression /> */}
        </div>
      )}
    </div>
  );
};

type Styles = {
  main: CSSProperties;
  warning: CSSProperties;
  container: CSSProperties;
};

const styles: Styles = {
  main: {
    backgroundColor: background_color_dark,
    paddingBottom: '56px',
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  container: {
    minWidth: 'fit-content',
    minHeight: 'fit-content',
    height: '100%',
  },
  warning: {
    paddingLeft: 8,
    paddingBottom: 8,
    paddingTop: 20,
    height: 24,
    color: primary_green,
  },
};

export default TrainingScreen;
