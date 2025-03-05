import {t} from 'i18n-js';
import {useSelector} from 'react-redux';
import {useFirebase} from 'react-redux-firebase';
import {useNavigate} from 'react-router-dom';
import {getRegistrationFlags} from '../logic/firestore';

export const useLogin = () => {
  const firebase = useFirebase();
  const registrationFlags = useSelector(getRegistrationFlags);
  const registrationComplete = registrationFlags?.registrationCompleted;
  const navigate = useNavigate();

  return async (
    userEmail: string,
    password: string,
    setErrorMessage?: (msg: string) => void,
  ) => {
    try {
      await firebase.login({
        email: userEmail,
        password: password,
      });
      if (!registrationComplete) {
        navigate('/register');
      }
    } catch (error) {
      if (setErrorMessage) {
        if (error.message.toLowerCase().includes('network error')) {
          setErrorMessage(t('SIGN_IN_ERROR_NO_CONNECTION'));
        } else {
          setErrorMessage(t('SIGN_IN_ERROR_INCORRECT'));
        }
      }
      throw error;
    }
  };
};
