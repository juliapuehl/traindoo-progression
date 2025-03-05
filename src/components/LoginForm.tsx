import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useLogin} from '../hooks/useLogin';
import {primary_green, sidebar_color_dark} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import BasicTextField from './BasicTextField';
import ButtonCustom from './Button';

interface Props {
  debugLogin: () => void;
  navigateRegistration: () => void;
  navigateForgotPassword: () => void;
}

const LoginForm = (props: Props) => {
  const login = useLogin();

  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const handleErrorMessage = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(undefined), 3000);
  };

  return (
    <div style={styles.main}>
      <div style={{...sharedStyle.textStyle.title1, ...styles.headline}}>
        {t('SIGN_IN_TITLE')}
      </div>

      <BasicTextField
        label={t('SIGN_IN_MAIL')}
        autoComplete="email"
        onChange={setUserEmail}
      />
      <BasicTextField
        label={t('SIGN_IN_PASSWORD')}
        autoComplete="current-password"
        onChange={setPassword}
        password={true}
      />

      {errorMessage !== undefined && (
        <Alert style={styles.alert} severity="error">
          {errorMessage}
        </Alert>
      )}
      <div style={styles.buttonContainer}>
        <ButtonCustom
          text={t('SIGN_IN_BUTTON')}
          color={primary_green}
          onClick={() => login(userEmail, password, handleErrorMessage)}
        />
      </div>
      <div
        style={{
          ...sharedStyle.textStyle.primary_white_capital,
          ...styles.linkButtonContainer,
        }}
      >
        <Link
          onClick={() => props.navigateRegistration()}
          variant="body2"
          style={styles.linkButton}
        >
          {t('SIGN_IN_SIGN_UP')}
        </Link>
        <Link
          onClick={() => props.navigateForgotPassword()}
          variant="body2"
          style={styles.linkButton}
        >
          {t('SIGN_IN_BUTTON_FORGOT')}
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;

type Styles = {
  linkButton: CSSProperties;
  linkButtonContainer: CSSProperties;
  main: CSSProperties;
  buttonContainer: CSSProperties;
  headline: CSSProperties;
  alert: CSSProperties;
};

const styles: Styles = {
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  headline: {
    marginBottom: 24,
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
  linkButtonContainer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  linkButton: {
    marginLeft: 8,
    color: primary_green,
  },
};
