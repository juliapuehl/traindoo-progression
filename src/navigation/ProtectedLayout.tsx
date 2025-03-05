import {useSelector} from 'react-redux';
import {isEmpty, isLoaded} from 'react-redux-firebase';
import {Navigate, Outlet} from 'react-router-dom';
import ClippedDrawer from '../components/UI/ClippedDrawer';
import {useIntercomEventTracking} from '../hooks/useIntercomEventTracking';
import {useUpdateIntercomUserInfo} from '../hooks/useUpdateIntercomUserInfo';
import {
  getAuth,
  getConsentExpired,
  getNavigatePayment,
  getRegistrationFlags,
} from '../logic/firestore';
import {ConsentScreen} from '../screens/ConsentScreen';
import LoadingScreen from '../screens/LoadingScreen';
import {PaymentScreen} from '../screens/PaymentScreen';

export const ProtectedLayout = () => {
  const auth = useSelector(getAuth);
  const navigatePayment = useSelector(getNavigatePayment);
  const registrationFlags = useSelector(getRegistrationFlags);
  const consentExpired = useSelector(getConsentExpired);

  useUpdateIntercomUserInfo();
  useIntercomEventTracking();

  if (!isLoaded(auth)) return <LoadingScreen />;
  if (isEmpty(auth)) return <Navigate to="/login" />;

  if (
    isLoaded(registrationFlags) &&
    (!registrationFlags?.accountUnlocked ||
      !registrationFlags?.registrationCompleted)
  )
    return <Navigate to="/register" />;
  if (consentExpired) return <ConsentScreen />;
  if (navigatePayment) return <PaymentScreen />;

  return (
    <ClippedDrawer>
      <Outlet />
    </ClippedDrawer>
  );
};
