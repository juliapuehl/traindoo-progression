import {t} from 'i18n-js';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  getCurrentAthleteId,
  getCurrentAthleteOneRMTable,
} from '../../../../store/athleteSlice';
import {RootState} from '../../../../store/store';
import {
  getExerciseUsePrimaryExercise,
  getPrimaryExercise,
  getSelectedDayIndex,
  getSelectedTrainingId,
} from '../../../../store/trainingSlice';
import {trainerOneRMTableOptions} from '../../../../traindoo_shared/types/User';
import {editExerciseType} from '../../../../utils/editingTrainingHelper';

export const usePrimaryExerciseConnect = (exerciseIndex: number) => {
  const firestore = useFirestore();

  const athleteUserId = useSelector(getCurrentAthleteId);
  const dayIndex = useSelector(getSelectedDayIndex);
  const athleteOneRMTable = useSelector(getCurrentAthleteOneRMTable);
  const trainingWeekId = useSelector(getSelectedTrainingId);

  const displayMainlift = useSelector((state: RootState) =>
    getExerciseUsePrimaryExercise(state, exerciseIndex),
  );

  const primaryExercise = useSelector((state: RootState): string | undefined =>
    getPrimaryExercise(state, exerciseIndex),
  );
  const powerliftingLabels = [
    {label: t('PLANNING_ONERM_SQUAT'), value: 'oneRM_squat'},
    {label: t('PLANNING_ONERM_BENCHPRESS'), value: 'oneRM_bench'},
    {label: t('PLANNING_ONERM_DEADLIFT'), value: 'oneRM_deadlift'},
  ];
  const calisthenicsLabels = [
    {label: t('PLANNING_ONERM_MUSCLE_UP'), value: 'oneRM_muscleUp'},
    {label: t('PLANNING_ONERM_DIP'), value: 'oneRM_dip'},
    {label: t('PLANNING_ONERM_PULL_UP'), value: 'oneRM_pullUp'},
    {label: t('PLANNING_ONERM_SQUAT'), value: 'oneRM_squat'},
  ];

  const items =
    athleteOneRMTable !== trainerOneRMTableOptions.powerlifting
      ? calisthenicsLabels
      : powerliftingLabels;

  const handleChangeExerciseType = (value: string) => {
    editExerciseType(
      trainingWeekId,
      dayIndex,
      exerciseIndex,
      value,
      athleteUserId,
      firestore,
    );
  };

  return {
    selectedPrimary: primaryExercise,
    options: items,
    setPrimary: handleChangeExerciseType,
    showSelect: displayMainlift,
  };
};
