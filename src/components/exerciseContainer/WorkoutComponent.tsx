import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentCycleTrainingsLength} from '../../logic/firestore';
import {
  getAthleteTotalCycle,
  getCurrentAthleteId,
} from '../../store/athleteSlice';
import {getSelectedDayIsOverlapping} from '../../store/trainingSlice';
import {primary_green} from '../../styles/colors';
import {removeFromAthleteTotalCycles} from '../../utils/editingAthleteHelper';
import {AlertPopover} from '../AlertPopover';

import {AthleteExerciseHistory} from '../exerciseHistory/AthleteExerciseHistory';
import {DayEditBar} from '../trainingPlaning/DayEditBar';
import WeekEditBar from '../trainingPlaning/WeekEditBar';
import {ExerciseGrid} from './ExerciseGrid';
import {WorkoutExercises} from './WorkoutExercises';

export const WorkoutComponent = () => {
  const [showDeleteCycleAlert, setShowDeleteCycleAlert] = useState(false);
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);
  const totalCycles = useSelector(getAthleteTotalCycle);
  const amountWeeks = useSelector(getCurrentCycleTrainingsLength);
  const dayIsOverlapping = useSelector(getSelectedDayIsOverlapping);
  const dispatch = useDispatch();

  const handleDeleteCycle = () => {
    removeFromAthleteTotalCycles(
      totalCycles,
      amountWeeks,
      athleteUserId,
      dispatch,
      firestore,
    );
  };

  return (
    <div style={styles.main}>
      <div>
        {amountWeeks > 0 && (
          <WeekEditBar
            showDeleteCycleAlert={() => setShowDeleteCycleAlert(true)}
            intercomTarget="workout-component-week-edit-bar"
          />
        )}
        {dayIsOverlapping && amountWeeks > 0 && (
          <div style={styles.warning}>{t('PLANNING_DAY_OVERLAPPING')}</div>
        )}
        {!dayIsOverlapping && amountWeeks > 0 && (
          <DayEditBar intercomTarget="workout-component-day-edit-bar" />
        )}

        <div>
          <ExerciseGrid>
            {(tabIndex: number) => (
              <>
                <WorkoutExercises
                  showAddIcon={!dayIsOverlapping && Boolean(amountWeeks)}
                  match={
                    tabIndex === 0 && {
                      supersetNameMatch: () => <div></div>,
                      exerciseMatch: (exerciseIndex) => {
                        return (
                          <AthleteExerciseHistory
                            exerciseIndex={exerciseIndex}
                          />
                        );
                      },
                    }
                  }
                />
                {amountWeeks <= 0 && (
                  <>
                    <div style={styles.warning}>{t('PLANNING_NO_WEEK')}</div>
                    <div></div>
                  </>
                )}
                <>
                  <div style={{height: '2em'}}></div>
                </>
              </>
            )}
          </ExerciseGrid>
        </div>
      </div>
      <AlertPopover
        open={showDeleteCycleAlert}
        handleClose={() => setShowDeleteCycleAlert(false)}
        confirm={handleDeleteCycle}
        abortText={t('PLANNING_DELETE_CYCLE_LAST_TRAINING_CANCEL')}
        confirmText={t('PLANNING_DELETE_CYCLE_LAST_TRAINING_CONFIRM')}
        headline={t('PLANNING_DELETE_CYCLE_LAST_TRAINING_TITLE')}
        text={t('PLANNING_DELETE_CYCLE_LAST_TRAINING_TEXT')}
      />
    </div>
  );
};

type Styles = {
  warning: CSSProperties;
  headlineAndWeekSwitchContainer: CSSProperties;
  headline: CSSProperties;
  main: CSSProperties;
  addCirc: CSSProperties;
  greenButton: CSSProperties;
  buttonContainer: CSSProperties;
};

const styles: Styles = {
  main: {
    paddingRight: 8,
    paddingLeft: 8,
    minHeight: 'fit-content',
    paddingBottom: 80,
  },
  warning: {
    paddingLeft: 8,

    paddingTop: 8,
    height: 24,
    color: primary_green,
  },
  headlineAndWeekSwitchContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 10,
    marginRight: 330,
  },
  headline: {
    marginLeft: 32,
  },
  addCirc: {
    color: primary_green,
    height: 24,
  },
  greenButton: {
    color: primary_green,
    height: 24,
  },
  buttonContainer: {
    marginLeft: 36,
    marginTop: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
};

// WorkoutComponent.whyDidYouRender = true;
