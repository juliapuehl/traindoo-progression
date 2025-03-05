// import Button from "@mui/material/Button";
import {CSSProperties} from 'react';
import {useFirebase} from 'react-redux-firebase';
import {useNavigate} from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import {background_color_dark} from '../styles/colors';

const LoginScreen = () => {
  // restart IC to clean current session before creating new user or logging in
  Intercom('boot', {
    app_id: process.env.REACT_APP_INTERCOM_ENV,
  });

  Intercom('update', {
    vertical_padding: 20,
  });

  const firebase = useFirebase();
  const navigate = useNavigate();

  const debugLogin = async () => {
    await firebase.login({
      email: 'trainertest@test.test',
      password: 'testtest',
    });
  };

  const navigateRegistration = () => {
    navigate('/register');
  };

  const navigateForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageBackground}>
        <LoginForm
          debugLogin={debugLogin}
          navigateRegistration={navigateRegistration}
          navigateForgotPassword={navigateForgotPassword}
        />
      </div>
    </div>
  );
};

export default LoginScreen;

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
