import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../store/athleteSlice';
import {RootState} from '../../../store/store';
import {
  getExerciseTrainerNote,
  getSelectedDayIndex,
  getSelectedTrainingId,
} from '../../../store/trainingSlice';
import {editExercise} from '../../../utils/editingTrainingHelper';

export const useNoteConnect = (exerciseIndex: number) => {
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);

  const note = useSelector((state: RootState) =>
    getExerciseTrainerNote(state, exerciseIndex),
  );

  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const uploadNote = (text: string) => {
    if (text !== note) {
      editExercise(
        'trainerNote',
        text,
        trainingId,
        dayIndex,
        exerciseIndex,
        athleteUserId,
        firestore,
      );
    }
  };

  return {
    value: note,
    save: uploadNote,
  };
};
