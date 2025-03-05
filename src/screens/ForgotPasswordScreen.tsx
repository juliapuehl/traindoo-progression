import {Alert, Link} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useFirebase} from 'react-redux-firebase';
import {useNavigate} from 'react-router-dom';
import BasicTextField from '../components/BasicTextField';
import ButtonCustom from '../components/Button';
import {
  background_color_dark,
  primary_green,
  sidebar_color_dark,
} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

export const ForgotPasswordScreen = () => {
  Intercom('update', {
    vertical_padding: 20,
  });

  const firebase = useFirebase();

  const navigate = useNavigate();

  const [userMail, setUserMail] = useState<string | undefined>(undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const handleErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(undefined);
    }, 5000);
  };

  const navigateLogin = () => {
    navigate('/login');
  };

  const retrievePassword = async () => {
    try {
      await firebase.auth().sendPasswordResetEmail(userMail, null);
      navigateLogin();
    } catch (e) {
      handleErrorMessage(t('FORGOT_ERROR_NOT_VALID'));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageBackground}>
        <div style={styles.main}>
          <div style={{...sharedStyle.textStyle.title1, ...styles.headline}}>
            {t('FORGOT_TITLE')}
          </div>

          <BasicTextField
            label={t('FORGOT_MAIL')}
            autoComplete="email"
            onChange={setUserMail}
          />
          {errorMessage !== undefined && (
            <Alert severity="error" style={styles.alert}>
              {errorMessage}
            </Alert>
          )}
          <div style={styles.buttonContainer}>
            <ButtonCustom
              text={t('FORGOT_BUTTON_SEND')}
              color={primary_green}
              onClick={retrievePassword}
            />
          </div>
          <div
            style={{
              ...sharedStyle.textStyle.primary_white_capital,
              ...styles.loginButton,
            }}
          >
            {t('SIGN_UP_SIGN_IN_TITLE')}
            <Link
              onClick={() => navigateLogin()}
              variant="body2"
              style={styles.linkButton}
            >
              {t('SIGN_UP_BUTTON_SIGN_IN')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  imageBackground: CSSProperties;
  main: CSSProperties;
  buttonContainer: CSSProperties;
  loginButton: CSSProperties;
  alert: CSSProperties;
  headline: CSSProperties;
  linkButton: CSSProperties;
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

  linkButton: {
    marginLeft: 8,
    color: primary_green,
  },
  headline: {
    marginBottom: 24,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  main: {
    backgroundColor: sidebar_color_dark,
    minWidth: 360,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
  },
  alert: {
    marginBottom: 24,
    width: '100%',
  },
};
