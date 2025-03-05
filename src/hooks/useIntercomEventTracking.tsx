import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {getUserId} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {
  getSelectedCycleIndex,
  getSelectedTrainingId,
  getSelectedTrainingIndex,
} from '../store/trainingSlice';

export const useIntercomEventTracking = () => {
  const userId = useSelector(getUserId);
  const athleteId = useSelector(getCurrentAthleteId);
  const trainingId = useSelector(getSelectedTrainingId);
  const trainingCycle = useSelector(getSelectedCycleIndex);
  const trainingWeek = useSelector(getSelectedTrainingIndex);

  useEffect(() => {
    if (userId) {
      const data = {
        athleteId: athleteId,
      };
      Intercom('trackEvent', 'Changed-Athlete', data);
    }
  }, [athleteId, userId]);

  useEffect(() => {
    if (userId) {
      const data = {
        trainingId: trainingId,
        trainingCycle: trainingCycle,
        trainingWeek: trainingWeek,
      };
      Intercom('trackEvent', 'Changed-Training', data);
    }
  }, [trainingCycle, trainingId, trainingWeek, userId]);
};
