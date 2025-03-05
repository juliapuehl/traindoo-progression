import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useNavigate} from 'react-router-dom';
import {getAthleteState, getUserId} from '../logic/firestore';
import {setCurrentAthleteId} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {AthleteActiveState} from '../traindoo_shared/types/User';

export const useChangeAthleteState = (athleteUserId: string) => {
  const userId = useSelector(getUserId);
  const athleteState = useSelector((state: RootState) =>
    getAthleteState(state, athleteUserId),
  );
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return async (newState: AthleteActiveState) => {
    const date = moment().toISOString();
    const newCurrentStateObject = {
      currentState: newState,
      id: athleteUserId,
      lastChangeDate: date,
    };
    const stateHistoryObject = {
      date: date,
      oldState: athleteState,
      newState: newState,
      userId: athleteUserId,
    };
    let changeObjectAthlete: any = {
      ['athlete.trainerInfo.currentState']: newState,
    };
    if (newState === 'noTrainer') {
      changeObjectAthlete = {
        ...changeObjectAthlete,
        ['athlete.trainerInfo.trainerCode']: '',
        ['athlete.trainerInfo.trainerId']: '',
      };
      dispatch(setCurrentAthleteId(undefined));
      navigate('/home');
    }
    //@ts-ignore
    const batch = firestore.batch();
    batch.update(
      //@ts-ignore
      firestore.collection('user').doc(athleteUserId),
      changeObjectAthlete,
    );
    // V1 Athlete State Data Structure
    batch.set(
      firestore
        .collection('user')
        .doc(userId)
        .collection('athleteStates')
        .doc(athleteUserId),
      newCurrentStateObject,
      {merge: true},
    );
    batch.set(
      firestore
        .collection('user')
        .doc(userId)
        .collection('athleteStateHistory')
        .doc(),
      stateHistoryObject,
    );

    batch.commit();
  };
};
