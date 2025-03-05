import {useSelector} from 'react-redux';
import {isEmpty, isLoaded} from 'react-redux-firebase';
import {Navigate, Outlet} from 'react-router-dom';
import {getAuth, getRegistrationFlags} from '../logic/firestore';
import LoadingScreen from '../screens/LoadingScreen';

export const LoginLayout = () => {
  const auth = useSelector(getAuth);
  const registrationFlags = useSelector(getRegistrationFlags);

  if (!isLoaded(auth)) return <LoadingScreen />;
  if (
    !isEmpty(auth) &&
    registrationFlags?.registrationCompleted &&
    registrationFlags?.accountUnlocked
  ) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};
