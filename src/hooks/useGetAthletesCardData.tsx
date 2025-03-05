import moment from 'moment';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId} from '../logic/firestore';
import {setAthleteData} from '../store/athleteSlice';
import {AthleteActiveState, UserType} from '../traindoo_shared/types/User';

export const athleteSorting = (
  athleteAData: AthleteCardsReturnType,
  athleteBData: AthleteCardsReturnType,
) => {
  const athleteA = athleteAData.data;
  const athleteB = athleteBData.data;
  if (!athleteA?.planningStartDate) {
    return -1;
  } else if (!athleteB?.planningStartDate) {
    return 1;
  } else {
    if (
      moment(athleteA.planningStartDate).isSame(
        moment(athleteB.planningStartDate),
        'days',
      )
    ) {
      if (athleteA.firstName < athleteB.firstName) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return moment(athleteA.planningStartDate).diff(
        moment(athleteB.planningStartDate),
        'days',
      );
    }
  }
};

type AthleteCardsReturnType = {state: AthleteActiveState; data: UserType};

export const useGetAthletesCardData = () => {
  const userId = useSelector(getUserId);
  const firestore = useFirestore();
  const dispatch = useDispatch();

  // const [data, setData] = useState<AthleteCardsReturnType[]>();
  const [userStates, setUserStates] = useState<
    Array<{
      id: string;
      state: AthleteActiveState;
    }>
  >();
  useEffect(() => {
    const unsubscribe = firestore
      .collection('user')
      .doc(userId)
      .collection('athleteStates')
      .where('currentState', 'not-in', [
        'noTrainer',
        'deleted',
        'changedTrainer',
      ])
      .onSnapshot(async (querySnapshot) => {
        const tmpData: any = [];
        querySnapshot?.docs.forEach((doc) => {
          tmpData.push({id: doc.id, state: doc.data().currentState});
        });
        setUserStates(tmpData);
      });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (userStates) {
      for (const stateDoc of userStates) {
        firestore
          .collection('user')
          .doc(stateDoc.id)
          .onSnapshot(async (athleteQuerySnapshot) => {
            const athleteData = athleteQuerySnapshot.data() as UserType;
            dispatch(
              setAthleteData({
                state: stateDoc.state,
                data: athleteData,
                id: stateDoc.id,
              }),
            );
          });
      }
    }
  }, [userStates, firestore, dispatch]);
  return [];
};
