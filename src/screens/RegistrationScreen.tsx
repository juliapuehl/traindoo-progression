import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useNavigate} from 'react-router-dom';
import {SignUpForm} from '../components/SignUpForm';
import {generateStandardChecks} from '../hooks/useAddStandardDailyCheck';

import {
  addLibraryEntry,
  getRegistrationFlags,
  getUser,
  getUserId,
  usersDataPublicProfileQuery,
  usersDataQuery,
} from '../logic/firestore';
import {background_color_dark} from '../styles/colors';
import {generateExampleLibraryEntry} from '../utils/editingLibraryHelper';

export const RegistrationScreen = () => {
  Intercom('update', {
    vertical_padding: 20,
  });

  const firestore = useFirestore();
  const dispatch = useDispatch();

  const userId = useSelector(getUserId);
  const registrationFlags = useSelector(getRegistrationFlags);
  const user = useSelector(getUser);

  const navigate = useNavigate();
  type RegistrationFlags = 'newUser' | 'personal' | 'sport' | 'consent';
  const [flag, setFlag] = useState<RegistrationFlags>('newUser');
  const [step, setStep] = useState(0);
  const [data, setData] = useState();
  const [waitingAccountCreation, setWaitingAccountCreation] = useState(false);

  useEffect(() => {
    if (data !== undefined) {
      uploadInformation(data, flag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (userId && registrationFlags?.personal && registrationFlags?.consent) {
      setFlag('sport');
      setStep(3);
    } else if (userId && registrationFlags?.personal) {
      setFlag('consent');
      setStep(2);
    } else if (userId && user?.trainer?.code) {
      setFlag('personal');
      setStep(1);
    }
  }, [user, userId, registrationFlags]);

  const navigateLogin = () => {
    navigate('/login');
  };

  const uploadInformation = async (
    uploadData: any,
    uploadFlag: RegistrationFlags,
  ) => {
    try {
      if (userId) {
        await firestore.update(usersDataQuery(userId), uploadData);
        if (uploadFlag === 'personal') {
          await firestore.set(
            usersDataPublicProfileQuery(userId),
            {firstName: uploadData.firstName, lastName: uploadData.lastName},
            {
              merge: true,
            },
          );
          await generateStandardChecks(firestore, userId, dispatch);
          await firestore.set(
            addLibraryEntry(userId),
            {[t('LIBRARY_EXAMPLE_ENTRY_TITLE')]: generateExampleLibraryEntry()},
            {merge: true},
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageBackground}>
        <SignUpForm
          flag={flag}
          setData={setData}
          step={step}
          navigateLogin={navigateLogin}
          loading={waitingAccountCreation && flag === 'newUser'}
          setWaitingAccountCreation={setWaitingAccountCreation}
        />
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  imageBackground: CSSProperties;
};

const styles: Styles = {
  container: {height: '100vH', flex: 1, flexGrow: 1},
  imageBackground: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: background_color_dark,
  },
};
