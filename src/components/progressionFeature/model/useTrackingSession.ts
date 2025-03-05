import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {v4 as uuidv4} from 'uuid';
import {getUserId} from '../../../logic/firestore';
import {getCurrentAthleteId} from '../../../store/athleteSlice';
import {
  getProgressionTrackingId,
  setProgressionTrackingId,
} from '../../../store/trainingSlice';

export const useTrackingSession = () => {
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const athleteId = useSelector(getCurrentAthleteId);
  const sessionId = useSelector(getProgressionTrackingId);
  const firestoreQuery = firestore
    .collection('user')
    .doc(userId ?? '')
    .collection('tracking');

  const startNewSession = (type: string, weekNr) => {
    const newSessionId = uuidv4();
    dispatch(setProgressionTrackingId(newSessionId));
    firestoreQuery.doc(newSessionId).set({
      startTime: moment().toISOString(),
      id: newSessionId,
      type: type,
      weekNr: weekNr,
      athleteId: athleteId,
    });
  };

  const registerUserActivity = (eventType: string, value: string) => {
    firestoreQuery.doc(sessionId).update({
      events: firestore.FieldValue.arrayUnion({
        eventType,
        value,
        eventTime: moment().toISOString(),
      }),
    });
  };

  const registerUserInput = (
    eventType: string,
    oldValue: string,
    newValue: string,
  ) => {
    firestoreQuery.doc(sessionId).update({
      events: firestore.FieldValue.arrayUnion({
        eventType,
        oldValue,
        newValue,
        eventTime: moment().toISOString(),
      }),
    });
  };

  const endSession = (endEvent: string) => {
    firestoreQuery.doc(sessionId).update({
      endTime: moment().toISOString(),
      endEvent,
    });
  };

  return {
    startNewSession,
    registerUserInput,
    registerUserActivity,
    endSession,
  };
};
