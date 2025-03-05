import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {RootState} from '../../../../store/store';
import {
  getExerciseSets,
  getSelectedDayIndex,
  getSelectedTrainingId,
} from '../../../../store/trainingSlice';
import {moveSet} from '../../../../utils/editingTrainingHelper';

export const useMoveSetConnect = (
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

  const handleMoveSet = async (up: boolean) => {
    const moveIndex = up ? setIndex + 1 : setIndex - 1;
    await moveSet(
      sets,
      moveIndex,
      up,
      trainingId,
      dayIndex,
      exerciseIndex,
      athleteUserId,
      firestore,
    );

    setSelectedSet(setIndex);
  };

  return {
    moveSetUp: () => handleMoveSet(true),
    moveSetDown: () => handleMoveSet(false),
  };
};
