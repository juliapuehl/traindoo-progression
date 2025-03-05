import moment from 'moment';
import {useRef} from 'react';
import {useSelector} from 'react-redux';
import {isLoaded, useFirestore} from 'react-redux-firebase';
import {getUser, getUserId, usersDataQuery} from '../logic/firestore';

export const useUpdateLastLogin = () => {
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const user = useSelector(getUser);
  const alreadyTriggered = useRef(false);
  // user loaded guard
  if (!isLoaded(user)) return;

  // user account not activated yet guard
  if (!user?.trainer?.registrationFlags?.accountUnlocked) return;

  // lastLogin exists and has been updated in the past 60 seconds guard
  if (
    user.trainer.lastLogin &&
    moment(moment()).diff(user.trainer.lastLogin) < 600000
  )
    return;

  // already triggered guard
  if (alreadyTriggered.current) return;
  alreadyTriggered.current = true;
  firestore.update(usersDataQuery(userId), {
    'trainer.lastLogin': moment().toISOString(),
  });
};
