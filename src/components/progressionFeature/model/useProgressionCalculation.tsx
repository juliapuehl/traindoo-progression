import {all, create} from 'mathjs';
import moment from 'moment';
import {useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  getAllTrainings,
  getProgressionUserIsUnlocked,
} from '../../../logic/firestore';
import {
  DayType,
  ExerciseType,
  SetsContainerType,
  TrainingType,
} from '../../../traindoo_shared/types/Training';

export type CompressedTrainingType = {
  calendarWeek: number;
  weekNr: number;
  cycleNr: number;
  weekName: string;
  date: string;
  sets: SetsContainerType;
  useRir: boolean;
};

export const useProgressionCalculation = () => {
  const displayProgressionTool = useSelector(getProgressionUserIsUnlocked);
  const allTrainings = useSelector(getAllTrainings);
  const [progressionData, setProgressionData] = useState<any[]>();
  useMemo(() => {
    if (!displayProgressionTool) return;
    const math = create(all, {});
    const sortedTrainingsByCalendarWeek = [...allTrainings].sort(
      (a, b) => a.calendarWeek - b.calendarWeek,
    );
    const previousWeek = sortedTrainingsByCalendarWeek?.length;
    //----- PROGRESSION DATA PREPARATION
    const getAllExerciseNames = (trainings: TrainingType[]) => {
      const exerciseNames = [];
      trainings.forEach((trainingWeek) => {
        Object.values(trainingWeek.trainingDays).forEach((day: DayType) => {
          Object.values(day.exercises).forEach((exercise: ExerciseType) => {
            if (!exerciseNames.includes(exercise.name)) {
              exerciseNames.push(exercise.name);
            }
          });
        });
      });
      return exerciseNames;
    };

    const sortTrainingsByExercise = (
      exerciseNames: string[],
      trainings: TrainingType[],
    ) => {
      // per exercise, save its data from all the training weeks
      let allTrainingsOfOneExercise: CompressedTrainingType[] = [];
      const allTrainingsOfAllExercise = new Array(exerciseNames?.length);
      exerciseNames.forEach((exerciseName) => {
        trainings.forEach((trainingWeek, index) => {
          Object.values(trainingWeek.trainingDays).forEach((day: DayType) => {
            Object.values(day.exercises).forEach((exercise: ExerciseType) => {
              if (exercise.name == exerciseName) {
                allTrainingsOfOneExercise.push({
                  calendarWeek: index + 1,
                  weekNr: trainingWeek.trainingWeek,
                  cycleNr: trainingWeek.trainingCycle,
                  weekName: trainingWeek.name,
                  date: day.date,
                  sets: exercise.sets,
                  useRir: exercise.useRir ?? false,
                });
              }
            });
          });
        });
        allTrainingsOfAllExercise[exerciseName] = allTrainingsOfOneExercise;
        allTrainingsOfOneExercise = [];
      });
      return allTrainingsOfAllExercise;
    };

    const extractValues = (exerciseNames, exercises) => {
      const athleteValuesAllExercises = new Array(exerciseNames?.length);
      const trainerValuesAllExercises = new Array(exerciseNames?.length);

      exerciseNames.forEach((exerciseName) => {
        const athleteValuesPerExercise: any[] = [];
        const trainerValuesPerExercise: any[] = [];
        exercises[exerciseName].forEach((week: CompressedTrainingType) => {
          Object.values(week.sets).forEach((set: any) => {
            const baseValue = {
              calendarWeek: week.calendarWeek,
              weekNr: week.weekNr,
              cycleNr: week.cycleNr,
              weekName: week.weekName,
              date: week.date,
              set: set.index,
            };
            athleteValuesPerExercise.push({
              ...baseValue,
              load: set?.athlete?.load,
              reps: set?.athlete?.reps,
              rpe: set?.athlete?.rpe,
              oneRM: set?.athlete?.oneRm,
            });
            trainerValuesPerExercise.push({
              ...baseValue,
              load: set?.trainer?.load,
              reps: set?.trainer?.reps,
              rpe: set?.trainer?.rpe,
              useRir: week.useRir ?? false,
            });
          });
        });
        athleteValuesAllExercises[exerciseName] = athleteValuesPerExercise;
        trainerValuesAllExercises[exerciseName] = trainerValuesPerExercise;
      });
      return {
        athleteValues: athleteValuesAllExercises,
        trainerValues: trainerValuesAllExercises,
      };
    };

    const extractTrainerValues = (exerciseNames, exercises) => {
      const loadsOfLastWeekAllExercises = [];
      exerciseNames.forEach((exerciseName) => {
        const index = exercises[exerciseName]?.length - 1;
        loadsOfLastWeekAllExercises.push({
          exerciseName: exerciseName,
          loadsOfLastWeek: [
            {
              set: exercises[exerciseName][index]?.set,
              load:
                exercises[exerciseName][index]?.load === '-1' ||
                exercises[exerciseName]?.length === 0 ||
                exercises[exerciseName][index]?.load === undefined
                  ? ''
                  : exercises[exerciseName][index]?.load,
            },
          ],
          repsOfLastWeek: [
            {
              set: exercises[exerciseName][index]?.set,
              reps:
                exercises[exerciseName][index]?.reps === '-1' ||
                exercises[exerciseName]?.length === 0 ||
                exercises[exerciseName][index]?.reps === undefined
                  ? ''
                  : exercises[exerciseName][index]?.reps,
            },
          ],
          rpeOfLastWeek: [
            {
              set: exercises[exerciseName][index]?.set,
              rpe:
                exercises[exerciseName][index]?.rpe === '-1' ||
                exercises[exerciseName]?.length === 0 ||
                exercises[exerciseName][index]?.rpe === undefined
                  ? ''
                  : exercises[exerciseName][index]?.rpe,
            },
          ],

          date: exercises[exerciseName][index]?.date,
          useRir: exercises[exerciseName][index]?.useRir ?? false,
        });
      });
      let exerciseIndex = 0;
      exerciseNames.forEach((exerciseName) => {
        let index = exercises[exerciseName]?.length - 1;
        while (
          exercises[exerciseName][index]?.calendarWeek ===
            exercises[exerciseName][index - 1]?.calendarWeek &&
          index >= 0
        ) {
          if (
            exercises[exerciseName][index]?.date ===
            exercises[exerciseName][index - 1]?.date
          ) {
            loadsOfLastWeekAllExercises[exerciseIndex].loadsOfLastWeek.push({
              set: exercises[exerciseName][index - 1]?.set,
              load:
                exercises[exerciseName][index - 1]?.load === '-1' ||
                exercises[exerciseName]?.length === 0 ||
                exercises[exerciseName][index - 1]?.load === undefined
                  ? ''
                  : exercises[exerciseName][index - 1]?.load,
            });
            loadsOfLastWeekAllExercises[exerciseIndex].repsOfLastWeek.push({
              set: exercises[exerciseName][index - 1]?.set,
              reps:
                exercises[exerciseName][index - 1]?.reps === '-1' ||
                exercises[exerciseName]?.length === 0 ||
                exercises[exerciseName][index - 1]?.reps === undefined
                  ? ''
                  : exercises[exerciseName][index - 1]?.reps,
            });
            loadsOfLastWeekAllExercises[exerciseIndex].rpeOfLastWeek.push({
              set: exercises[exerciseName][index - 1]?.set,
              rpe:
                exercises[exerciseName][index - 1]?.rpe === '-1' ||
                exercises[exerciseName]?.length === 0 ||
                exercises[exerciseName][index - 1]?.rpe === undefined
                  ? ''
                  : exercises[exerciseName][index - 1]?.rpe,
            });
            index--;
          } else {
            loadsOfLastWeekAllExercises.splice(exerciseIndex + 1, 0, {
              exerciseName: exerciseName,
              loadsOfLastWeek: [
                {
                  set: exercises[exerciseName][index - 1]?.set,
                  load:
                    exercises[exerciseName][index - 1]?.load === '-1' ||
                    exercises[exerciseName]?.length === 0 ||
                    exercises[exerciseName][index - 1]?.load === undefined
                      ? ''
                      : exercises[exerciseName][index - 1]?.load,
                },
              ],
              repsOfLastWeek: [
                {
                  set: exercises[exerciseName][index - 1]?.set,
                  reps:
                    exercises[exerciseName][index - 1]?.reps === '-1' ||
                    exercises[exerciseName]?.length === 0 ||
                    exercises[exerciseName][index - 1]?.reps === undefined
                      ? ''
                      : exercises[exerciseName][index - 1]?.reps,
                },
              ],
              rpeOfLastWeek: [
                {
                  set: exercises[exerciseName][index - 1]?.set,
                  rpe:
                    exercises[exerciseName][index - 1]?.rpe === '-1' ||
                    exercises[exerciseName]?.length === 0 ||
                    exercises[exerciseName][index - 1]?.rpe === undefined
                      ? ''
                      : exercises[exerciseName][index - 1]?.rpe,
                },
              ],

              date: exercises[exerciseName][index - 1]?.date,
              useRir: exercises[exerciseName][index - 1]?.useRir ?? false,
            });
            index--;
            exerciseIndex++;
          }
        }
        exerciseIndex++;
      });
      return loadsOfLastWeekAllExercises;
    };

    //----- PROGRESSION DATA PROCESSING -----
    const calculateLoadChange = (exerciseData) => {
      const loads = calcAvgLoads(exerciseData);
      const increases = calcLoadIncreases(loads);
      const zScores = calcZscores(increases);
      const avgIncrease = calcAvgLoadIncrease(zScores);
      return avgIncrease;
    };

    const calcAvgLoads = (trainingData) => {
      let index = 0;
      let avgLoad = 0;
      let loadSum = 0;
      let currentWeekNr = 0;
      let counter = 1;
      const loads = [];
      //trainingData is empty
      if (!trainingData || trainingData?.length === 0) {
        console.log('training data for this exercise is empty');
        //trainingData has only one entry
      } else if (trainingData?.length == 1) {
        loads.push({
          avgLoad: trainingData[0].load,
          week: trainingData[0].weekNr,
        });
      } else {
        loadSum = Number(trainingData[0].load);
        currentWeekNr = trainingData[0].weekNr;
        //inputArray is array of objects { weekNr, weekName, date, set, load, reps, oneRM }
        while (index + 1 < trainingData?.length) {
          // if index is the previous to last (this is neccessary because otherwise last week is left out)
          if (index + 1 === trainingData?.length - 1) {
            loadSum += Number(trainingData[index + 1].load);
            counter += 1;
            avgLoad = loadSum / counter;
            loads.push({avgLoad: avgLoad, week: trainingData[index].weekNr});
            index += 1;
          }
          // get load of all sets from the same day (exercise/ week) and sum them up
          else if (trainingData[index + 1].weekNr == currentWeekNr) {
            loadSum += Number(trainingData[index + 1].load);
            counter += 1;
            index += 1;
            // divide them through number of sets
          } else {
            avgLoad = loadSum / counter;
            loads.push({avgLoad: avgLoad, week: trainingData[index].weekNr});
            currentWeekNr = trainingData[index + 1].weekNr;
            loadSum = Number(trainingData[index + 1].load);
            counter = 1;
            index += 1;
          }
        }
      }
      return loads;
    };

    const calcLoadIncreases = (inputArray) => {
      let indexOne = 0;
      const increases = [];
      while (indexOne + 1 < inputArray?.length) {
        while (
          inputArray[indexOne].avgLoad == -1 &&
          indexOne + 1 < inputArray?.length
        ) {
          indexOne++;
        }
        const lowerMark = indexOne;
        let indexTwo = lowerMark + 1;
        if (indexTwo + 1 === inputArray?.length) {
          if (inputArray[indexTwo].avgLoad != -1) {
            increases.push(
              inputArray[indexTwo].avgLoad - inputArray[lowerMark].avgLoad,
            );
          }
        } else if (indexTwo + 1 < inputArray?.length) {
          while (
            inputArray[indexTwo].avgLoad == -1 &&
            indexTwo + 1 < inputArray?.length
          ) {
            indexTwo++;
          }

          const upperMark = indexTwo;
          increases.push(
            inputArray[upperMark].avgLoad - inputArray[lowerMark].avgLoad,
          );
        }
        indexOne++;
      }
      return increases;
    };

    const calcZscores = (inputArray) => {
      const zScores = [];
      if (inputArray?.length > 0) {
        const meanIncrease = math.mean(inputArray);
        const sqrdDiff = inputArray.map((increase) =>
          math.pow(increase - meanIncrease, 2),
        );
        const stdDev = math.sqrt(math.sum(sqrdDiff) / sqrdDiff?.length);
        inputArray.forEach((increase) =>
          zScores.push({
            increase: increase,
            zscore: (increase - meanIncrease) / Number(stdDev),
          }),
        );
      }
      return zScores;
    };

    const roundToHalfOrFull = (avgValue) => {
      const roundedToFull = math.round(avgValue);
      const diff = roundedToFull - avgValue;
      if (avgValue >= 0) {
        if (diff > 0) {
          if (diff > 0.25) {
            return roundedToFull - 0.5;
          } else {
            return roundedToFull;
          }
        } else if (diff > -0.25) {
          return roundedToFull;
        } else {
          return roundedToFull + 0.5;
        }
      } else {
        if (diff < 0) {
          if (diff > -0.25) {
            return roundedToFull;
          } else {
            return roundedToFull + 0.5;
          }
        } else if (diff < 0.25) {
          return roundedToFull;
        } else {
          return roundedToFull - 0.5;
        }
      }
    };

    const calcAvgLoadIncrease = (inputArray) => {
      const increasesWithoutOutliers = [];
      // remove outliers
      inputArray.forEach((increase) => {
        if (increase.zscore < 1 && increase.zscore > -1) {
          increasesWithoutOutliers.push(increase.increase);
        }
      });
      let avgIncrease = 0;
      if (increasesWithoutOutliers?.length > 0) {
        avgIncrease =
          increasesWithoutOutliers.reduce((sum, value) => sum + value, 0) /
          increasesWithoutOutliers?.length;
      }
      const roundedAvgIncrease = math.round(avgIncrease * 10) / 10;
      const halfOrFullValue = roundToHalfOrFull(roundedAvgIncrease);
      return halfOrFullValue;
    };

    const calculateNewLoads = (oldLoads, loadChange) => {
      //old value is a range
      return oldLoads.map((load) => {
        if (
          load.load?.length > 2 &&
          load.load.includes('-') &&
          !load.load.includes('%') &&
          !load.load.includes('+') &&
          !/[A-Za-z]/g.test(load.load)
        ) {
          const rangeValues = load.load.split('-');
          // '-' is used is range
          if (rangeValues[0]?.length > 0 && rangeValues[1]?.length > 0) {
            const lowerLimit =
              rangeValues[0].length > 0
                ? Number(rangeValues[0]?.match(/[\d.]+/)[0]) + loadChange
                : '';
            const upperLimit =
              rangeValues[1].length > 0
                ? Number(rangeValues[1]?.match(/[\d.]+/)[0]) + loadChange
                : '';
            return {
              ...load,
              load: String(
                math.round(lowerLimit * 10) / 10 +
                  '-' +
                  math.round(upperLimit * 10) / 10,
              ),
            };
            // '-' is used as minus
          } else {
            return {
              ...load,
              load: load.load,
            };
          }
        }
        //oldValue is empty
        else if (load.load === '' || load.load === '-1') {
          return {
            ...load,
            load: '',
          };
        }
        //oldValue is a percentage
        else if (load.load?.length > 1 && load.load.includes('%')) {
          return {
            ...load,
            load: load.load,
          };
        }
        //oldValue is a value with plus at the end
        else if (load.load?.length > 1 && load.load.slice(-1) === '+') {
          return {
            ...load,
            load: String(Number(load.load?.match(/[\d.]+/)[0]) + loadChange),
          };
        }
        //oldValue is a value to be added
        else if (load.load?.length > 1 && load.load.includes('+')) {
          return {
            ...load,
            load: load.load,
          };
        }
        //oldValue is a string (always)
        else if (!isNaN(Number(load.load))) {
          return {
            ...load,
            load: String(Number(load.load) + loadChange),
          };
        }
        //oldValue includes text
        else if (/[A-Za-zäüö`!@#$%^&*()_+-=[{};':"|,.<>/?~]/g.test(load.load)) {
          return {
            ...load,
            load: load.load,
          };
        } else {
          return '-1';
        }
      });
    };

    const createChangesArray = (inputArray, exerciseNames) => {
      const outputArray = new Array(exerciseNames?.length);
      Object.entries(inputArray).forEach((exercise) => {
        outputArray[exercise[0]] = calculateLoadChange(exercise[1]);
      });
      return outputArray;
    };

    const createProgressionData = (
      oldTrainerValues,
      loadChanges,
      athleteValues,
    ) => {
      // pass over an array of load values to calculateNewLoads fcn
      const outputArray = [];
      Object.entries(loadChanges).forEach((loadChange) => {
        oldTrainerValues.forEach((oldValue) => {
          if (oldValue.exerciseName === loadChange[0]) {
            outputArray.push({
              exerciseName: oldValue.exerciseName,
              oldLoad: oldValue.loadsOfLastWeek,
              loadChange: loadChange[1],
              newLoad: calculateNewLoads(
                oldValue.loadsOfLastWeek,
                loadChange[1],
              ),
              reps: oldValue.repsOfLastWeek,
              rpe: oldValue.rpeOfLastWeek,
              weeks: getWeeksOfExercise(athleteValues[oldValue.exerciseName]),
              day: oldValue.date,
              useRir: oldValue.useRir ?? false,
            });
          }
        });
      });
      return outputArray;
    };

    // one entry in the input array is a set object: {weekNr, weekName, date, set, load, reps, ...}
    const getWeeksOfExercise = (trainingDataOfOneExercise) => {
      const onlyWeeks = trainingDataOfOneExercise.map((data) => {
        return data.calendarWeek;
      });
      const reducedWeeks = onlyWeeks.reduce((uniqueWeeks, week) => {
        return uniqueWeeks.includes(week)
          ? uniqueWeeks
          : [...uniqueWeeks, week];
      }, []);
      return reducedWeeks;
    };

    const bringInRightOrder = (dataInWrongOrder, dataInRightOrder) => {
      const arrayInRightOrder = [];
      let day = 0;
      let dayKey = '';
      while (day < 7) {
        dayKey = 'day' + String(day);
        arrayInRightOrder.push(dataInRightOrder[dayKey]);
        day++;
      }
      const orderOfExercises = [];
      arrayInRightOrder.forEach((trainingDay) => {
        let exerciseNr = 0;
        let exerciseKey = 'exercise' + exerciseNr;
        while (trainingDay.exercises[exerciseKey]) {
          exerciseKey = 'exercise' + String(exerciseNr);
          if (trainingDay.exercises[exerciseKey]?.name) {
            orderOfExercises.push({
              exerciseName: trainingDay.exercises[exerciseKey]?.name,
              date: trainingDay.date,
            });
          }
          exerciseNr++;
        }
      });
      const orderedData = orderOfExercises.map((exercise) => {
        const foundExercise = dataInWrongOrder.find((wrongData) => {
          return (
            wrongData.exerciseName === exercise.exerciseName &&
            wrongData.day === exercise.date
          );
        });
        return {
          ...exercise,
          loadChange: foundExercise?.loadChange,
          newLoad: foundExercise?.newLoad,
          oldLoad: foundExercise?.oldLoad,
          reps: foundExercise?.reps,
          rpe: foundExercise?.rpe,
          weeks: foundExercise?.weeks,
          useRir: foundExercise?.useRir ?? false,
        };
      });
      return orderedData;
    };

    const filteroutLastWeek = (dataToFilter, week) => {
      const filteredExercises = [];
      dataToFilter.forEach((exercise) => {
        if (exercise.weeks.includes(week)) {
          filteredExercises.push(exercise);
        }
      });
      const progressionDataByDayRightOrder = bringInRightOrder(
        filteredExercises,
        sortedTrainingsByCalendarWeek[sortedTrainingsByCalendarWeek?.length - 1]
          ?.trainingDays,
      );
      return progressionDataByDayRightOrder;
    };

    const findLastWeekWithData = (dataToSort) => {
      const filteredExercises = [];
      let weekNr = sortedTrainingsByCalendarWeek?.length;
      let progressionDataByDayRightOrder: any[] = [];
      while (weekNr > 0) {
        dataToSort.forEach((exercise) => {
          if (exercise.weeks.includes(weekNr)) {
            filteredExercises.push(exercise);
          }
        });
        if (filteredExercises?.length == 0) {
          weekNr--;
        } else {
          progressionDataByDayRightOrder = bringInRightOrder(
            filteredExercises,
            sortedTrainingsByCalendarWeek[weekNr - 1].trainingDays,
          );
          break;
        }
      }
      return progressionDataByDayRightOrder;
    };

    const prepareProgression = () => {
      if (sortedTrainingsByCalendarWeek?.length != 0) {
        const exerciseNames = getAllExerciseNames(
          sortedTrainingsByCalendarWeek,
        );
        const trainingsSortedByExercise = sortTrainingsByExercise(
          exerciseNames,
          sortedTrainingsByCalendarWeek,
        );
        const {athleteValues, trainerValues} = extractValues(
          exerciseNames,
          trainingsSortedByExercise,
        );

        // extract for all exercises the most recent values
        // (it is independent of weekNr)
        const extractedTrainerValuesAllSets = extractTrainerValues(
          exerciseNames,
          trainerValues,
        );
        const loadChanges = createChangesArray(athleteValues, exerciseNames);
        const completeProgressionData = createProgressionData(
          extractedTrainerValuesAllSets,
          loadChanges,
          athleteValues,
        );
        const filteredProgressionData = filteroutLastWeek(
          completeProgressionData,
          previousWeek,
        );
        const returnData =
          filteredProgressionData?.length === 0
            ? findLastWeekWithData(completeProgressionData)
            : filteredProgressionData;
        return Object.values(returnData).map((data) => {
          return {
            ...data,
            day: moment(data.date).utc().format('dddd'),
          };
        });
      } else {
        return [];
      }
    };
    setProgressionData(prepareProgression() ?? []);
  }, [allTrainings]);

  const changeProgressionData = (index: number, newData: any) => {
    if (progressionData?.[index]) {
      progressionData[index] = newData;
      // Needed for re-render
      setProgressionData([...progressionData]);
    }
  };

  return {loading: !progressionData, progressionData, changeProgressionData};
};
