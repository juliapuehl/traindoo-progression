import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import {
  getCurrentCycleTrainings,
  getCurrentCycleTrainingsLength,
  getLastTraining,
  getSecondLastTraining,
  specificUserQueryBatch,
} from '../../../../logic/firestore';
import {
  getAthleteTotalCycle,
  getCurrentAthleteId,
} from '../../../../store/athleteSlice';
import {getStore} from '../../../../store/store';
import {
  getSelectedCycleIndex,
  getSelectedDailyCheckIds,
  getSelectedTrainingId,
  getSelectedTrainingIndex,
  getSelectedWeeklyCheckId,
  setSelectedTrainingIndex,
} from '../../../../store/trainingSlice';

export const useWeekDeleteConnect = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const firebase = useFirebase();

  const athleteUserId = useSelector(getCurrentAthleteId);
  const trainingId = useSelector(getSelectedTrainingId);
  const totalCycles = useSelector(getAthleteTotalCycle);
  const selectedTrainingIndex = useSelector(getSelectedTrainingIndex);
  const totalTrainings = useSelector(getCurrentCycleTrainingsLength);
  const dailyCheckIds = useSelector(getSelectedDailyCheckIds);
  const weeklyCheckId = useSelector(getSelectedWeeklyCheckId);
  const currentCycleIndex = useSelector(getSelectedCycleIndex);

  const displayCycleDeleteAlert =
    currentCycleIndex === totalCycles && totalTrainings < 2 && totalCycles > 1;

  const deleteWeek = async (showDeleteCycleAlert?: () => void) => {
    setDeleteLoading(true);
    try {
      const state = getStore().getState();
      const cycleTrainings = getCurrentCycleTrainings(state);
      const lastTraining = getLastTraining(state);
      const secondLastTraining = getSecondLastTraining(state);
      const filteredTrainings = cycleTrainings?.filter(
        (training) => training.trainingWeek > selectedTrainingIndex,
      );

      const batch = firestore.batch();
      filteredTrainings?.forEach((training) =>
        batch.update(
          firestore
            //@ts-ignore firebase object wrongly typed
            .collection('user')
            .doc(athleteUserId)
            .collection('training')
            .doc(training?.id),
          {trainingWeek: training.trainingWeek - 1},
        ),
      );

      batch.delete(
        firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(athleteUserId)
          .collection('training')
          .doc(trainingId),
      );
      if (weeklyCheckId) {
        const doc = firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(athleteUserId)
          .collection('weeklyCheck')
          .doc(weeklyCheckId);
        const dictionaryDoc = firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(athleteUserId)
          .collection('weeklyCheck')
          .doc('0-weeklyCheckDictionary');
        batch.delete(doc);
        batch.update(dictionaryDoc, {
          [weeklyCheckId]: firebase.firestore.FieldValue.delete(),
        });
      }
      for (const dailyId of dailyCheckIds) {
        const doc = firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(athleteUserId)
          .collection('dailyCheck')
          .doc(dailyId);
        const dictionaryDoc = firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(athleteUserId)
          .collection('dailyCheck')
          .doc('0-dailyCheckDictionary');
        batch.delete(doc);
        batch.update(dictionaryDoc, {
          [dailyId]: firebase.firestore.FieldValue.delete(),
        });
      }
      if (lastTraining?.id === trainingId) {
        batch.update(specificUserQueryBatch(athleteUserId, firestore), {
          planningStartDate:
            secondLastTraining?.startDate ??
            firebase.firestore.FieldValue.delete(),
        });
      }
      await batch.commit();

      if (showDeleteCycleAlert && displayCycleDeleteAlert) {
        showDeleteCycleAlert();
      }
      if (selectedTrainingIndex > 0) {
        dispatch(setSelectedTrainingIndex(selectedTrainingIndex - 1));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {deleteLoading, deleteWeek, displayCycleDeleteAlert};
};
