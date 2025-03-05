import {useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {isEmpty} from 'react-redux-firebase';
import {getAllTrainings} from '../../../logic/firestore';
import {RootState, getStore} from '../../../store/store';
import {
  getExerciseName,
  getSelectedDayDate,
  getSelectedDayIndex,
  getSelectedTrainingId,
  getShowLastWeek,
  getSpecificExercise,
  getSpecificHistoryExercise,
} from '../../../store/trainingSlice';
import {TrainingType} from '../../../traindoo_shared/types/Training';

export type ExerciseHistoryContainer = {
  exerciseIndex: number;
  dayIndex: number;
  trainingId: string;
  date: string;
};
export const useExerciseHistoryOptionsConnect = (exerciseIndex: number) => {
  const exerciseName = useSelector((state: RootState) =>
    getExerciseName(state, exerciseIndex),
  );
  const selectedTrainingId = useSelector(getSelectedTrainingId);
  const dayDate = useSelector(getSelectedDayDate);
  const selectedDayIndex = useSelector(getSelectedDayIndex);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const showLastWeek = useSelector(getShowLastWeek);
  const historyData = useMemo(() => {
    const state = getStore().getState();
    const allTrainings = getAllTrainings(state) as TrainingType[];
    const endIndex = allTrainings.findIndex(
      (training) => training.id === selectedTrainingId,
    );

    const tmpResult = [];
    let indexSet = false;
    allTrainings.slice(0, endIndex).forEach((training, index) => {
      for (const day of Object.values(training.trainingDays).sort(
        (a, b) => a.index - b.index,
      )) {
        if (isEmpty(day.exercises) || day.noTraining) continue;
        for (const exercise of Object.values(day.exercises)) {
          if (exercise.name === exerciseName && exercise.sets) {
            tmpResult.push({
              exerciseIndex: exercise.index,
              dayIndex: day.index,
              trainingIndex: index,
              trainingId: training.id,
              date: day.date,
            });
            if (selectedDayIndex === day.index) {
              setSelectedIndex(tmpResult.length - 1);
              indexSet = true;
            }
          }
        }
      }
    });
    if (!indexSet) setSelectedIndex(tmpResult.length - 1);
    return tmpResult;
  }, [selectedTrainingId, exerciseName, selectedDayIndex]);
  const exercisePaths = showLastWeek
    ? historyData[selectedIndex]
    : {
        exerciseIndex: exerciseIndex,
        dayIndex: selectedDayIndex,
        trainingId: selectedTrainingId,
        date: dayDate,
      };

  const exercise = useSelector((state: RootState) =>
    getSpecificHistoryExercise(
      state,
      exercisePaths?.trainingId ?? -1,
      exercisePaths?.dayIndex ?? -1,
      exercisePaths?.exerciseIndex ?? -1,
    ),
  );
  const currentExercise = useSelector((state: RootState) =>
    getSpecificExercise(state, exerciseIndex),
  );
  return {
    exercise: showLastWeek ? exercise : currentExercise,
    exercisePaths: exercisePaths,
    loading: Boolean(!historyData),
    existsBefore: showLastWeek && selectedIndex > 0,
    existsAfter: showLastWeek && selectedIndex < historyData.length - 1,
    navigateLeft: () => setSelectedIndex(selectedIndex - 1),
    navigateRight: () => setSelectedIndex(selectedIndex + 1),
  };
};
