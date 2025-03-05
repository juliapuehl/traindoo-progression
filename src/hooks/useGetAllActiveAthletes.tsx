import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId} from '../logic/firestore';

export const useGetAllAthleteIds = () => {
  const firestore = useFirestore();
  const userId = useSelector(getUserId);

  const query = firestore
    .collection('user')
    .doc(userId)
    .collection('athleteStates')
    .where('currentState', 'not-in', [
      'noTrainer',
      'deleted',
      'changedTrainer',
    ]);
  const getAthletesIds = async () => {
    return (await query.get()).docs?.map((doc) => doc.id);
  };
  return getAthletesIds;
};
