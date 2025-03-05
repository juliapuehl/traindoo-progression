import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import moment from 'moment';
import {isEmpty, isLoaded} from 'react-redux-firebase';
import {handleAddValue} from '../components/DailyCheckValuesComponent';
import {
  getAllTrainings,
  getCurrentCycleTrainings,
  getCurrentCycleTrainingsLength,
  getLastCycleTraining,
} from '../logic/firestore';
import {
  DayIndices,
  dayIndicesArray,
  DayType,
  ExerciseType,
  TrainingType,
} from '../traindoo_shared/types/Training';
import {indexToStringEx, indexToStringSet} from '../utils/helper';
import {
  getAthleteCurrentWeek,
  getAthletePlanningStartDate,
  getCurrentAthlete,
  getCurrentAthleteOneRMCycleValues,
} from './athleteSlice';
import {RootState} from './store';

const initialState: TrainingState = {
  indexSelectedTraining: undefined,
  indexSelectedDay: 0,
  indexSelectedCycle: 1,
  showLastWeek: true,
  copyExercise: undefined,
  copyDay: undefined,
  copyWeek: undefined,
  copySet: undefined,
  copyDailyCheck: undefined,
  copyDailyCheckNew: undefined,
  imageViewerData: undefined,
  editAthleteSetTime: undefined,
  selectedCycleId: undefined,
  progressionTrackingId: undefined,
};

export type TrainingState = {
  selectedCycleId: string | undefined;
  indexSelectedTraining: number | undefined;
  indexSelectedDay: number | undefined;
  indexSelectedCycle: number | undefined;
  showLastWeek: boolean;
  copyExercise: {
    exercise: ExerciseType;
    trainingIndex: number;
    dayIndex: number;
    exerciseIndex: number;
  };
  copyDay: {
    day: DayType;
    trainingId: string;
    dayIndex: number;
  };
  copyWeek: {
    week: TrainingType;
    trainingId: string;
  };
  copySet: {
    trainingIndex: number;
    dayIndex: number;
    exerciseIndex: number;
    setIndex: number;
    values: {
      load: string;
      reps: string;
      rpe: string;
      percentOneRm: number;
    };
  };
  copyDailyCheck: {
    dailyValues: any;
    trainingIndex: number;
    cycleIndex: number;
  };
  copyDailyCheckNew: {
    dailyValues: any;
    trainingIndex: number;
    cycleIndex: number;
  };
  imageViewerData?: {selectedIndex: number; images: string[]};
  editAthleteSetTime: {
    timestamp: string;
  };
  progressionTrackingId?: string;
};

export const trainingSliceKey = 'trainingState';

// == REDUCER
export const trainingSlice = createSlice({
  name: trainingSliceKey,
  initialState,
  reducers: {
    setProgressionTrackingId(state, action: PayloadAction<string>) {
      state.progressionTrackingId = action.payload;
    },
    setSelectedTrainingIndex(state, action: PayloadAction<number>) {
      state.indexSelectedTraining = action.payload;
    },
    resetSelectedTrainingIndex(state) {
      state.indexSelectedTraining = undefined;
    },
    setSelectedDayIndex(state, action: PayloadAction<number>) {
      state.indexSelectedDay = action.payload;
    },
    resetSelectedDayIndex(state) {
      state.indexSelectedDay = 0;
    },
    toggleShowLastWeek(state, action: PayloadAction<boolean>) {
      state.showLastWeek = action.payload;
    },
    resetShowLastWeek(state) {
      state.showLastWeek = false;
    },
    setCopyExercise(
      state,
      action: PayloadAction<{exercise: ExerciseType; exerciseIndex: number}>,
    ) {
      state.copyDay = undefined;
      state.copyExercise = {
        exercise: action.payload.exercise,
        trainingIndex: state.indexSelectedTraining,
        dayIndex: state.indexSelectedDay,
        exerciseIndex: action.payload.exerciseIndex,
      };
    },
    setAthleteEditTime(state, action: PayloadAction<string>) {
      state.editAthleteSetTime = {
        timestamp: action.payload,
      };
    },
    resetCopyExercise(state) {
      state.copyExercise = undefined;
    },
    setCopySet(
      state,
      action: PayloadAction<{
        values: {
          load: string;
          reps: string;
          rpe: string;
          percentOneRm: number;
        };
        exerciseIndex: number;
        setIndex: number;
      }>,
    ) {
      state.copySet = {
        trainingIndex: state.indexSelectedTraining,
        dayIndex: state.indexSelectedDay,
        exerciseIndex: action.payload.exerciseIndex,
        setIndex: action.payload.setIndex,
        values: action.payload.values,
      };
    },
    resetCopySet(state) {
      state.copySet = undefined;
    },
    setCopyDay(
      state,
      action: PayloadAction<{day: DayType; trainingId: string}>,
    ) {
      state.copyExercise = undefined;
      state.copyDay = {
        day: action.payload.day,
        dayIndex: state.indexSelectedDay,
        trainingId: action.payload.trainingId,
      };
    },
    resetCopyDay(state) {
      state.copyDay = undefined;
    },
    setCopyWeek(
      state,
      action: PayloadAction<{week: TrainingType; trainingId: string}>,
    ) {
      state.copyExercise = undefined;
      state.copyDay = undefined;
      state.copyWeek = {
        week: action.payload.week,
        trainingId: action.payload.trainingId,
      };
    },
    resetCopyWeek(state) {
      state.copyWeek = undefined;
    },
    setCopyDailyCheck(
      state,
      action: PayloadAction<{
        dailyValues: any;
        weekIndex: number;
        cycleIndex: number;
      }>,
    ) {
      state.copyDailyCheck = {
        dailyValues: action.payload.dailyValues,
        trainingIndex: action.payload.weekIndex,
        cycleIndex: action.payload.cycleIndex,
      };
    },
    setCopyDailyCheckNew(
      state,
      action: PayloadAction<{
        dailyValues: any;
        weekIndex: number;
        cycleIndex: number;
      }>,
    ) {
      state.copyDailyCheckNew = {
        dailyValues: action.payload.dailyValues,
        trainingIndex: action.payload.weekIndex,
        cycleIndex: action.payload.cycleIndex,
      };
    },
    resetCopyDailyCheckNew(state) {
      state.copyDailyCheckNew = undefined;
    },
    resetCopyDailyCheck(state) {
      state.copyDailyCheck = undefined;
    },
    setIndexSelectedCycle(state, action: PayloadAction<number>) {
      state.indexSelectedCycle = action.payload;
    },
    setSelectedCycleId(state, action: PayloadAction<string>) {
      state.selectedCycleId = action.payload;
    },
    resetIndexSelectedCycle(state) {
      state.indexSelectedCycle = 1;
    },
    setImageViewerPaths(
      state,
      action: PayloadAction<{selectedIndex: number; paths: string[]}>,
    ) {
      state.imageViewerData = {
        selectedIndex: action.payload.selectedIndex,
        images: action.payload.paths,
      };
    },
    resetImageViewerPaths(state) {
      state.imageViewerData = undefined;
    },

    resetTrainingSlice(state) {
      state.indexSelectedTraining = undefined;
      state.indexSelectedDay = 0;
      state.showLastWeek = true;
      state.copyExercise = undefined;
      state.copyDay = undefined;
      state.copyDailyCheck = undefined;
      state.copySet = undefined;
      state.indexSelectedCycle = 1;
      state.copyDailyCheckNew = undefined;
      state.indexSelectedCycle = undefined;
    },
  },
});

// == ACTIONS
export const {
  setProgressionTrackingId,
  setSelectedTrainingIndex,
  resetSelectedTrainingIndex,
  setSelectedDayIndex,
  resetSelectedDayIndex,
  toggleShowLastWeek,
  resetShowLastWeek,
  setCopyExercise,
  resetCopyExercise,
  setCopySet,
  resetCopySet,
  setCopyDay,
  resetCopyDay,
  setCopyDailyCheck,
  setCopyDailyCheckNew,
  resetCopyDailyCheck,
  resetCopyDailyCheckNew,
  setIndexSelectedCycle,
  resetIndexSelectedCycle,
  setCopyWeek,
  resetCopyWeek,
  resetTrainingSlice,
  setImageViewerPaths,
  resetImageViewerPaths,
  setAthleteEditTime,
  setSelectedCycleId,
} = trainingSlice.actions;

// == SELECTORS
export const getProgressionTrackingId = (state: RootState) => {
  return state[trainingSliceKey].progressionTrackingId;
};
export const getSelectedTrainingId = (state: RootState) => {
  const trainings = getCurrentCycleTrainings(state);
  const index = getSelectedTrainingIndex(state);
  if (trainings) {
    return trainings[index]?.id;
  }
  return null;
};
export const getSelectedCycleId = (state: RootState) => {
  return state[trainingSliceKey].selectedCycleId;
};
export const getSelectedTrainingIndex = (state: RootState) => {
  const index = state[trainingSliceKey].indexSelectedTraining;
  const amountTrainings = getCurrentCycleTrainingsLength(state);
  const athlete = getCurrentAthlete(state);
  if (index !== undefined && index <= amountTrainings - 1) {
    return index;
  } else if (athlete) {
    return getAthleteCurrentWeek(state) - 1;
  } else {
    return 0;
  }
};
export const getSelectedDayIndex = (state: RootState) => {
  return state[trainingSliceKey].indexSelectedDay;
};
export const getImageViewerData = (state: RootState) => {
  return state[trainingSliceKey].imageViewerData;
};
export const getEditAthleteTime = (state: RootState) => {
  if (state[trainingSliceKey].editAthleteSetTime) {
    return state[trainingSliceKey].editAthleteSetTime.timestamp;
  } else {
    return '';
  }
};
export const getDateFirstDay = (state: RootState) => {
  const training = getSelectedTraining(state);
  const day = training?.trainingDays['day0'];
  const planningStartDate = getAthletePlanningStartDate(state);
  if (day) {
    return day?.date;
  } else if (planningStartDate) {
    return moment(planningStartDate).add(1, 'week');
  } else {
    return moment().startOf('week').toISOString();
  }
};
export const getSelectedTraining = (
  state: RootState,
): TrainingType | undefined => {
  const indexTraining = getSelectedTrainingIndex(state);
  const training = getCurrentCycleTrainings(state);
  if (
    indexTraining !== undefined &&
    training !== undefined &&
    training[indexTraining]
  ) {
    return training[indexTraining];
  }
  return undefined;
};
export const getTrainingDay = (state: RootState): DayType => {
  const indexTraining = getSelectedTrainingIndex(state);
  const indexDay = state[trainingSliceKey].indexSelectedDay;
  const dayName = dayIndicesArray[indexDay] as DayIndices;
  const training = getCurrentCycleTrainings(state);
  if (
    indexTraining !== undefined &&
    indexDay !== undefined &&
    training !== undefined &&
    training[indexTraining]
  ) {
    return training[indexTraining].trainingDays[dayName];
  }
  return undefined;
};
export const getAmountExercises = (state: RootState) => {
  const trainingDay = getTrainingDay(state) as DayType;
  if (trainingDay) {
    return _.size(trainingDay.exercises);
  } else {
    return 0;
  }
};
export const getAmountSets = (state: RootState, exerciseIndex: number) => {
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);

  if (trainingDay && trainingDay?.exercises[exercise]?.sets) {
    return _.size(trainingDay?.exercises[exercise]?.sets);
  } else {
    return 0;
  }
};
export const getExercises = (state: RootState) => {
  const trainingDay = getTrainingDay(state) as DayType;
  if (trainingDay) {
    return trainingDay.exercises;
  }
  return undefined;
};
export const getExercisesArray = (state: RootState) => {
  const exercises = getExercises(state);
  if (exercises) {
    return Object.values(exercises).sort((a, b) => a.index - b.index);
  }
  return [];
};
export const getSpecificExercise = (
  state: RootState,
  exerciseIndex: number,
) => {
  const exercises = getExercises(state);
  return exercises['exercise' + exerciseIndex];
};
export const getSpecificHistoryExercise = (
  state: RootState,
  trainingId: string,
  dayIndex: number,
  exerciseIndex: number,
) => {
  const day = getSpecificDay(state, trainingId, dayIndex);
  return day?.exercises['exercise' + exerciseIndex];
};

export const getSupersetMeta = (state: RootState) => {
  const trainingDay = getTrainingDay(state) as DayType;
  if (trainingDay) {
    return trainingDay.supersetMeta;
  }
  return undefined;
};
export const getSpecificExerciseSupersetId = (
  state: RootState,
  exerciseIndex: number,
) => {
  const trainingDay = getTrainingDay(state) as DayType;
  if (trainingDay) {
    return (
      trainingDay.exercises['exercise' + exerciseIndex]?.supersetId ?? undefined
    );
  }
  return undefined;
};
export const getExerciseSets = (state: RootState, exerciseIndex: number) => {
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);
  if (trainingDay) {
    return trainingDay.exercises[exercise]?.sets;
  } else {
    return {};
  }
};
export const getExerciseCategory = (
  state: RootState,
  exerciseIndex: number,
) => {
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);
  return trainingDay?.exercises[exercise]?.category ?? undefined;
};
export const getExerciseName = (state: RootState, exerciseIndex: number) => {
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);
  return trainingDay?.exercises[exercise]?.name ?? undefined;
};
export const getTrainingSet = (
  state: RootState,
  exerciseIndex: number,
  setIndex: number,
) => {
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);
  const set = indexToStringSet(setIndex);
  return trainingDay?.exercises[exercise]?.sets[set] ?? undefined;
};

export const getExerciseTrainerNote = (
  state: RootState,
  exerciseIndex: number,
) => {
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);
  if (trainingDay) {
    if (trainingDay.exercises[exercise]?.trainerNote !== undefined) {
      return trainingDay.exercises[exercise].trainerNote;
    } else {
      let note = '';
      if (trainingDay.exercises[exercise]?.sets) {
        Object.keys(trainingDay.exercises[exercise].sets)
          .sort((a, b) => parseFloat(a.slice(3)) - parseFloat(b.slice(3)))
          .forEach((key) => {
            const setNote =
              trainingDay.exercises[exercise].sets[key].trainer?.note;
            if (setNote) {
              note = note + setNote + '\n';
            }
          });
      }
      return note;
    }
  } else {
    return undefined;
  }
};

export const getExerciseUseRir = (state: RootState, exerciseIndex: number) => {
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);
  return trainingDay?.exercises[exercise]?.useRir ?? false;
};

export const getShowLastWeek = (state: RootState) => {
  return state[trainingSliceKey].showLastWeek;
};
export const getSpecificTraining = (
  state: RootState,
  trainingIndex: number,
): TrainingType | undefined => {
  const training = getCurrentCycleTrainings(state);
  if (training !== undefined) {
    return training[trainingIndex];
  }
  return undefined;
};

export const getSpecificTrainingId = (
  state: RootState,
  trainingIndex: number,
): string | undefined => {
  const training = getCurrentCycleTrainings(state);
  if (isLoaded(training) && !isEmpty(training)) {
    return training[trainingIndex].id;
  }
  return undefined;
};

export const getTrainingWeekBefore = (state: RootState) => {
  const currentTrainingIndex = getSelectedTrainingIndex(state);
  const lastCycleLastTraining = getLastCycleTraining(state);
  if (currentTrainingIndex !== 0) {
    return getSpecificTraining(state, currentTrainingIndex - 1);
  } else if (lastCycleLastTraining) {
    return lastCycleLastTraining;
  } else {
    return undefined;
  }
};

export const getExerciseCopiedExists = (state: RootState) => {
  if (state[trainingSliceKey].copyExercise !== undefined) {
    return true;
  }
  return false;
};
export const getExerciseCopy = (state: RootState) => {
  return state[trainingSliceKey].copyExercise?.exercise;
};
export const getExerciseCopyName = (state: RootState) => {
  return state[trainingSliceKey].copyExercise?.exercise?.name ?? '';
};

export const isExerciseCopied = (state: RootState, exerciseIndex: number) => {
  const dayIndex = getSelectedDayIndex(state);
  const trainingIndex = getSelectedTrainingIndex(state);
  const copy = state[trainingSliceKey].copyExercise;
  return (
    copy &&
    copy.dayIndex === dayIndex &&
    copy.trainingIndex === trainingIndex &&
    copy.exerciseIndex === exerciseIndex
  );
};

export const getSetCopiedExists = (state: RootState) => {
  if (state[trainingSliceKey].copySet !== undefined) {
    return true;
  }
  return false;
};
export const getSetCopy = (state: RootState) => {
  return state[trainingSliceKey].copySet?.values;
};

export const getIsSetCopied = (
  state: RootState,
  trainingIndex: number,
  dayIndex: number,
  exerciseIndex: number,
  setIndex: number,
) => {
  const copy = state[trainingSliceKey].copySet;
  return (
    copy &&
    copy.dayIndex === dayIndex &&
    copy.trainingIndex === trainingIndex &&
    copy.exerciseIndex === exerciseIndex &&
    copy.setIndex === setIndex
  );
};
export const getDayCopiedExists = (state: RootState) => {
  if (state[trainingSliceKey].copyDay !== undefined) {
    return true;
  }
  return false;
};
export const getDayCopied = (state: RootState) => {
  return state[trainingSliceKey].copyDay?.day;
};

export const isDayCopied = (
  state: RootState,
  trainingId: string,
  dayIndex: number,
) => {
  const copy = state[trainingSliceKey].copyDay;
  return copy && copy.dayIndex === dayIndex && copy.trainingId === trainingId;
};
export const isWeekCopied = (state: RootState, trainingId: string) => {
  const copy = state[trainingSliceKey].copyWeek;
  return copy && copy.trainingId === trainingId;
};
export const getWeekCopied = (state: RootState) => {
  return state[trainingSliceKey].copyWeek?.week;
};

export const showInsertWeek = (state: RootState, trainingId: string) => {
  const weekIsOverlapping = getSelectedWeekIsOverlapping(state);
  const copy = state[trainingSliceKey].copyWeek;
  return copy && copy.trainingId !== trainingId && !weekIsOverlapping;
};

export const getDayName = (state: RootState) => {
  const trainingDay = getTrainingDay(state) as DayType;
  if (trainingDay?.name) {
    return trainingDay?.name;
  } else {
    return '';
  }
};

export const getSelectedDayIsOverlapping = (state: RootState) => {
  const trainingDay = getTrainingDay(state) as DayType;
  if (trainingDay?.overlappingDay) {
    return trainingDay?.overlappingDay;
  } else {
    return false;
  }
};

export const getSelectedWeekIsOverlapping = (state: RootState) => {
  const training = getSelectedTraining(state);
  return checkWeekIsOverlapping(training);
};

export const checkWeekIsOverlapping = (training: TrainingType) => {
  if (training) {
    const trainingDays = training.trainingDays;
    const result = Object.keys(trainingDays).find(
      (key) => trainingDays[key].overlappingDay === true,
    );
    if (result !== undefined) {
      return true;
    }
  }
  return false;
};

export const getSelectedDailyCheckIds = (state: RootState) => {
  return getSelectedTraining(state)?.dailyIdArray ?? [];
};
export const getSelectedWeeklyCheckId = (state: RootState) => {
  return getSelectedTraining(state)?.weeklyCheckId;
};

export const getWeekName = (state: RootState) => {
  const index = getSelectedTrainingIndex(state);
  const training = getCurrentCycleTrainings(state);
  if (index !== undefined && training && training[index]) {
    return training[index].name;
  }
  return null;
};

export const getSelectedTrainingRPEThisWeek = (state: RootState) => {
  return getTrainingDay(state)?.sessionRpe ?? '';
};

export const getSelectedTrainingRPELastWeek = (state: RootState) => {
  const dayIndex = getSelectedDayIndex(state);
  return (
    getTrainingWeekBefore(state)?.trainingDays[dayIndicesArray[dayIndex]]
      ?.sessionRpe ?? ''
  );
};

export const getSelectedTrainingEndTimeThisWeek = (
  state: RootState,
): string => {
  return getTrainingDay(state)?.endTime ?? '';
};

export const getSelectedTrainingEndTimeLastWeek = (
  state: RootState,
): string => {
  const dayIndex = getSelectedDayIndex(state);
  return (
    getTrainingWeekBefore(state)?.trainingDays[dayIndicesArray[dayIndex]]
      ?.endTime ?? ''
  );
};

export const getTrainingStartTimeThisWeek = (state: RootState): string => {
  return getTrainingDay(state)?.startTime ?? '';
};

export const getTrainingStartTimeLastWeek = (state: RootState): string => {
  const dayIndex = getSelectedDayIndex(state);
  return (
    getTrainingWeekBefore(state)?.trainingDays[dayIndicesArray[dayIndex]]
      ?.startTime ?? ''
  );
};
export const getSelectedDayDate = (state: RootState): string => {
  const dayIndex = getSelectedDayIndex(state);
  return (
    getSelectedTraining(state)?.trainingDays[dayIndicesArray[dayIndex]]?.date ??
    ''
  );
};

export const getSelectedTrainingNoteThisWeek = (state: RootState): string => {
  return getTrainingDay(state)?.sessionNote ?? '';
};

export const getSelectedTrainingNoteLastWeek = (state: RootState): string => {
  const dayIndex = getSelectedDayIndex(state);
  return (
    getTrainingWeekBefore(state)?.trainingDays[dayIndicesArray[dayIndex]]
      ?.sessionNote ?? ''
  );
};

export const getSpecificPercentageCalcExercise = (
  state: RootState,
  trainingIndex: number,
  dayIndex: number,
  exerciseIndex: number,
) => {
  const training = getCurrentCycleTrainings(state);
  if (training) {
    return training[trainingIndex]?.trainingDays[dayIndicesArray[dayIndex]]
      ?.exercises['exercise' + exerciseIndex]?.usePercentageCalc;
  }
};
export const getPrimaryExercise = (state: RootState, exerciseIndex: number) => {
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);
  return trainingDay?.exercises[exercise]?.primaryExercise ?? undefined;
};
export const getExerciseUsePrimaryExercise = (
  state: RootState,
  exerciseIndex: number,
) => {
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);
  return trainingDay?.exercises[exercise]?.usePercentageCalc ?? undefined;
};

export const getPrimaryExerciseValue = (
  state: RootState,
  exerciseIndex: number,
) => {
  const cycleValues = getCurrentAthleteOneRMCycleValues(
    state,
    getSelectedCycleIndex(state),
  );
  const trainingDay = getTrainingDay(state) as DayType;
  const exercise = indexToStringEx(exerciseIndex);

  const primaryExercise = trainingDay?.exercises[exercise]?.primaryExercise;
  if (primaryExercise && cycleValues) {
    return cycleValues[primaryExercise] ? cycleValues[primaryExercise] : 0;
  }

  return 0;
};
export const getSpecificDay = (
  state: RootState,
  trainingId: string,
  dayIndex: number,
) => {
  const trainingsArray = getAllTrainings(state);
  const training = trainingsArray.find((element) => element.id === trainingId);
  if (training) {
    return training?.trainingDays[dayIndicesArray[dayIndex]];
  }
};
export const getSpecificWeight = (
  state: RootState,
  trainingIndex: number,
  dayIndex: number,
): string => {
  const training = getCurrentCycleTrainings(state);
  if (training !== undefined && training[trainingIndex]) {
    const dailyCheck =
      training[trainingIndex]?.trainingDays[dayIndicesArray[dayIndex]]
        ?.dailyCheck;
    if (dailyCheck && dailyCheck.length > 0) {
      return dailyCheck
        .find((element) => element.category === 'Body')
        ?.question.find((element) => element.athlete.id === 'weight')?.athlete
        .value;
    }
  }
  return '0';
};

export const getSpecificWeightAvg = (
  state: RootState,
  trainingIndex: number,
) => {
  let sum = 0;
  let amountValues = 0;
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const [addValue, addValueSet] = handleAddValue(
      getSpecificWeight(state, trainingIndex, dayIndex),
    );
    sum += addValue;
    amountValues += addValueSet;
  }
  return amountValues > 0 ? sum / amountValues : 0;
};

export const getWeekHasProgressImages = (
  state: RootState,
  trainingIndex: number,
) => {
  const training = getSpecificTraining(state, trainingIndex);
  let returnValue = false;
  if (training) {
    returnValue =
      Object.keys(training.trainingDays).findIndex(
        (dayKey) =>
          training.trainingDays[dayKey].dailyProgressImages !== undefined,
      ) !== -1
        ? true
        : false;
  }
  return returnValue;
};

export const getDailyCheckCopyExists = (state: RootState) => {
  if (state[trainingSliceKey].copyDailyCheck !== undefined) {
    return true;
  }
  return false;
};
export const getDailyCheckCopy = (state: RootState) => {
  return state[trainingSliceKey].copyDailyCheck;
};

export const isDailyCheckCopied = (state: RootState, trainingIndex: number) => {
  const copy = state[trainingSliceKey].copyDailyCheck;
  return copy && copy.trainingIndex === trainingIndex;
};
export const getDailyCheckCopyExistsNew = (state: RootState) => {
  if (state[trainingSliceKey].copyDailyCheckNew !== undefined) {
    return true;
  }
  return false;
};
export const getDailyCheckCopyNew = (state: RootState) => {
  return state[trainingSliceKey].copyDailyCheckNew;
};

export const isDailyCheckCopiedNew = (
  state: RootState,
  trainingIndex: number,
  cycleIndex: number,
) => {
  const copy = state[trainingSliceKey].copyDailyCheckNew;
  return (
    copy &&
    copy.trainingIndex === trainingIndex &&
    copy.cycleIndex === cycleIndex
  );
};

export const getTrainerFeedback = (state: RootState) => {
  const training = getSelectedTraining(state);
  if (training && training.feedback) {
    if (typeof training.feedback === 'string') {
      return training.feedback;
    } else {
      const note = training.feedback?.note;
      if (typeof note === 'string') {
        return note;
      } else {
        if (training.feedback.note.length > 0) {
          const result = training.feedback.note.reduce(
            (acc, element) => acc + '\n' + element,
          );
          if (result) {
            return (
              result +
              '\n' +
              training.feedback.video.reduce(
                (acc, element) => acc + '\n' + element,
              )
            );
          }
        }
      }
    }
  }
  return '';
};

export const getSelectedCycleIndex = (state: RootState) => {
  const index = state[trainingSliceKey]?.indexSelectedCycle;
  const athleteCycle = getCurrentAthlete(state)?.currentCycle;
  if (index) {
    return index;
  } else if (athleteCycle) {
    return athleteCycle;
  } else {
    return 1;
  }
};

export const getSpecificWeeklyCheck = (
  state: RootState,
  trainingIndex: number,
) => {
  const training = getSpecificTraining(state, trainingIndex);
  if (training) {
    return training.weeklyCheck;
  }
  return [];
};
export const getSpecificWeeklyId = (
  state: RootState,
  trainingIndex: number,
) => {
  return getSpecificTraining(state, trainingIndex)?.weeklyCheckId;
};
export const getSpecificAthleteWeeklyFeedback = (
  state: RootState,
  trainingIndex: number,
) => {
  const training = getSpecificTraining(state, trainingIndex);
  if (training) {
    return training.athleteFeedback;
  }
  return '';
};
export const getNoTrainings = (state: RootState) => {
  const training = getSelectedTraining(state);
  if (training) {
    return Object.keys(training.trainingDays)
      .sort((a, b) => parseFloat(a.slice(3)) - parseFloat(b.slice(3)))
      .map((dayKey) => training.trainingDays[dayKey].noTraining);
  }
  return [true, true, true, true, true, true, true];
};

export const getExerciseHistoryData = (
  state: RootState,
  exerciseName: string,
  minDate: string,
  onlySpecificCycle: number,
  timeFrameDates?: {startDate: string; endDate: string},
) => {
  const trainings = _.cloneDeep(getAllTrainings(state));
  const result = [];
  if (trainings) {
    trainings
      .sort((a, b) => moment(a.startDate).diff(moment(b.startDate)))
      .forEach((training) => {
        if (onlySpecificCycle && training.trainingCycle !== onlySpecificCycle) {
          return;
        }
        if (training.trainingDays) {
          Object.keys(training.trainingDays)
            .sort((a, b) => parseFloat(a.slice(3)) - parseFloat(b.slice(3)))
            .forEach((dayKey) => {
              const day = training.trainingDays[dayKey];
              const exercises = day.exercises;
              if (
                minDate &&
                day?.date &&
                moment(day?.date).isBefore(moment(minDate))
              ) {
                return;
              }
              if (
                timeFrameDates &&
                day?.date &&
                (moment(day.date).isBefore(moment(timeFrameDates.startDate)) ||
                  moment(day.date).isAfter(moment(timeFrameDates.endDate)))
              ) {
                return;
              }
              Object.keys(exercises).forEach((exerciseKey) => {
                const exercise = exercises[exerciseKey];
                const sets = exercise.sets;
                if (exercise.name === exerciseName && sets) {
                  const setKeys = Object.keys(sets);
                  const resultExercise = {
                    name: exercise.name,
                    date: day?.date,
                    amountSets: setKeys.length,
                    maxWeight: 0,
                    totalWeight: 0,
                    totalReps: 0,
                    max1RM: 0,
                  };
                  setKeys.forEach((setKey) => {
                    const set = sets[setKey];

                    if (
                      !isNaN(set.athlete.load) &&
                      set.athlete.load > 0 &&
                      !isNaN(set.athlete.reps) &&
                      set.athlete.reps > 0
                    ) {
                      resultExercise.totalWeight =
                        resultExercise.totalWeight +
                        parseFloat(set.athlete.load) *
                          parseFloat(set.athlete.reps);
                      if (set.athlete.load > resultExercise.maxWeight) {
                        resultExercise.maxWeight = parseFloat(set.athlete.load);
                      }
                    }
                    if (!isNaN(set.athlete.reps) && set.athlete.reps > 0) {
                      resultExercise.totalReps =
                        resultExercise.totalReps + parseFloat(set.athlete.reps);
                    }
                    if (
                      !isNaN(set.athlete.oneRm) &&
                      set.athlete.oneRm > resultExercise.max1RM
                    ) {
                      resultExercise.max1RM = parseFloat(set.athlete.oneRm);
                    }
                  });
                  result.push(resultExercise);
                }
              });
            });
        }
      });
  }
  return result;
};

export const getCheckHistoryData = (
  state: RootState,
  minDate: string,
  onlySpecificCycle: number,
  timeFrameDates?: {startDate: string; endDate: string},
) => {
  const trainings = _.cloneDeep(getAllTrainings(state));
  const result = {};
  if (trainings) {
    trainings
      .sort((a, b) => moment(a.startDate).diff(moment(b.startDate)))
      .forEach((training) => {
        if (onlySpecificCycle && training.trainingCycle !== onlySpecificCycle) {
          return;
        }
        Object.keys(training.trainingDays)
          .sort((a, b) => parseFloat(a.slice(3)) - parseFloat(b.slice(3)))
          .forEach((dayKey) => {
            const day = training.trainingDays[dayKey];
            const dailyCheck = day.dailyCheck;
            if (minDate && moment(day.date).isBefore(moment(minDate))) {
              return;
            }
            if (
              timeFrameDates &&
              (moment(day.date).isBefore(moment(timeFrameDates.startDate)) ||
                moment(day.date).isAfter(moment(timeFrameDates.endDate)))
            ) {
              return;
            }
            dailyCheck?.forEach((check) => {
              check.question?.forEach((question) => {
                const athleteValue = question.athlete;
                if (athleteValue.value > 0 && !isNaN(athleteValue.value)) {
                  const newData = {
                    name: moment(day.date).format('l'),
                    value: parseFloat(athleteValue.value),
                  };
                  result[athleteValue.id] !== undefined
                    ? result[athleteValue.id].push(newData)
                    : (result[athleteValue.id] = [newData]);
                }
              });
            });
          });
      });
  }
  return result;
};

export const getCheckHistoryDataNew = (
  state: RootState,
  minDate: string,
  onlySpecificCycle: number,
  timeFrameDates?: {startDate: string; endDate: string},
) => {
  const trainings = _.cloneDeep(getAllTrainings(state));
  const result = [];
  if (trainings) {
    trainings
      .sort((a, b) => moment(a.startDate).diff(moment(b.startDate)))
      .forEach((training) => {
        if (onlySpecificCycle && training.trainingCycle !== onlySpecificCycle) {
          return;
        }
        Object.keys(training.trainingDays)
          .sort((a, b) => parseFloat(a.slice(3)) - parseFloat(b.slice(3)))
          .forEach((dayKey) => {
            const day = training.trainingDays[dayKey];
            const dailyCheck = day.dailyCheck;
            if (minDate && moment(day.date).isBefore(moment(minDate))) {
              return;
            }
            if (
              timeFrameDates &&
              day?.date &&
              (moment(day.date).isBefore(moment(timeFrameDates.startDate)) ||
                moment(day.date).isAfter(moment(timeFrameDates.endDate)))
            ) {
              return;
            }
            const newData = {
              name: moment(day.date).format('l'),
            };
            dailyCheck?.forEach((check) => {
              check.question?.forEach((question) => {
                const athleteValue = question.athlete;
                if (athleteValue.value > 0 && !isNaN(athleteValue.value)) {
                  // {name: name, athlete.id: athlete.value, athlete.id: athlete.value, athlete.id: athlete.value }
                  newData[athleteValue.id] = parseFloat(athleteValue.value);
                }
              });
            });
            result.push(newData);
          });
      });
  }
  return result;
};
