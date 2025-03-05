import {useState} from 'react';
import {useSelector} from 'react-redux';
import {isEmpty, useFirestore} from 'react-redux-firebase';
import {getAllTrainings} from '../logic/firestore';
import {
  getCurrentAthleteId,
  getCurrentAthletePercentageRoundTarget,
} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {getSelectedCycleIndex} from '../store/trainingSlice';
import {TrainingType} from '../traindoo_shared/types/Training';
import {useCalculateLoadBackend} from '../traindoo_shared/units/useCalculateLoadBackend';
import {calculateLoadFromPrimaryExercise, valueIsGiven} from '../utils/helper';

type ChangeInfo = {
  exerciseKey: string;
  dayKey: string;
  trainingId: string;
  setKey: string;
  newValue: string;
};
export const useCycleTargetConnect = () => {
  const allTrainings = useSelector(getAllTrainings);
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);
  const oneRMRoundTarget = useSelector((state: RootState) =>
    getCurrentAthletePercentageRoundTarget(state),
  );
  const calculateLoadBackend = useCalculateLoadBackend();
  const selectedCycleIndex = useSelector(getSelectedCycleIndex);
  const [loading, setLoading] = useState(false);

  const cycleTrainings = allTrainings.filter(
    (training) => training.trainingCycle === selectedCycleIndex,
  );
  const [displayUpdateIcon, setDisplayUpdateIcon] = useState(false);
  const [cycleTargetExercises, setCycleTargetExercises] = useState<{
    [primaryExerciseKey: string]: ChangeInfo[];
  }>({});

  const getExercisesWithPrimaryExercise = (
    primaryExercise: string,
    newPrimaryValue: number,
  ) => {
    setLoading(true);
    const exercises = getCycleTargetExercises(
      newPrimaryValue ?? 0,
      primaryExercise,
      cycleTrainings,
      oneRMRoundTarget,
    );

    if (!isEmpty(exercises)) {
      cycleTargetExercises[primaryExercise] = exercises;
      setCycleTargetExercises(cycleTargetExercises);
      setDisplayUpdateIcon(true);
    }
    setLoading(false);
  };

  const updateCycleTargetExercises = async () => {
    setLoading(true);
    for (const changeInfos of Object.values(cycleTargetExercises)) {
      const sortedByTrainingId = changeInfos.reduce((returnObj, changeInfo) => {
        const newArray = [changeInfo];
        if (returnObj[changeInfo.trainingId]) {
          newArray.push(...returnObj[changeInfo.trainingId]);
        }
        returnObj[changeInfo.trainingId] = newArray;
        return returnObj;
      }, {} as {[trainingId: string]: ChangeInfo[]});
      const batch = firestore.batch();
      for (const [trainingId, changes] of Object.entries(sortedByTrainingId)) {
        const changeObject = {};
        changes.forEach((change) => {
          changeObject[
            'trainingDays.' +
              change.dayKey +
              '.exercises.' +
              change.exerciseKey +
              '.sets.' +
              change.setKey +
              '.trainer.load'
          ] = calculateLoadBackend(change.newValue);
        });
        batch.update(
          firestore
            .collection('user')
            .doc(athleteUserId)
            .collection('training')
            .doc(trainingId),
          changeObject,
        );
      }
      await batch.commit();
    }
    setLoading(false);
    setDisplayUpdateIcon(false);
    setCycleTargetExercises({});
  };

  return {
    displayUpdateIcon,
    getExercisesWithPrimaryExercise,
    processingPrimaryExercise: loading,
    updateCycleTargetExercises,
  };
};

export const getCycleTargetExercises = (
  primaryExerciseValue: number,
  primaryExercise: string,
  trainings: TrainingType[],
  oneRMRoundTarget: number,
) => {
  const cycleTargetExercises: ChangeInfo[] = [];
  trainings.forEach((training) =>
    Object.entries(training.trainingDays).forEach(([dayKey, day]) => {
      Object.entries(day.exercises).forEach(([exerciseKey, exercise]) => {
        if (exercise?.primaryExercise === primaryExercise) {
          Object.entries(exercise.sets).forEach(([setKey, set]) => {
            const percentage = set.trainer.trainerPercentage;
            if (valueIsGiven(percentage.toString())) {
              const newValue = calculateLoadFromPrimaryExercise(
                primaryExerciseValue,
                percentage?.toString() ?? '0',
                oneRMRoundTarget,
              );
              cycleTargetExercises.push({
                exerciseKey: exerciseKey,
                dayKey: dayKey,
                trainingId: training.id,
                setKey: setKey,
                newValue: newValue,
              });
            }
          });
        }
      });
    }),
  );
  return cycleTargetExercises;
};
