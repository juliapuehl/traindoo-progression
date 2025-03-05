import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {RootState} from '../../../../store/store';
import {
  getExerciseSets,
  getSelectedDayIndex,
  getSelectedTrainingId,
} from '../../../../store/trainingSlice';
import {removeSetFromExercise} from '../../../../utils/editingTrainingHelper';

export const useDeleteSetConnect = (
  exerciseIndex: number,
  setIndex: number,
  setSelectedSet: (newIndex: number) => void,
) => {
  const firestore = useFirestore();

  const athleteUserId = useSelector(getCurrentAthleteId);
  const sets = useSelector((state: RootState) =>
    getExerciseSets(state, exerciseIndex),
  );
  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const deleteSet = async () => {
    const setKey = 'set' + setIndex;
    await removeSetFromExercise(
      sets,
      setKey,
      trainingId,
      dayIndex,
      exerciseIndex,
      athleteUserId,
      firestore,
    );

    setSelectedSet(
      setIndex > Object.values(sets).length - 2 ? setIndex - 1 : setIndex,
    );
  };

  return deleteSet;
};
