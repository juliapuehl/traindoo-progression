import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {RootState} from '../../../../store/store';
import {
  getAmountSets,
  getSelectedDayIndex,
  getSelectedTrainingId,
} from '../../../../store/trainingSlice';
import {
  addSetsToTraining,
  NewSetsType,
} from '../../../../utils/editingTrainingHelper';

export const useAddSetConnect = (exerciseIndex: number) => {
  const firestore = useFirestore();

  const athleteUserId = useSelector(getCurrentAthleteId);
  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);
  const amountSets = useSelector((state: RootState) =>
    getAmountSets(state, exerciseIndex),
  );

  const addSets = (values: NewSetsType) => {
    addSetsToTraining(
      values,
      exerciseIndex,
      dayIndex,
      amountSets,
      firestore,
      athleteUserId,
      trainingId,
    );
  };

  return {
    addSets,
  };
};
