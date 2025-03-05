import moment, {Moment} from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  getAllTrainings,
  getCurrentCycleTrainings,
  getCurrentCycleTrainingsLength,
  getLastTraining,
  getUserId,
} from '../../../../logic/firestore';
import {
  getAthletePlanningStartDate,
  getCurrentAthleteId,
} from '../../../../store/athleteSlice';
import {getStore} from '../../../../store/store';
import {
  getSelectedCycleIndex,
  setSelectedDayIndex,
  setSelectedTrainingIndex,
} from '../../../../store/trainingSlice';
import {
  copyLastTraining,
  copyLastTrainingForProgression,
  createNewTraining,
} from '../../../../utils/editingTrainingHelper';
import {changeAthleteLatestCheck} from '../../../../utils/editingUserHelper';

export const useCreateCollectionConnect = () => {
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const athleteId = useSelector(getCurrentAthleteId);
  const userId = useSelector(getUserId);
  const currentCycle = useSelector(getSelectedCycleIndex);
  const amountWeeks = useSelector(getCurrentCycleTrainingsLength);
  const lastTraining = useSelector(getLastTraining);
  const allTrainings = useSelector(getAllTrainings);
  const currentAthletePlanningDate = useSelector(getAthletePlanningStartDate);

  const newSelectedIndex = amountWeeks ? amountWeeks : 0;

  const createNewWeek = async (
    startDate: Moment,
    selectedDailyId: string,
    selectedWeeklyId: string,
  ) => {
    const {filteredIdsToAdjust, newWeekNumber} = filterIdsToAdjust(startDate);
    createNewTraining(
      currentAthletePlanningDate,
      filteredIdsToAdjust,
      athleteId,
      userId,
      firestore,
      startDate,
      newWeekNumber,
      currentCycle,
      selectedDailyId,
      selectedWeeklyId,
    );

    cleanUp(selectedDailyId, selectedWeeklyId);
  };

  const copyLastWeek = async (
    startDate: Moment,
    selectedDailyId: string,
    selectedWeeklyId: string,
  ) => {
    const {filteredIdsToAdjust, newWeekNumber} = filterIdsToAdjust(startDate);
    copyLastTraining(
      currentAthletePlanningDate,
      filteredIdsToAdjust,
      athleteId,
      userId,
      firestore,
      startDate,
      newWeekNumber,
      currentCycle,
      lastTraining,
      selectedDailyId,
      selectedWeeklyId,
    );
    cleanUp(selectedDailyId, selectedWeeklyId);
  };

  const getXLastTraining = (x: number) => {
    if (allTrainings && allTrainings.length > 0) {
      return allTrainings[x - 1];
    }
    return null;
  };

  const findWeekNr = (progressionData) => {
    let index = 0;
    while (index < progressionData.length) {
      if (progressionData[index]?.weeks) {
        return progressionData[index]?.weeks[
          progressionData[index]?.weeks?.length - 1
        ];
      }
      index++;
    }
  };

  const createProgressionWeek = (
    startDate: Moment,
    selectedDailyId: string,
    selectedWeeklyId: string,
    progressionData,
  ) => {
    const {filteredIdsToAdjust, newWeekNumber} = filterIdsToAdjust(startDate);
    const weekNr = findWeekNr(progressionData);
    const xLastTraining = getXLastTraining(weekNr);
    if (xLastTraining) {
      copyLastTrainingForProgression(
        athleteId,
        userId,
        firestore,
        startDate,
        currentCycle,
        //lastTraining,
        xLastTraining,
        selectedDailyId,
        selectedWeeklyId,
        progressionData,
        newWeekNumber,
        currentAthletePlanningDate,
        filteredIdsToAdjust,
      );
      dispatch(setSelectedDayIndex(0));
      dispatch(setSelectedTrainingIndex(newSelectedIndex));
      cleanUp(selectedDailyId, selectedWeeklyId);
    }
  };

  const filterIdsToAdjust = (startDate: Moment) => {
    const state = getStore().getState();
    const cycleTrainings = getCurrentCycleTrainings(state);
    const filteredTrainings = cycleTrainings.filter((training) =>
      moment(startDate).isBefore(training.startDate),
    );
    const newWeekNumber =
      filteredTrainings?.[0]?.trainingWeek ?? cycleTrainings.length;
    const filteredIdsToAdjust = filteredTrainings.map((training) => {
      return {id: training.id, weekNumber: training.trainingWeek};
    });

    return {filteredIdsToAdjust, newWeekNumber};
  };

  const cleanUp = (selectedDailyId: string, selectedWeeklyId: string) => {
    changeAthleteLatestCheck(
      athleteId,
      firestore,
      selectedDailyId,
      selectedWeeklyId,
    );
    dispatch(setSelectedDayIndex(0));
    dispatch(setSelectedTrainingIndex(newSelectedIndex));
  };

  return {
    createNewWeek,
    copyLastWeek,
    createProgressionWeek,
    filterIdsToAdjust,
  };
};
