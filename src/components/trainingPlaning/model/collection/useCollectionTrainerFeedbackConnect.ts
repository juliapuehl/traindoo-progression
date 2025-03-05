import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {
  getSelectedTrainingId,
  getTrainerFeedback,
} from '../../../../store/trainingSlice';
import {editTrainerFeedback} from '../../../../utils/editingTrainingHelper';

export const useCollectionTrainerFeedbackConnect = () => {
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);
  const trainingId = useSelector(getSelectedTrainingId);
  const trainerFeedback = useSelector(getTrainerFeedback);
  const save = (text: string) => {
    editTrainerFeedback(trainingId, text, athleteUserId, firestore);
  };
  return {
    fireCollectionFeedback: trainerFeedback,
    saveCollectionFeedback: save,
  };
};
