import firebase from 'firebase/app';
import {cloneDeep} from 'lodash';
import moment, {Moment} from 'moment-timezone';
import {ExtendedFirestoreInstance} from 'react-redux-firebase';
import {v4 as uuidv4} from 'uuid';
import {
  addCycleTemplateQuery,
  addDayTemplateQuery,
  addWeekTemplateQuery,
  specificCycleTemplateQuery,
  specificDayTemplateQuery,
  specificTrainingDataQuery,
  specificTrainingDataQueryBatch,
  specificUserQueryBatch,
  specificWeekTemplateQuery,
  usersDataQuery,
} from '../logic/firestore';
import {checkWeekIsOverlapping} from '../store/trainingSlice';
import {CheckCategoryLibrary} from '../traindoo_shared/types/Check';
import {
  dayIndicesArray,
  DayType,
  ExercisesContainer,
  ExerciseType,
  SetsContainerType,
  SupersetMeta,
  TrainingType,
} from '../traindoo_shared/types/Training';
import {CheckTemplateType} from '../types/Check';
import {
  CycleTemplateType,
  DayTemplateType,
  WeekTemplateType,
} from '../types/Templates';

export const createNewTraining = async (
  currentAthletePlanningDate: string,
  filteredIdsToAdjust: {id: string; weekNumber: number}[],
  athleteUserId: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
  startDate: Moment,
  newWeekNumber: number | undefined,
  currentCycle: number | undefined,
  selectedDailyId: string,
  selectedWeeklyId: string,
) => {
  const training = generateEmptyTraining(
    currentCycle,
    newWeekNumber,
    startDate,
  );
  try {
    return await uploadNewTraining(
      currentAthletePlanningDate,
      filteredIdsToAdjust,
      athleteUserId,
      userId,
      firestore,
      startDate,
      selectedDailyId,
      selectedWeeklyId,
      training,
    );
  } catch (error) {
    console.warn(error);
  }
};

export const copyLastTraining = async (
  currentAthletePlanningDate: string,
  filteredIdsToAdjust: {id: string; weekNumber: number}[],
  athleteUserId: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
  startDate: Moment,
  newWeekNumber: number,
  currentCycle: number | undefined,
  lastTraining: TrainingType,
  selectedDailyId: string,
  selectedWeeklyId: string,
) => {
  const training = generateCopyTraining(
    currentCycle,
    lastTraining,
    startDate,
    newWeekNumber,
  );
  try {
    return await uploadNewTraining(
      currentAthletePlanningDate,
      filteredIdsToAdjust,
      athleteUserId,
      userId,
      firestore,
      startDate,
      selectedDailyId,
      selectedWeeklyId,
      training,
    );
  } catch (error) {
    console.warn(error);
  }
};

export const copyLastTrainingForProgression = async (
  athleteUserId: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
  startDate: Moment,
  currentCycle: number | undefined,
  lastTraining: TrainingType,
  selectedDailyId: string,
  selectedWeeklyId: string,
  progressionData,
  newWeekNumber: number,
  currentAthletePlanningDate: string,
  filteredIdsToAdjust: {id: string; weekNumber: number}[],
) => {
  const training = generateProgressionTraining(
    currentCycle,
    lastTraining,
    startDate,
    progressionData,
    newWeekNumber,
  );
  try {
    return await uploadNewTraining(
      currentAthletePlanningDate,
      filteredIdsToAdjust,
      athleteUserId,
      userId,
      firestore,
      startDate,
      selectedDailyId,
      selectedWeeklyId,
      training,
    );
  } catch (error) {
    console.warn(error);
  }
};

export const uploadNewTraining = async (
  currentAthletePlanningDate: string,
  filteredIdsToAdjust: {id: string; weekNumber: number}[],
  athleteUserId: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
  startDate: Moment,
  selectedDailyId: string,
  selectedWeeklyId: string,
  training: any,
) => {
  try {
    const trainingId = uuidv4();
    const dailyIdArray = await generateDailyChecks(
      selectedDailyId,
      training.days,
      firestore,
      athleteUserId,
      userId,
      trainingId,
    );
    const newWeeklyCheckId = await generateWeeklyCheck(
      selectedWeeklyId,
      moment(startDate.toISOString()).add(6, 'days').toISOString(),
      firestore,
      athleteUserId,
      userId,
      trainingId,
    );

    //@ts-ignore
    const uploadBatch = firestore.batch();
    uploadBatch.set(
      specificTrainingDataQueryBatch(athleteUserId, trainingId, firestore),
      {
        ...training,
        id: trainingId,
        dailyIdArray: dailyIdArray,
        weeklyCheckId: newWeeklyCheckId,
      },
    );
    filteredIdsToAdjust?.forEach((element) =>
      uploadBatch.update(
        firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(athleteUserId)
          .collection('training')
          .doc(element.id),
        {trainingWeek: element.weekNumber + 1},
      ),
    );
    if (
      !currentAthletePlanningDate ||
      moment(currentAthletePlanningDate).isSameOrBefore(startDate)
    ) {
      uploadBatch.update(specificUserQueryBatch(athleteUserId, firestore), {
        planningStartDate: startDate.toISOString(),
      });
    }

    await uploadBatch.commit();
    return trainingId;
  } catch (error) {
    console.warn(error);
    return undefined;
  }
};

export const generateYearWeekNumber = (momentString: Moment): number => {
  return moment(momentString).year() * 100 + moment(momentString).week();
};

export const generateDailyChecks = async (
  selectedDailyId: string,
  trainingDays: string[],
  firestore: ExtendedFirestoreInstance,
  athleteUserId: string,
  userId: string,
  trainingId: string,
) => {
  const checkRef = firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(userId)
    .collection('dailyCheckCollection')
    .doc(selectedDailyId);
  const categoryLibraryRef = firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(userId)
    .collection('checkCategoryLibrary')
    .doc('categories');

  return firestore.runTransaction(async (transaction) => {
    const checkData = (
      await transaction.get(checkRef)
    ).data() as CheckTemplateType;
    const libraryData = (
      await transaction.get(categoryLibraryRef)
    ).data() as CheckCategoryLibrary;

    if (!checkData || !libraryData) {
      throw 'Check does not exist!';
    }
    const docDailyDictionary = firestore
      //@ts-ignore firebase object wrongly typed
      .collection('user')
      .doc(athleteUserId)
      .collection('dailyCheck')
      .doc('0-dailyCheckDictionary');
    const dailyDictionaryEntry = {};
    const returnArray = [];
    const data: any = checkData;
    for (const categoryKey in checkData.categories) {
      for (const questionKey in checkData.categories[categoryKey].questions) {
        const defaultValue =
          libraryData[categoryKey]?.questions[questionKey]?.defaultValue;
        if (defaultValue) {
          data.categories[categoryKey].questions[questionKey].trainerValue =
            defaultValue;
        }
      }
    }
    trainingDays.forEach((date) => {
      const locMoment = moment(date, 'DD.MM.YYYY');
      const startDate = moment()
        .dayOfYear(locMoment.dayOfYear())
        .utc()
        .startOf('day');

      const doc = firestore
        //@ts-ignore firebase object wrongly typed
        .collection('user')
        .doc(athleteUserId)
        .collection('dailyCheck')
        .doc(startDate.format('YYYY-MM-DD'));

      dailyDictionaryEntry[doc.id] = {
        date: startDate.toISOString(),
        id: doc.id,
        trainingId: trainingId,
      };
      returnArray.push(doc.id);

      transaction.set(doc, {
        categories: data.categories,
        templateId: checkData.id,
        date: startDate.toISOString(),
        id: doc.id,
        trainingId: trainingId,
      });
    });
    transaction.set(docDailyDictionary, dailyDictionaryEntry, {
      merge: true,
    });
    return returnArray;
  });
};
export const generateWeeklyCheck = async (
  selectedWeeklyId: string,
  weekEndDate: string,
  firestore: ExtendedFirestoreInstance,
  athleteUserId: string,
  userId: string,
  trainingId: string,
) => {
  const checkRef = firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(userId)
    .collection('weeklyCheckCollection')
    .doc(selectedWeeklyId);
  const categoryLibraryRef = firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(userId)
    .collection('checkCategoryLibrary')
    .doc('categories');
  return firestore.runTransaction(async (transaction) => {
    const checkData = (
      await transaction.get(checkRef)
    ).data() as CheckTemplateType;
    const libraryData = (
      await transaction.get(categoryLibraryRef)
    ).data() as CheckCategoryLibrary;

    if (!checkData || !libraryData) {
      throw 'Check does not exist!';
    }
    const docWeeklyDictionary = firestore
      //@ts-ignore firebase object wrongly typed
      .collection('user')
      .doc(athleteUserId)
      .collection('weeklyCheck')
      .doc('0-weeklyCheckDictionary');
    const weeklyDictionaryEntry = {};

    const data: any = checkData;
    for (const categoryKey in checkData.categories) {
      for (const questionKey in checkData.categories[categoryKey]?.questions) {
        const defaultValue =
          libraryData[categoryKey].questions[questionKey]?.defaultValue;
        if (defaultValue) {
          data.categories[categoryKey].questions[questionKey].trainerValue =
            defaultValue;
        }
      }
    }

    const locMoment = moment(weekEndDate);

    const startDate = moment()
      .dayOfYear(locMoment.dayOfYear())
      .utc()
      .startOf('day');

    const doc = firestore
      //@ts-ignore firebase object wrongly typed
      .collection('user')
      .doc(athleteUserId)
      .collection('weeklyCheck')
      .doc(startDate.format('YYYY-MM-DD'));

    weeklyDictionaryEntry[doc.id] = {
      date: startDate.toISOString(),
      id: doc.id,
      trainingId: trainingId,
    };

    transaction.set(doc, {
      categories: data.categories,
      templateId: checkData.id,
      date: startDate.toISOString(),
      id: doc.id,
      trainingId: trainingId,
    });
    transaction.set(docWeeklyDictionary, weeklyDictionaryEntry, {
      merge: true,
    });
    return doc.id;
  });
};

export const generateEmptyTraining = (
  currentCycle: number | undefined,
  newWeekNumber: number | undefined,
  startDate: Moment,
) => {
  const day = cloneDeep(startDate);
  const trainingWeek = newWeekNumber;
  const trainingCycle = currentCycle ? currentCycle : 1;
  const trainingDays = {};
  const days = [];
  dayIndicesArray.forEach((key, index) => {
    days.push(day.format('DD.MM.YYYY'));
    trainingDays[key] = {
      name: '',
      noTraining: true,
      date: day.toISOString(),
      warmUp: [],
      exercises: {},
      coolDown: [],
      startTime: '',
      endTime: '',
      index: index,
      sessionRpe: -1,
    };
    day.add(1, 'day');
  });
  return {
    version: 1,
    startDate: startDate.toISOString(),
    calendarWeek: generateYearWeekNumber(startDate), //must be 6 digit long exp. 202106, YYYYWW
    trainingWeek: trainingWeek,
    trainingCycle: trainingCycle,
    trainingDays: trainingDays,
    feedback: '',
    name: '',
    createdAt: moment().toISOString(),
    changedAt: moment().toISOString(),
    days: days,
  };
};

export const generateCopyTraining = (
  currentCycle: number | undefined,
  lastTraining: TrainingType,
  startDate: Moment,
  newWeekNumber: number,
) => {
  const day = cloneDeep(startDate);
  const trainingWeek = newWeekNumber;
  const trainingCycle = currentCycle ? currentCycle : 1;
  const trainingDays = {};
  const days = [];
  dayIndicesArray.forEach((key, index) => {
    const lastTrainingDay = lastTraining.trainingDays[key] as DayType;
    days.push(day.format('DD.MM.YYYY'));
    trainingDays[key] = {
      noTraining: lastTrainingDay.noTraining,
      date: day.toISOString(),
      warmUp: lastTrainingDay.warmUp,
      name: lastTrainingDay.name ? lastTrainingDay.name : '',
      exercises: {},
      coolDown: lastTrainingDay.coolDown,
      startTime: '',
      endTime: '',
      index: index,
      sessionRpe: -1,
      ...(lastTrainingDay.supersetMeta && {
        supersetMeta: lastTrainingDay.supersetMeta,
      }),
    };

    //First copy the whole exercise
    Object.keys(lastTrainingDay.exercises).forEach((exerciseKey) => {
      const newExercise = cloneDeep(lastTrainingDay.exercises[exerciseKey]);
      //Second overwrite the athletes values in the sets
      Object.keys(newExercise.sets).forEach((setKey) => {
        newExercise.sets[setKey].athlete = {
          note: '',
          reps: -1,
          rpe: -1,
          load: -1,
          video: '',
          duration: -1,
          breaks: -1,
          oneRm: -1,
          isDone: false,
        };
      });
      trainingDays[key].exercises[exerciseKey] = newExercise;
    });
    day.add(1, 'day');
  });
  return {
    version: 1,
    startDate: startDate.toISOString(),
    calendarWeek: generateYearWeekNumber(startDate), //must be 6 digit long exp. 202106, YYYYWW
    trainingWeek: trainingWeek,
    trainingCycle: trainingCycle,
    trainingDays: trainingDays,
    name: lastTraining.name ? lastTraining.name : '',
    feedback: lastTraining.feedback ?? '',
    createdAt: moment().toISOString(),
    changedAt: moment().toISOString(),
    days: days,
  };
};

export const generateProgressionTraining = (
  currentCycle: number | undefined,
  lastTraining: TrainingType,
  startDate: Moment,
  progressionData,
  newWeekNumber: number,
) => {
  const copiedWeek = generateCopyTraining(
    currentCycle,
    lastTraining,
    startDate,
    newWeekNumber,
  );
  Object.keys(copiedWeek.trainingDays).forEach((key) => {
    const day = copiedWeek.trainingDays[key];
    //First copy the whole exercise
    Object.keys(day.exercises).forEach((exerciseKey) => {
      let exercise = cloneDeep(day.exercises[exerciseKey]);
      //Third modify trainer values with progression values
      const progressionExercise = progressionData.find(
        (element) =>
          element.exerciseName === exercise.name &&
          element.day === moment(day.date).utc().format('dddd'),
      );
      const orderedSets = Object.keys(exercise.sets)
        .sort()
        .reduce((set, setKey) => {
          set[setKey] = exercise.sets[setKey];
          return set;
        }, {});
      exercise = {...exercise, sets: orderedSets};
      Object.keys(exercise.sets).forEach((setKey, index) => {
        exercise.sets[setKey].trainer = {
          note: '',
          //eigl ist Abfrage hinfällig weil es für jede exercise aus alten woche einen progressionswert geben muss
          // (Übungen ändern sich ja nicht)
          load: progressionExercise
            ? progressionExercise.newLoad[index].load
            : exercise.sets[setKey].trainer
            ? exercise.sets[setKey].trainer.load
            : exercise.sets[setKey].athlete?.load,
          reps: progressionExercise
            ? progressionExercise.reps[index].reps
            : exercise.sets[setKey].trainer
            ? exercise.sets[setKey].trainer.reps
            : exercise.sets[setKey].athlete?.reps,
          rpe: progressionExercise ? progressionExercise.rpe[index].rpe : '',
          video: '',
          duration: -1,
          breaks: -1,
          oneRm: -1,
          videoRequired: false,
          percentOneRm: '',
          trainerPercentage: -1,
        };
      });
      copiedWeek.trainingDays[key].exercises[exerciseKey] = exercise;
    });
  });
  return copiedWeek;
};

export type NewSetsType = {
  amount: number | undefined;
  load: string;
  rpe: string;
  reps: string;
  percentOneRm?: string;
  trainerPercentage?: string;
  usePercentOneRm?: boolean;
};
export const addSetsToTraining = (
  values: NewSetsType,
  exerciseIndex: number,
  dayIndex: number,
  amountSets: number,
  firestore: ExtendedFirestoreInstance,
  athleteUserId: string,
  trainingId: string,
) => {
  const changeObject: any = {};
  const reps = values && values.reps ? values.reps : '-1';
  const rpe = values && values.rpe ? values.rpe : '-1';
  const load = values && values.load ? values.load : '-1';
  const percentOneRm =
    values && values.percentOneRm ? values.percentOneRm : '-1';
  const amount = values && values.amount ? values.amount : 1;
  const trainerPercentage =
    values && values.trainerPercentage ? values.trainerPercentage : '-1';
  const usePercentOneRm = values?.usePercentOneRm ?? false;

  for (let index = 0; index < amount; index++) {
    const path =
      'trainingDays.' +
      dayIndicesArray[dayIndex] +
      '.exercises.exercise' +
      exerciseIndex +
      '.sets.set' +
      (amountSets + index);

    changeObject[path] = {
      index: amountSets + index,
      trainer: {
        note: '',
        reps: reps,
        rpe: rpe,
        load: load,
        video: '',
        duration: -1,
        breaks: '',
        oneRm: -1,
        percentOneRm: percentOneRm,
        trainerPercentage: trainerPercentage,
        usePercentOneRm: usePercentOneRm,
      },
      athlete: {
        note: '',
        reps: -1,
        rpe: -1,
        load: -1,
        video: '',
        duration: -1,
        breaks: '',
        oneRm: -1,
      },
    };
  }
  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingId),
    changeObject,
  );
};

export const removeSetFromExercise = async (
  sets: SetsContainerType,
  setRemove: string,
  trainingWeekId: string,
  dayIndex: number,
  exerciseIndex: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const changeObject: any = {};
  let newSets = cloneDeep(sets);
  delete newSets[setRemove];
  newSets = Object.keys(newSets)
    .sort((a, b) => parseFloat(a.slice(3)) - parseFloat(b.slice(3)))
    .reduce(
      (acc, key, index) => ({
        ...acc,
        ...{['set' + index]: {...newSets[key], index: index}},
      }),
      {},
    );
  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.exercise' +
    exerciseIndex +
    '.sets';
  changeObject[path] = newSets;

  await firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingWeekId),
    changeObject,
  );
};

export const editValue = (
  trainingWeekId: string,
  dayIndex: number,
  exerciseIndex: number,
  setIndex: number,
  key: string,
  value: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const changeObject: any = {};

  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.exercise' +
    exerciseIndex +
    '.sets.set' +
    setIndex +
    '.trainer.' +
    key;
  changeObject[path] = value;

  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingWeekId),
    changeObject,
  );
};

// handle changes for supersets and return supersetId for new exercise and adjusted supersetMeta
const handleSupersetAddExercise = (
  exerciseIndex: number,
  tempIndex: number,
  exercises: ExercisesContainer,
  supersetMeta: SupersetMeta,
) => {
  const superId = exercises['exercise' + exerciseIndex]?.supersetId;
  const supersetMetaItem = supersetMeta?.[superId];
  const supersetIndexArray = cloneDeep(
    supersetMetaItem?.exerciseIndices,
  )?.sort();
  const newExerciseIsPartOfSuperset = !supersetMetaItem
    ? false
    : tempIndex > supersetIndexArray[0] &&
      tempIndex < supersetIndexArray[supersetIndexArray.length - 1];
  const newSupersetMeta = supersetMeta ? cloneDeep(supersetMeta) : undefined;
  const returnValueSuperId = newExerciseIsPartOfSuperset
    ? supersetMetaItem.id
    : undefined;

  if (newSupersetMeta) {
    Object.values(newSupersetMeta).forEach((superset) => {
      // Move each exercise after the new exercise one index up
      console.log(newSupersetMeta);
      newSupersetMeta[superset.id].exerciseIndices =
        superset.exerciseIndices.map((index) => {
          if (index >= exerciseIndex) {
            return index + 1;
          } else {
            return index;
          }
        });
      // Add new exercise index to supersetMeta
      if (newExerciseIsPartOfSuperset && superset.id === superId) {
        const newArray = cloneDeep(superset.exerciseIndices);
        newArray.push(exerciseIndex);
        newSupersetMeta[superset.id].exerciseIndices = newArray.sort();
      }
    });
  }

  return {returnValueSuperId, newSupersetMeta};
};

export const editWeekName = (
  trainingWeekId: string,
  name: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    name: name,
  });
};

export const addExerciseToTraining = (
  exerciseIndex: number,
  exercises: ExercisesContainer,
  supersetMeta: SupersetMeta,
  useRir: boolean,
  dayIndex: number,
  firestore: ExtendedFirestoreInstance,
  athleteUserId: string,
  trainingId: string,
) => {
  // The new exercise will have exerciseIndex as index
  // exerciseIndex - 0.5 is used to insert the exercise temporarily above the current exercise in the exercise list
  // afterwards each exercise gets its current position in the list as index
  let newExercises = {};
  const tempIndex = exerciseIndex - 0.5;
  if (exercises) {
    newExercises = cloneDeep(exercises);
  }
  const {returnValueSuperId, newSupersetMeta} = handleSupersetAddExercise(
    exerciseIndex,
    tempIndex,
    exercises,
    supersetMeta,
  );
  newExercises['exercise' + tempIndex] = {
    id: '',
    name: '',
    sets: {},
    startTime: '',
    endTime: '',
    index: 0,
    trainerNote: '',
    useRir: useRir,
    ...(returnValueSuperId && {
      supersetId: returnValueSuperId,
    }),
  };

  newExercises = Object.keys(newExercises)
    .sort((a, b) => parseFloat(a.slice(8)) - parseFloat(b.slice(8)))
    .reduce(
      (acc, key, index) => ({
        ...acc,
        ...{
          ['exercise' + index]: {
            ...newExercises[key],
            index: index,
          },
        },
      }),
      {},
    );
  const pathExercises =
    'trainingDays.' + dayIndicesArray[dayIndex] + '.exercises';
  const pathNoTraining =
    'trainingDays.' + dayIndicesArray[dayIndex] + '.noTraining';
  const changeObject = {
    [pathExercises]: newExercises,
    [pathNoTraining]: false,
    ...(newSupersetMeta && {
      ['trainingDays.' + dayIndicesArray[dayIndex] + '.supersetMeta']:
        newSupersetMeta,
    }),
  };

  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingId),
    changeObject,
  );
};

export const addCopiedExerciseToTraining = (
  exerciseIndex: number,
  exercises: any,
  dayIndex: number,
  firestore: ExtendedFirestoreInstance,
  athleteUserId: string,
  trainingId: string,
  exerciseCopy: ExerciseType,
  supersetId: string | undefined,
  supersetMeta: SupersetMeta | undefined,
) => {
  let newExercisesObject = {};
  if (exercises) {
    newExercisesObject = cloneDeep(exercises);
  }

  const newExercise = cloneDeep(exerciseCopy);
  //Overwrite the athletes values in the sets
  Object.keys(newExercise.sets).forEach((setKey) => {
    newExercise.sets[setKey].athlete = {
      note: '',
      reps: -1,
      rpe: -1,
      load: -1,
      video: '',
      duration: -1,
      breaks: -1,
      oneRm: -1,
      isDone: false,
    };
  });
  const changeObject = {};

  // Superset handling
  if (supersetMeta) {
    const newSupersetMeta = Object.values(supersetMeta).reduce(
      (newMeta, element) => {
        newMeta[element.id] = {
          ...element,
          exerciseIndices: element.exerciseIndices.reduce((newArray, index) => {
            if (index === exerciseIndex) {
              return [...newArray, index, index + 1];
            } else if (index > exerciseIndex) {
              return [...newArray, index + 1];
            } else {
              return [...newArray, index];
            }
          }, []),
        };
        return newMeta;
      },
      {},
    );
    changeObject[
      'trainingDays.' + dayIndicesArray[dayIndex] + '.supersetMeta'
    ] = newSupersetMeta;
    if (supersetId) {
      newExercise.supersetId = supersetId;
    }
  }

  //new exercise object needs to be used
  newExercisesObject['exercise' + (exerciseIndex - 0.5)] = newExercise;

  newExercisesObject = Object.keys(newExercisesObject)
    .sort((a, b) => parseFloat(a.slice(8)) - parseFloat(b.slice(8)))
    .reduce(
      (acc, key, index) => ({
        ...acc,
        ...{
          ['exercise' + index]: {...newExercisesObject[key], index: index},
        },
      }),
      {},
    );

  const path = 'trainingDays.' + dayIndicesArray[dayIndex] + '.exercises';
  const pathNoTraining =
    'trainingDays.' + dayIndicesArray[dayIndex] + '.noTraining';

  firestore.update(specificTrainingDataQuery(athleteUserId, trainingId), {
    [path]: newExercisesObject,
    [pathNoTraining]: false,
    ...changeObject,
  });
};

export const setPercentageCalcExercise = (
  value: boolean,
  exerciseIndex: number,
  trainingWeekId: string,
  dayIndex: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.exercise' +
    exerciseIndex +
    '.usePercentageCalc';
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    [path]: value,
  });
};
export const setUseRir = (
  value: boolean,
  exerciseIndex: number,
  trainingWeekId: string,
  dayIndex: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.exercise' +
    exerciseIndex +
    '.useRir';
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    [path]: value,
  });
};

// handle changes for supersets and return supersetId for new exercise and adjusted supersetMeta
const handleSupersetRemoveExercise = (
  exerciseIndex: number,
  supersetMeta: SupersetMeta,
) => {
  const newSupersetMeta = supersetMeta ? cloneDeep(supersetMeta) : undefined;
  let remainingSupersetExerciseIndex = -1;
  if (newSupersetMeta) {
    Object.values(newSupersetMeta).forEach((superset) => {
      if (!superset.exerciseIndices) return;
      // Move each exercise after the new exercise one index down
      // Remove exercise index from supersetMeta
      const newIndexArray = superset?.exerciseIndices?.reduce((acc, value) => {
        if (value !== exerciseIndex) {
          acc.push(value >= exerciseIndex ? value - 1 : value);
        }
        return acc;
      }, []);
      // If only one exercise in superset remaining => delete superset
      if (newIndexArray?.length > 1) {
        newSupersetMeta[superset.id].exerciseIndices = newIndexArray;
      } else {
        // Get remaining exercise index from original superset
        remainingSupersetExerciseIndex = newSupersetMeta[
          superset.id
        ].exerciseIndices.filter((element) => element !== exerciseIndex)[0];
        delete newSupersetMeta[superset.id];
      }
    });
  }

  return {newSupersetMeta, remainingSupersetExerciseIndex};
};
export const removeExercise = (
  exercises: ExercisesContainer,
  supersetMeta: SupersetMeta,
  exerciseIndex: number,
  trainingWeekId: string,
  dayIndex: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const pathExercises =
    'trainingDays.' + dayIndicesArray[dayIndex] + '.exercises';
  let newExercises = cloneDeep(exercises);
  delete newExercises['exercise' + exerciseIndex];
  const {newSupersetMeta, remainingSupersetExerciseIndex} =
    handleSupersetRemoveExercise(exerciseIndex, supersetMeta);
  // If only one exercise in superset remaining => delete superset id
  if (remainingSupersetExerciseIndex !== -1) {
    delete newExercises['exercise' + remainingSupersetExerciseIndex].supersetId;
  }

  newExercises = Object.keys(newExercises)
    .sort((a, b) => parseFloat(a.slice(8)) - parseFloat(b.slice(8)))
    .reduce(
      (acc, key, index) => ({
        ...acc,
        ...{
          ['exercise' + index]: {
            ...newExercises[key],
            index: index,
          },
        },
      }),
      {},
    );
  const pathNoTraining =
    'trainingDays.' + dayIndicesArray[dayIndex] + '.noTraining';
  const changeObject = {
    [pathExercises]: newExercises,
    [pathNoTraining]: Object.keys(newExercises).length < 1,
    ...(newSupersetMeta && {
      ['trainingDays.' + dayIndicesArray[dayIndex] + '.supersetMeta']:
        newSupersetMeta,
    }),
  };
  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingWeekId),
    changeObject,
  );
};

export const moveExercise = (
  exercises: ExercisesContainer,
  oldExerciseIndex: number,
  supersetMeta: SupersetMeta,
  up: boolean,
  trainingWeekId: string,
  dayIndex: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const newExercises = cloneDeep(exercises);
  const newSuperMeta = cloneDeep(supersetMeta);
  const lastIndex = Object.keys(newExercises).length - 1;
  // Up = true => move exercise up on screen / reduce index
  let newIndex = up ? oldExerciseIndex - 1 : oldExerciseIndex + 1;
  newIndex = newIndex < 0 ? 0 : newIndex;
  newIndex = newIndex > lastIndex ? lastIndex : newIndex;
  // OldExercise exercise which is moved
  const oldExercise = newExercises['exercise' + oldExerciseIndex];
  // NewExercise exercise at target position
  const newExercise = newExercises['exercise' + newIndex];

  const oldSuperId = oldExercise.supersetId;
  const newSuperId = newExercise.supersetId;

  const oldSuperIndices = newSuperMeta?.[oldSuperId]?.exerciseIndices;
  const newSuperIndices = newSuperMeta?.[newSuperId]?.exerciseIndices;

  // Top or bottom reached
  if (oldExerciseIndex === newIndex) {
    return;
  }

  const switchSupersets = () => {
    // Adjust old superset
    const newIndicesLength = newSuperIndices.length;
    newSuperMeta[oldSuperId].exerciseIndices = oldSuperIndices.map(
      (oldValue) => {
        const newValue = up
          ? oldValue - newIndicesLength
          : oldValue + newIndicesLength;
        const oldExerciseValue = exercises['exercise' + oldValue];
        newExercises['exercise' + newValue] = {
          ...oldExerciseValue,
          index: newValue,
        };
        return newValue;
      },
    );
    // Adjust new superset
    const oldIndicesLength = oldSuperIndices.length;
    newSuperMeta[newSuperId].exerciseIndices = newSuperIndices.map(
      (oldValue) => {
        const newValue = up
          ? oldValue + oldIndicesLength
          : oldValue - oldIndicesLength;
        const oldExerciseValue = exercises['exercise' + oldValue];
        newExercises['exercise' + newValue] = {
          ...oldExerciseValue,
          index: newValue,
        };
        return newValue;
      },
    );
  };
  const switchExercisesInsideSuperset = () => {
    newExercises['exercise' + newIndex] = {...oldExercise, index: newIndex};
    newExercises['exercise' + oldExerciseIndex] = {
      ...newExercise,
      index: oldExerciseIndex,
    };
  };
  const switchSupersetWithExercise = () => {
    // Adjust old superset
    newSuperMeta[oldSuperId].exerciseIndices = oldSuperIndices.map(
      (oldValue) => {
        const newValue = up ? oldValue - 1 : oldValue + 1;
        const oldExerciseValue = exercises['exercise' + oldValue];
        newExercises['exercise' + newValue] = {
          ...oldExerciseValue,
          index: newValue,
        };
        return newValue;
      },
    );
    // Move new exercise
    const indexArrayLength = oldSuperIndices.length;
    const newIndexNewExercise = up
      ? newIndex + indexArrayLength
      : newIndex - indexArrayLength;
    newExercises['exercise' + newIndexNewExercise] = {
      ...newExercise,
      index: newIndexNewExercise,
    };
  };
  const switchExerciseWithSuperset = () => {
    // Adjust new superset
    newSuperMeta[newSuperId].exerciseIndices = newSuperIndices.map(
      (oldValue) => {
        const newValue = up ? oldValue + 1 : oldValue - 1;
        const oldExerciseValue = exercises['exercise' + oldValue];
        newExercises['exercise' + newValue] = {
          ...oldExerciseValue,
          index: newValue,
        };
        return newValue;
      },
    );
    // Move old exercise
    const indexArrayLength = newSuperIndices.length;
    const newIndexOldExercise = up
      ? oldExerciseIndex - indexArrayLength
      : oldExerciseIndex + indexArrayLength;
    newExercises['exercise' + newIndexOldExercise] = {
      ...oldExercise,
      index: newIndexOldExercise,
    };
  };
  const switchExercises = () => {
    newExercises['exercise' + newIndex] = {
      ...oldExercise,
      index: newIndex,
    };
    newExercises['exercise' + oldExerciseIndex] = {
      ...newExercise,
      index: oldExerciseIndex,
    };
  };

  // 1) OldExercise is part of ss
  if (oldSuperId && oldSuperIndices) {
    // 1a) OldExercise and NewExercise are part of same ss
    if (oldSuperId === newSuperId) {
      switchExercisesInsideSuperset();
    }
    // 1b) NewExercise is part of ss
    else if (newSuperId && newSuperIndices) {
      switchSupersets();
    }
    // 1c) NewExercise is not part of ss
    else {
      switchSupersetWithExercise();
    }
  }
  // 2) OldExercise is not part of ss
  else {
    // 2a) NewExercise is part of ss
    if (newSuperId) {
      switchExerciseWithSuperset();
    }
    // 2b) NewExercise is not part of ss
    else {
      switchExercises();
    }
  }

  const path = 'trainingDays.' + dayIndicesArray[dayIndex] + '.exercises';
  const pathSuperMeta =
    'trainingDays.' + dayIndicesArray[dayIndex] + '.supersetMeta';
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    [path]: newExercises,
    ...(newSuperMeta && {[pathSuperMeta]: newSuperMeta}),
  });
};

export const moveSet = async (
  sets: any,
  oldSetIndex: number,
  up: boolean,
  trainingWeekId: string,
  dayIndex: number,
  exerciseIndex: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  let newSets = cloneDeep(sets);
  const indexAdjustment = up ? -1.5 : 1.5;
  newSets['set' + (oldSetIndex + indexAdjustment)] =
    newSets['set' + oldSetIndex];
  delete newSets['set' + oldSetIndex];

  newSets = Object.keys(newSets)
    .sort((a, b) => parseFloat(a.slice(3)) - parseFloat(b.slice(3)))
    .reduce(
      (acc, key, index) => ({
        ...acc,
        ...{['set' + index]: {...newSets[key], index: index}},
      }),
      {},
    );
  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.' +
    'exercise' +
    exerciseIndex +
    '.sets';

  await firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingWeekId),
    {
      [path]: newSets,
    },
  );
};

export const editExercise = (
  key: string,
  value: any,
  trainingWeekId: string,
  dayIndex: number,
  exerciseIndex: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.exercise' +
    exerciseIndex +
    '.' +
    key;
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    [path]: value,
  });
};

export const editName = (
  trainingWeekId: string,
  dayIndex: number,
  exerciseIndex: number,
  value: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.exercise' +
    exerciseIndex +
    '.trainerNote';
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    [path]: value,
  });
};

export const editExerciseName = (
  trainingWeekId: string,
  dayIndex: number,
  exerciseIndex: number,
  value: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.exercise' +
    exerciseIndex +
    '.name';
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    [path]: value,
  });
};

export const editExerciseCategory = (
  trainingWeekId: string,
  dayIndex: number,
  exerciseIndex: number,
  value: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.exercise' +
    exerciseIndex +
    '.category';
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    [path]: value,
  });
};

export const editExerciseType = (
  trainingWeekId: string,
  dayIndex: number,
  exerciseIndex: number,
  type: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const path =
    'trainingDays.' +
    dayIndicesArray[dayIndex] +
    '.exercises.exercise' +
    exerciseIndex +
    '.primaryExercise';
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    [path]: type,
  });
};

export const deleteDay = (
  trainingWeekId: string,
  dayIndex: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const path = 'trainingDays.' + dayIndicesArray[dayIndex];
  const noTrainingPath = path + '.noTraining';
  const exercisesPath = path + '.exercises';
  const namePath = path + '.name';
  const supersetMetaPath = path + '.supersetMeta';
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingWeekId), {
    [noTrainingPath]: true,
    [exercisesPath]: {},
    [namePath]: '',
    [supersetMetaPath]: firestore.FieldValue.delete(),
  });
};

export const editDay = (
  trainingWeekId: string,
  changeObject: any,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingWeekId),
    changeObject,
  );
};

export const insertCopiedDay = (
  trainingId: string,
  dayIndex: number,
  dayCopied: DayType,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const newDay = cloneDeep(dayCopied);
  //Overwrite the athletes values in the sets
  Object.keys(newDay.exercises).forEach((exerciseKey) => {
    const newExercise = cloneDeep(newDay.exercises[exerciseKey]);
    Object.keys(newExercise.sets).forEach((setKey) => {
      newExercise.sets[setKey].athlete = {
        note: '',
        reps: -1,
        rpe: -1,
        load: -1,
        video: '',
        duration: -1,
        breaks: -1,
        oneRm: -1,
        isDone: false,
      };
    });
    newDay.exercises[exerciseKey] = newExercise;
  });

  const pathDay = 'trainingDays.' + dayIndicesArray[dayIndex];
  const pathExercises = pathDay + '.exercises';
  const pathName = pathDay + '.name';
  const pathNoTrain = pathDay + '.noTraining';
  const pathSuperMeta = pathDay + '.supersetMeta';

  const changeObject = {};
  if (newDay.name) {
    changeObject[pathName] = newDay.name;
  }
  if (newDay.supersetMeta) {
    changeObject[pathSuperMeta] = newDay.supersetMeta;
  }
  changeObject[pathExercises] = newDay.exercises;
  changeObject[pathNoTrain] = newDay.noTraining;
  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingId),
    changeObject,
  );
};

export const insertCopiedWeek = async (
  trainingId: string,
  weekCopied: TrainingType,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const oldWeek = cloneDeep(weekCopied) as TrainingType;
  const changeObject = {} as any;
  //Overwrite the athletes values in the sets
  Object.keys(oldWeek.trainingDays).forEach((dayKey) => {
    const day = oldWeek.trainingDays[dayKey];
    Object.keys(day.exercises).forEach((exerciseKey) => {
      const newExercise = cloneDeep(day.exercises[exerciseKey]);
      Object.keys(newExercise.sets).forEach((setKey) => {
        newExercise.sets[setKey].athlete = {
          note: '',
          reps: -1,
          rpe: -1,
          load: -1,
          video: '',
          duration: -1,
          breaks: '',
          oneRm: -1,
        };
      });
      day.exercises[exerciseKey] = newExercise;
    });
    const pathDay = 'trainingDays.' + dayKey;
    const pathExercises = pathDay + '.exercises';
    const pathName = pathDay + '.name';
    const pathNoTrain = pathDay + '.noTraining';
    const pathSuperMeta = pathDay + '.supersetMeta';

    if (day.name) {
      changeObject[pathName] = day.name;
    }
    if (day.supersetMeta) {
      changeObject[pathSuperMeta] = day.supersetMeta;
    }
    changeObject[pathExercises] = day.exercises;
    changeObject[pathNoTrain] = day.noTraining;
  });
  changeObject.name = oldWeek.name;
  changeObject.feedback = oldWeek.feedback ?? '';
  await firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingId),
    changeObject,
  );
};

export const createNewDayTemplate = async (
  dayTraining: DayType,
  dayName: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const uploadDay = {
    noTraining: dayTraining.noTraining,
    warmUp: dayTraining.warmUp,
    exercises: {},
    coolDown: dayTraining.coolDown,
    startTime: '',
    endTime: '',
    sessionRpe: -1,
    name: dayName,
    ...(dayTraining.supersetMeta && {supersetMeta: dayTraining.supersetMeta}),
  };

  //Overwrite the athletes values in the sets
  Object.keys(dayTraining.exercises).forEach((exerciseKey) => {
    const newExercise = cloneDeep(dayTraining.exercises[exerciseKey]);
    Object.keys(newExercise.sets).forEach((setKey) => {
      newExercise.sets[setKey].athlete = {
        note: '',
        reps: -1,
        rpe: -1,
        load: -1,
        video: '',
        duration: -1,
        breaks: -1,
        oneRm: -1,
        isDone: false,
      };
    });
    uploadDay.exercises[exerciseKey] = newExercise;
  });

  const doc = await firestore.add(addDayTemplateQuery(userId), {
    name: dayName,
    training: uploadDay,
  });
  await firestore.set(
    specificDayTemplateQuery(userId, doc.id),
    {id: doc.id},
    {merge: true},
  );
  const path = 'trainer.dayTemplatesArray';
  await firestore.update(usersDataQuery(userId), {
    [path]: firebase.firestore.FieldValue.arrayUnion({
      id: doc.id,
      name: dayName,
    }),
  });
};

export const deleteDayTemplate = async (
  templateId: string,
  templateName: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  await firestore.delete(specificDayTemplateQuery(userId, templateId));
  const path = 'trainer.dayTemplatesArray';
  await firestore.update(usersDataQuery(userId), {
    [path]: firebase.firestore.FieldValue.arrayRemove({
      id: templateId,
      name: templateName,
    }),
  });
};

export const deleteWeekTemplate = async (
  templateId: string,
  templateName: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  await firestore.delete(specificWeekTemplateQuery(userId, templateId));
  const path = 'trainer.weekTemplatesArray';
  await firestore.update(usersDataQuery(userId), {
    [path]: firebase.firestore.FieldValue.arrayRemove({
      id: templateId,
      name: templateName,
    }),
  });
};

export const insertDayTemplate = async (
  trainingId: string,
  dayIndex: number,
  templateId: string,
  userId: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  try {
    const result = await firestore.get(
      specificDayTemplateQuery(userId, templateId),
    );

    const data = result.data() as DayTemplateType;
    if (data) {
      const path = 'trainingDays.' + dayIndicesArray[dayIndex];
      const changeObject = {};
      Object.keys(data.training).forEach((key) => {
        changeObject[path + '.' + key] = data.training[key];
      });
      firestore.update(
        specificTrainingDataQuery(athleteUserId, trainingId),
        changeObject,
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const editWeek = (
  trainingWeekId: string,
  changeObject: any,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingWeekId),
    changeObject,
  );
};

const createEmptyWeekTemplate = (weekTraining: TrainingType) => {
  const trainingDays = cloneDeep(weekTraining.trainingDays);
  const result = [];
  Object.keys(trainingDays).forEach((dayKey) => {
    const resultExercises = cloneDeep(trainingDays[dayKey].exercises);
    Object.keys(trainingDays[dayKey].exercises).forEach((exerciseKey) => {
      Object.keys(trainingDays[dayKey].exercises[exerciseKey].sets).forEach(
        (setKey) => {
          resultExercises[exerciseKey].sets[setKey].athlete = {
            note: '',
            reps: -1,
            rpe: -1,
            load: -1,
            video: '',
            duration: -1,
            breaks: '',
            oneRm: -1,
          };
        },
      );
    });
    result.push({
      dayKey: dayKey,
      exercises: resultExercises,
      dayName: trainingDays[dayKey].name ? trainingDays[dayKey].name : '',
      noTraining: trainingDays[dayKey].noTraining,
      ...(trainingDays[dayKey].supersetMeta && {
        supersetMeta: trainingDays[dayKey].supersetMeta,
      }),
    });
  });
  return result;
};

export const createNewWeekTemplate = async (
  weekTraining: TrainingType,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const result = createEmptyWeekTemplate(weekTraining);
  const doc = await firestore.add(addWeekTemplateQuery(userId), {
    name: weekTraining.name,
    feedback: weekTraining.feedback,
    trainingDays: result,
  });
  await firestore.set(
    specificWeekTemplateQuery(userId, doc.id),
    {id: doc.id},
    {merge: true},
  );
  const path = 'trainer.weekTemplatesArray';
  await firestore.update(usersDataQuery(userId), {
    [path]: firebase.firestore.FieldValue.arrayUnion({
      id: doc.id,
      name: weekTraining.name,
    }),
  });
};

export const createCycleTemplate = async (
  weeks: TrainingType[],
  templateName: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const templateObject = {};

  weeks.forEach((week, index) => {
    if (checkWeekIsOverlapping(week)) {
      throw new Error('WeekOverlapping');
    }
    templateObject['week' + index] = {
      name: week.name,
      feedback: week.feedback ?? '',
      trainingDays: createEmptyWeekTemplate(week),
    };
  });

  const doc = await firestore.add(addCycleTemplateQuery(userId), {
    name: templateName,
    template: templateObject,
  });
  await firestore.set(
    specificCycleTemplateQuery(userId, doc.id),
    {id: doc.id},
    {merge: true},
  );
  const path = 'trainer.cycleTemplatesArray';
  await firestore.update(usersDataQuery(userId), {
    [path]: firebase.firestore.FieldValue.arrayUnion({
      id: doc.id,
      name: templateName,
    }),
  });
};

export const insertWeekTemplate = async (
  trainingId: string,
  templateId: string,
  userId: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  try {
    const result = await firestore.get(
      specificWeekTemplateQuery(userId, templateId),
    );
    const data = result.data() as WeekTemplateType;
    insertWeekTemplateHelper(data, trainingId, athleteUserId, firestore);
  } catch (error) {
    console.log(error);
  }
};

const insertWeekTemplateHelper = async (
  data: WeekTemplateType,
  trainingId: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
  startDate?: string,
  startActiveWeek?: string,
) => {
  if (data) {
    const changeObject: any = {};
    changeObject.name = data.name;
    changeObject.feedback = data.feedback ?? '';
    data.trainingDays.forEach((trainingDay, index) => {
      const dayPath = 'trainingDays.' + trainingDay.dayKey;
      const exercisesPath = dayPath + '.exercises';
      const namePath = dayPath + '.name';
      changeObject[namePath] = trainingDay.dayName;
      if (
        startDate &&
        startActiveWeek &&
        moment(startDate).add(index, 'day').isBefore(moment(startActiveWeek))
      ) {
        return;
      }
      changeObject[exercisesPath] = trainingDay.exercises;
      changeObject[dayPath + '.noTraining'] = trainingDay.noTraining;
      if (trainingDay.supersetMeta) {
        changeObject[dayPath + '.supersetMeta'] = trainingDay.supersetMeta;
      }
    });
    firestore.update(
      specificTrainingDataQuery(athleteUserId, trainingId),
      changeObject,
    );
  }
};

export const createNewCycleWithTemplate = async (
  currentAthletePlanningDate: string,
  templateId: string,
  initialStartDate: string,
  currentCycle: number,
  userId: string,
  dailyCheckId: string,
  weeklyCheckId: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const startDate = moment(initialStartDate);
  try {
    const cycleTemplate = await firestore.get(
      specificCycleTemplateQuery(userId, templateId),
    );
    const data = cycleTemplate.data() as CycleTemplateType;
    if (data) {
      const weekTemplates = Object.keys(data.template)
        .sort((a, b) => parseFloat(a.slice(4)) - parseFloat(b.slice(4)))
        .map((key) => data.template[key]);
      for (let i = 0; i < weekTemplates.length; i++) {
        const docId = await createNewTraining(
          currentAthletePlanningDate,
          [],
          athleteUserId,
          userId,
          firestore,
          startDate,
          i + 1,
          currentCycle,
          dailyCheckId,
          weeklyCheckId,
        );
        await insertWeekTemplateHelper(
          weekTemplates[i],
          docId,
          athleteUserId,
          firestore,
          startDate.toISOString(),
        );

        startDate.add(7, 'days');
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteCycleTemplate = async (
  templateId: string,
  templateName: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  await firestore.delete(specificCycleTemplateQuery(userId, templateId));
  const path = 'trainer.cycleTemplatesArray';
  await firestore.update(usersDataQuery(userId), {
    [path]: firebase.firestore.FieldValue.arrayRemove({
      id: templateId,
      name: templateName,
    }),
  });
};

export const editDailyCheckValues = async (
  trainingId: string,
  trainingPlan: TrainingType,
  changeObjects: Array<{
    categoryIndex: number;
    questionIndex: number;
    value: string;
  }>,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const changeObject: any = {};
  dayIndicesArray.forEach((dayKey) => {
    const newCheck = cloneDeep(trainingPlan.trainingDays[dayKey].dailyCheck);
    changeObjects.forEach((element) => {
      newCheck[element.categoryIndex].question[
        element.questionIndex
      ].trainer.value = element.value;
      const path = 'trainingDays.' + dayKey + '.dailyCheck';
      changeObject[path] = newCheck;
    });
  });

  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingId),
    changeObject,
  );
};

export const editSpecificDailyCheckValue = async (
  trainingId: string,
  trainingPlan: TrainingType,
  changeObjects: Array<{
    categoryIndex: number;
    questionIndex: number;
    value: string;
  }>,
  athleteUserId: string,
  dayIndex: number,
  firestore: ExtendedFirestoreInstance,
) => {
  const dayKey = dayIndicesArray[dayIndex];
  const changeObject: any = {};
  const path = 'trainingDays.' + dayKey + '.dailyCheck';
  const newCheck = cloneDeep(trainingPlan.trainingDays[dayKey].dailyCheck);
  changeObjects.forEach((element) => {
    newCheck[element.categoryIndex].question[
      element.questionIndex
    ].trainer.value = element.value;
  });
  changeObject[path] = newCheck;
  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingId),
    changeObject,
  );
};
export const editDefineDailyMakros = async (
  trainingId: string,
  athleteUserId: string,
  value: boolean,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingId), {
    defineDailyMakros: value,
  });
};

export const insertDailyCheckCopy = async (
  dailyCheckValuesCopy: any,
  trainingPlan: TrainingType,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const changeObject: any = {};
  dayIndicesArray.forEach((dayKey) => {
    const newCheck = cloneDeep(trainingPlan.trainingDays[dayKey].dailyCheck);
    Object.keys(dailyCheckValuesCopy).forEach((key) => {
      const check = dailyCheckValuesCopy[key];
      newCheck[check.categoryIndex].question[
        check.questionIndex
      ].trainer.value = check.value;
    });
    const path = 'trainingDays.' + dayKey + '.dailyCheck';
    changeObject[path] = newCheck;
  });
  firestore.update(
    specificTrainingDataQuery(athleteUserId, trainingPlan.id),
    changeObject,
  );
};

export const editTrainerFeedback = async (
  trainingId: string,
  value: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const path = 'feedback';
  firestore.update(specificTrainingDataQuery(athleteUserId, trainingId), {
    [path]: value,
  });
};
