import {Visibility, VisibilityOff} from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import '@mui/lab';
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import {ThemeProvider} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import {useLogin} from '../hooks/useLogin';
import {useLogout} from '../hooks/useLogout';
import {
  getTrainerCode,
  getUser,
  getUserId,
  usersDataPublicProfileQuery,
  usersDataQuery,
} from '../logic/firestore';
import {
  light_gray,
  primary_green,
  sidebar_color_dark,
  white,
} from '../styles/colors';
import {sharedTheme} from '../styles/sharedTheme';
import {textfieldValidation} from '../utils/textfieldValidation';
import {SignUpPhoneNumber, SignUpTextField} from './SignUpTextField';
interface Props {
  flag: 'consent' | 'newUser' | 'personal' | 'sport';
  setData: (data: any) => void;
  step: number;
  navigateLogin: () => void;
  setWaitingAccountCreation: (_: boolean) => void;
  loading: boolean;
}

export const SignUpForm = (props: Props) => {
  const firebase = useFirebase();
  const firestore = useFirestore();

  const user = useSelector(getUser);
  const userId = useSelector(getUserId);
  const trainerCode = useSelector(getTrainerCode);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterAccepted, setNewsletterAccepted] = useState(true);
  const [contractText, setContractText] = useState(t('SIGN_UP_CONTRACT'));
  const [editContract, setEditContract] = useState(true);

  const login = useLogin();
  const logout = useLogout();

  const env = process.env.REACT_APP_ENV;

  const useStyles = makeStyles({
    customDisable: {
      '& .MuiInputBase-input.Mui-disabled': {
        '-webkit-text-fill-color': 'black !important',
      },
    },
  });
  const classes = useStyles();
  const [activateButton, setActivateButton] = useState({
    consent: true,
    newUser: false,
    personal: false,
    sport: false,
  });

  const [data, setData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    businessName: '',
    numberAthletes: '',
    measurement: '',
    sport: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    businessName: '',
    numberAthletes: '',
    measurement: '',
    sport: '',
  });

  const [validation, setValidation] = useState({
    email: undefined,
    password: undefined,
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    businessName: undefined,
    numberAthletes: undefined,
    measurement: undefined,
    sport: undefined,
  });

  useEffect(() => {
    switch (props.flag) {
      case 'newUser':
        if (
          validation.email &&
          validation.password &&
          data.email !== '' &&
          data.password !== '' &&
          termsAccepted
        ) {
          setActivateButton({...activateButton, [props.flag]: true});
        } else {
          setActivateButton({...activateButton, [props.flag]: false});
        }
        break;
      case 'personal':
        if (
          validation.firstName &&
          validation.lastName &&
          validation.phoneNumber &&
          data.firstName !== '' &&
          data.lastName !== '' &&
          data.phoneNumber !== ''
        ) {
          setActivateButton({...activateButton, [props.flag]: true});
        } else {
          setActivateButton({...activateButton, [props.flag]: false});
        }
        break;

      case 'sport':
        if (
          validation.businessName &&
          validation.measurement &&
          validation.sport &&
          data.businessName &&
          data.numberAthletes !== undefined &&
          data.numberAthletes !== '' &&
          data.measurement &&
          data.sport
        ) {
          setActivateButton({...activateButton, [props.flag]: true});
        } else {
          setActivateButton({...activateButton, [props.flag]: false});
        }
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validation, props.flag, data, termsAccepted]);

  const nonGenericChange = (target: string, input) => {
    setData({...data, [target]: input});
    const {valid, msg} = textfieldValidation(undefined, target, input);
    if (valid) {
      setValidation({...validation, [target]: valid});
      setErrorMessage({...errorMessage, [target]: msg});
    } else {
      setValidation({...validation, [target]: valid});
    }
  };

  const onChange = (e) => {
    if (e.target.name === 'email') {
      setData({...data, [e.target.name]: e.target.value.trim()});
    } else {
      setData({...data, [e.target.name]: e.target.value});
    }
    const {valid, msg} = textfieldValidation(e);
    if (valid) {
      setValidation({...validation, [e.target.name]: valid});
      setErrorMessage({...errorMessage, [e.target.name]: msg});
    } else {
      setValidation({...validation, [e.target.name]: valid});
    }
  };

  const validateInput = (e) => {
    try {
      if (e.target.value.length > 0) {
        const {valid, msg} = textfieldValidation(e);
        setErrorMessage({...errorMessage, [e.target.name]: msg});
        setValidation({...validation, [e.target.name]: valid});
      } else {
        setValidation({...validation, [e.target.name]: true});
        setErrorMessage({...errorMessage, [e.target.name]: ''});
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const register = async (email: string, password: string): Promise<string> => {
    try {
      await firebase.createUser({
        email: email,
        password,
      });
      props.setWaitingAccountCreation(true);
      const newUserId = await firebase.auth().currentUser.uid;
      const now = moment().utc().format('YYYYMMDD');
      Intercom('trackEvent', 'registration: consent');
      firestore.update(usersDataQuery(newUserId), {
        webApp: {
          lastUpdateDate: moment().utc().toISOString(),
        },
        trainer: {
          consent: {
            newsletter: {
              changeDate: now,
              accepted: newsletterAccepted,
            },
            privacyPolicy: {
              changeDate: now,
              accepted: termsAccepted,
            },
            termsAndConditions: {
              changeDate: now,
              accepted: termsAccepted,
            },
          },
        },
      });
      return newUserId;
    } catch (e) {
      try {
        await login(email, password);
      } catch (_) {
        props.setWaitingAccountCreation(false);
        if (e.code === 'auth/email-already-in-use') {
          setErrorMessage({
            ...errorMessage,
            email: t('SIGN_UP_FORM_MAIL_IN_USE'),
          });
          setValidation({...validation, email: false});
        } else {
          setErrorMessage({...errorMessage, email: e.message});
          setValidation({...validation, email: false});
        }
      }
      return '';
    }
  };

  const slackNotification = (slackWebhookUrl, slackMessage) => {
    const call = firebase
      //@ts-ignore
      .app()
      .functions('europe-west1')
      .httpsCallable('slackNotification');
    call({webhookUrl: slackWebhookUrl, message: slackMessage});
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    switch (props.flag) {
      case 'newUser': {
        // returns empty string if firebase.createUser() fails
        const newUserId = await register(data.email, data.password);

        // Intercom update is only run if register()/firebase.createUser() was successful
        if (newUserId.trim()) {
          Intercom('update', {
            email: data.email,
            user_id: newUserId,
          });
        }
        Intercom('trackEvent', 'Registration: Account Created');
        break;
      }
      case 'personal':
        /* Intercom update
         * We update the IC user id as well in case the user creates an account in the
         * mobile app first. In that scenario the previous step (inputting the user's email
         * address & generating a user id) is skipped in the web registration process.
         * This way we make sure user details are assigned to the correct IC user. */
        Intercom('update', {
          user_id: userId,
          name: data.firstName + ' ' + data.lastName,
          phone: data.phoneNumber,
        });
        Intercom('trackEvent', 'Registration: Personal Data');

        let type: 'Athlete' | 'Trainer' | 'Trainer & Athlete';

        if (user.type === 'Athlete') {
          type = 'Trainer & Athlete';
        } else {
          type = 'Trainer';
        }
        props.setData({
          firstName: data.firstName,
          lastName: data.lastName,
          'contact.phoneNumber': data.phoneNumber,
          'trainer.registrationFlags.personal': true,
          type: type,
        });
        break;
      case 'sport':
        // Intercom update
        Intercom('update', {
          company: {
            name: data.businessName,
            company_id: trainerCode ?? '',
            industry: data.sport,
          },
        });
        Intercom('trackEvent', 'Onboarding: Sport & Company Data');

        firestore.update(usersDataPublicProfileQuery(userId), {
          'trainer.businessName': data.businessName,
        });
        props.setData({
          'trainer.businessName': data.businessName,
          'trainer.totalAthletes': data.numberAthletes,
          measurement: data.measurement,
          lengthMeasurement: data.measurement === 'kg' ? 'metric' : 'imperial',
          volumeMeasurement: data.measurement === 'kg' ? 'metric' : 'imperial',
          sport: data.sport,
          'trainer.settings.dateFormat':
            data.measurement === 'kg' ? 'normal' : 'us',
          'trainer.registrationFlags.sport': true,
          'trainer.registrationFlags.registrationCompleted': true,
          'trainer.registrationFlags.accountUnlocked': true,
        });

        if (env !== 'development') {
          const slackWebhookUrl =
            'https://hooks.slack.com/services/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';
          // eslint-disable-next-line max-len
          const slackMessage = `Congratulations a new Trainer signed up. Name: ${user.firstName} ${user.lastName} | Email: ${user.email} | Phone: ${user.contact.phoneNumber} | Sport: ${data.sport} | Business Name: ${data.businessName} | Number of Athletes: ${data.numberAthletes}`;
          slackNotification(slackWebhookUrl, slackMessage);
        }
        Intercom('trackEvent', 'Registration: Completed');

        break;
      case 'consent':
        firestore.update(usersDataPublicProfileQuery(userId), {
          'trainer.trainerAVV': {
            text: contractText,
            changeDate: moment().utc().format('YYYYMMDD'),
          },
        });
        props.setData({
          'trainer.trainerAVV': {
            text: contractText,
            changeDate: moment().utc().format('YYYYMMDD'),
          },
          'trainer.registrationFlags.consent': true,
        });
    }
  };

  const sports = [
    {value: 'SPORT_TYPE_BODYBUILDING', label: t('SPORT_TYPE_BODYBUILDING')},
    {value: 'SPORT_TYPE_CALISTHENICS', label: t('SPORT_TYPE_CALISTHENICS')},
    {value: 'SPORT_TYPE_CROSSFIT', label: t('SPORT_TYPE_CROSSFIT')},
    {value: 'SPORT_TYPE_FITNESS', label: t('SPORT_TYPE_FITNESS')},
    {
      value: 'SPORT_TYPE_POWERLIFTING',
      label: t('SPORT_TYPE_POWERLIFTING'),
    },
    {value: 'SPORT_TYPE_WEIGHTLIFTING', label: t('SPORT_TYPE_WEIGHTLIFTING')},
    {value: 'SPORT_TYPE_PHYSIOTHERAPY', label: t('SPORT_TYPE_PHYSIOTHERAPY')},
    {value: 'SPORT_TYPE_STRONGMAN', label: t('SPORT_TYPE_STRONGMAN')},
    {value: 'SPORT_TYPE_OTHER', label: t('SPORT_TYPE_OTHER')},
  ];
  const measurement = [
    {value: 'kg', label: t('KG')},
    {value: 'lbs', label: t('LBS')},
  ];
  const steps = ['1', '2', '3', '4'];

  const linkTerms = (
    <Link
      onClick={() => {
        window.open(t('SIGN_UP_TAC_LINK'));
      }}
    >
      {t('SIGN_UP_TAC_LINK_TEXT')}
    </Link>
  );
  const linkPrivacyPolicy = (
    <Link
      onClick={() => {
        window.open(t('SIGN_UP_PP_LINK'));
      }}
    >
      {t('SIGN_UP_PP_LINK_TEXT')}
    </Link>
  );
  return (
    <div style={styles.main}>
      <ThemeProvider theme={sharedTheme}>
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              marginTop: 4,
              marginBottom: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h4" style={styles.unlock}>
              {t('SIGN_UP_FORM_HEADLINE')}
            </Typography>
            <Typography
              component="h1"
              variant="subtitle1"
              style={styles.subtitle}
            >
              {t('SIGN_UP_FORM_SUBTITLE')}
            </Typography>
            <Box sx={{width: '60%'}}>
              <Stepper activeStep={props.step}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel />
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{mt: 3}}
            >
              {/* MAIL, PASSWORD */}

              {props.flag === 'newUser' ? (
                props.loading ? (
                  <></>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <SignUpTextField
                        disabled={props.loading}
                        autoFocus
                        required
                        fullWidth
                        id="email"
                        label={t('SIGN_IN_MAIL')}
                        name="email"
                        autoComplete="email"
                        type="email"
                        error={validation.email === false}
                        helperText={validation.email ? '' : errorMessage.email}
                        onChange={onChange}
                        onBlur={validateInput}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <SignUpTextField
                        disabled={props.loading}
                        required
                        fullWidth
                        name="password"
                        label={t('SIGN_IN_PASSWORD')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        error={validation.password === false}
                        helperText={
                          validation.password ? '' : errorMessage.password
                        }
                        onChange={onChange}
                        onBlur={validateInput}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={t('SIGN_UP_FORM_SHOW_PASSWORD')}
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <div style={styles.spaceBetween} />
                      <div style={styles.checkboxContainer}>
                        <Checkbox
                          disabled={props.loading}
                          style={{color: light_gray}}
                          checked={termsAccepted}
                          onClick={() => {
                            setTermsAccepted(!termsAccepted);
                          }}
                        />
                        <Typography
                          alignSelf={'center'}
                          align={'left'}
                          color={white}
                        >
                          {t('SIGN_UP_TERMS_1')} {linkTerms}
                          {t('SIGN_UP_TERMS_2')}
                          {linkPrivacyPolicy} {t('SIGN_UP_TERMS_3')}
                        </Typography>
                      </div>
                      <div style={styles.checkboxContainer}>
                        <Checkbox
                          disabled={props.loading}
                          style={{color: light_gray}}
                          checked={newsletterAccepted}
                          onClick={() => {
                            setNewsletterAccepted(!newsletterAccepted);
                          }}
                        />
                        <Typography
                          alignSelf={'center'}
                          align={'center'}
                          color={white}
                        >
                          {t('SIGN_UP_NEWSLETTER')}{' '}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                )
              ) : (
                <></>
              )}
              {/* consent text */}
              {props.flag === 'consent' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      alignSelf={'center'}
                      align={'center'}
                      variant={'subtitle1'}
                      style={styles.subtitleConsent}
                      color={white}
                    >
                      {t('SIGN_UP_CONTRACT_EXPLANATION')}
                    </Typography>
                    <div style={styles.contractContainer}>
                      <TextField
                        id="filled-multiline-static"
                        multiline
                        value={contractText}
                        disabled={editContract}
                        onChange={(newText) => {
                          setContractText(newText.target.value);
                        }}
                        variant="filled"
                        className={classes.customDisable}
                        sx={{
                          width: '100%',
                          backgroundColor: 'white',
                          '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: 'white',
                          },
                        }}
                      />
                      <IconButton
                        aria-label="edit"
                        style={styles.iconButton}
                        onClick={() => {
                          setEditContract(!editContract);
                        }}
                      >
                        {editContract ? <EditIcon /> : <DoneIcon />}
                      </IconButton>
                    </div>
                  </Grid>
                </Grid>
              )}

              {/* FIRSTNAME, LASTNAME, PHONENUMBER */}

              {props.flag === 'personal' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <SignUpTextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label={t('SIGN_UP_FIRST_NAME')}
                      autoFocus
                      type="text"
                      error={validation.firstName === false}
                      helperText={
                        validation.firstName ? '' : errorMessage.firstName
                      }
                      onChange={onChange}
                      onBlur={validateInput}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SignUpTextField
                      required
                      fullWidth
                      id="lastName"
                      label={t('SIGN_UP_LAST_NAME')}
                      name="lastName"
                      autoComplete="family-name"
                      type="text"
                      error={validation.lastName === false}
                      helperText={
                        validation.lastName ? '' : errorMessage.lastName
                      }
                      onChange={onChange}
                      onBlur={validateInput}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SignUpPhoneNumber
                      defaultCountry={'de'}
                      variant="outlined"
                      // @ts-ignore
                      localization={{
                        Germany: 'Deutschland',
                        Austria: 'Österreich',
                        Switzerland: 'Schweiz',
                      }}
                      preferredCountries={[
                        'de',
                        'es',
                        'it',
                        'at',
                        'ch',
                        'gb',
                        'us',
                        'ca',
                        'au',
                        'nz',
                      ]}
                      disableAreaCodes
                      required
                      fullWidth
                      id="phoneNumber"
                      label={t('SIGN_UP_FORM_PHONE_NUMBER')}
                      name="phoneNumber"
                      autoComplete="phoneNumber"
                      error={validation.phoneNumber === false}
                      helperText={
                        validation.phoneNumber ? '' : errorMessage.phoneNumber
                      }
                      onChange={(value) =>
                        nonGenericChange('phoneNumber', value)
                      }
                    />
                  </Grid>
                </Grid>
              )}

              {/* BUSINESS NAME, ATHLETES, MEASUREMENT, TYPE, COMPETITION */}

              {props.flag === 'sport' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <SignUpTextField
                      required
                      fullWidth
                      autoFocus
                      id="businessName"
                      label={t('SIGN_UP_BUSINESS')}
                      name="businessName"
                      type="text"
                      error={validation.businessName === false}
                      helperText={
                        validation.businessName ||
                        validation.businessName === undefined
                          ? t('SIGN_UP_FORM_BUSINESS_HELP')
                          : errorMessage.businessName
                      }
                      onChange={onChange}
                      onBlur={validateInput}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SignUpTextField
                      required
                      fullWidth
                      id="numberAthletes"
                      label={t('SIGN_UP_FORM_NUMBER_ATHLETES')}
                      name="numberAthletes"
                      type="number"
                      error={validation.numberAthletes === false}
                      helperText={
                        validation.numberAthletes ||
                        validation.numberAthletes === undefined
                          ? t('SIGN_UP_FORM_NUMBER_ATHLETES_HELP')
                          : errorMessage.numberAthletes
                      }
                      onChange={onChange}
                      onBlur={validateInput}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SignUpTextField
                      select
                      name="measurement"
                      required
                      fullWidth
                      id="measurement"
                      label={t('SIGN_UP_MEASUREMENT')}
                      error={validation.measurement === false}
                      helperText={
                        validation.measurement ? '' : errorMessage.measurement
                      }
                      onChange={onChange}
                      onBlur={validateInput}
                    >
                      {measurement.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </SignUpTextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SignUpTextField
                      select
                      name="sport"
                      required
                      fullWidth
                      id="sport"
                      label={t('SIGN_UP_FORM_SPORT')}
                      error={validation.sport === false}
                      helperText={validation.sport ? '' : errorMessage.sport}
                      onChange={onChange}
                      onBlur={validateInput}
                    >
                      {sports.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </SignUpTextField>
                  </Grid>
                </Grid>
              )}

              {props.loading ? (
                <div style={styles.loadingSpinnerContainer}>
                  <CircularProgress style={styles.spinner} />
                  <Typography
                    alignSelf={'center'}
                    align={'center'}
                    variant={'subtitle1'}
                    style={styles.subtitleConsent}
                    color={white}
                  >
                    {t('SIGN_UP_LOADING_NEW_ACCOUNT')}
                  </Typography>
                </div>
              ) : (
                <>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                    disabled={!activateButton[props.flag]}
                    style={{
                      ...styles.button,
                      opacity: activateButton[props.flag] ? 1 : 0.6,
                    }}
                  >
                    {props.flag === 'newUser'
                      ? t('SIGN_UP_FORM_BUTTON_CREATE_ACCOUNT')
                      : props.flag === 'personal' || props.flag === 'consent'
                      ? t('SIGN_UP_FORM_BUTTON_NEXT')
                      : t('SIGN_UP_FORM_BUTTON_START')}
                  </Button>

                  <div style={styles.signIn}>
                    <Typography variant="body2" style={{color: white}}>
                      {t('SIGN_UP_SIGN_IN_TITLE')}
                    </Typography>
                    <Link
                      onClick={() => {
                        logout();
                      }}
                      variant="body2"
                      style={styles.linkMargin}
                    >
                      {t('SIGN_UP_BUTTON_SIGN_IN')}
                    </Link>
                  </div>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

type Styles = {
  main: CSSProperties;
  buttonContainer: CSSProperties;
  loginButton: CSSProperties;
  alert: CSSProperties;
  headline: CSSProperties;
  linkButton: CSSProperties;
  button: CSSProperties;
  unlock: CSSProperties;
  text: CSSProperties;
  signIn: CSSProperties;
  linkMargin: CSSProperties;
  subtitle: CSSProperties;
  checkboxContainer: CSSProperties;
  skipSize: CSSProperties;
  skipPositioning: CSSProperties;
  skipButton: CSSProperties;
  contractContainer: CSSProperties;
  iconButton: CSSProperties;
  spaceBetween: CSSProperties;
  loadingSpinnerContainer: CSSProperties;
  subtitleConsent: CSSProperties;
  spinner: CSSProperties;
};

const styles: Styles = {
  loadingSpinnerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 16,
    color: primary_green,
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
  button: {
    backgroundColor: primary_green,
    color: white,
  },
  unlock: {color: white, marginBottom: 2},
  signIn: {justifyContent: 'center', display: 'flex'},
  text: {color: white, textAlign: 'center'},
  linkMargin: {marginLeft: 5},
  subtitle: {
    color: white,
    marginBottom: 8,
    width: '65%',
    textAlign: 'center',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
  },
  skipSize: {
    display: 'flex',
    width: 'fit-content',
  },
  skipPositioning: {
    display: 'flex',
    justifyContent: 'center',
  },
  skipButton: {textDecoration: 'underline', cursor: 'pointer'},
  contractContainer: {
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
  },
  iconButton: {
    alignSelf: 'flex-end',
  },
  spaceBetween: {marginTop: 10},
  subtitleConsent: {marginBottom: 24},
};
