import {useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import {allTrainingsQuery} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';

export const useTrainingScreenConnect = () => {
  const athleteId = useSelector(getCurrentAthleteId);
  useFirestoreConnect([allTrainingsQuery(athleteId)]);
  // const firestore = useFirestore();
  // const dispatch = useDispatch();
  // const selectedTrainingId = useSelector(getSelectedTrainingId);
  // useEffect(() => {
  //   if (athleteId) {
  //     firestore
  //       .collection('user')
  //       .doc(athleteId)
  //       .collection('training')
  //       .orderBy('calendarWeek', 'asc')
  //       .get()
  //       .then((querySnapshot) => {
  //         const data = querySnapshot.docs.map(
  //           (doc) => doc.data() as TrainingType,
  //         );
  //         dispatch(setAllTrainings(data));
  //       });
  //   } else {
  //     dispatch(setAllTrainings([]));
  //   }
  // }, [athleteId, dispatch, firestore, planningStartDate]);
  // useEffect(() => {
  //   if (!athleteId || !selectedTrainingId) {
  //     // @ts-ignore
  //     return;
  //   }
  //   const unsubscribe = firestore
  //     .collection('user')
  //     .doc(athleteId)
  //     .collection('training')
  //     .doc(selectedTrainingId)
  //     .onSnapshot((doc) => {
  //       // dispatch(setTrainingInAllTrainings(doc.data() as TrainingType));
  //     });
  //   return () => unsubscribe();
  // }, [athleteId, dispatch, firestore, selectedTrainingId]);
};
