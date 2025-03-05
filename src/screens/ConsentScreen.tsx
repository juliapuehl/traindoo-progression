import {ThemeProvider} from '@emotion/react';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Checkbox,
  Container,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  getPrivacyPolicyExpired,
  getTermsAndConditionsExpired,
  getUser,
  usersDataPublicProfileQuery,
  usersDataQuery,
} from '../logic/firestore';
import {
  background_color_dark,
  light_gray,
  primary_green,
  sidebar_color_dark,
  white,
} from '../styles/colors';
import {sharedTheme} from '../styles/sharedTheme';
const useStyles = makeStyles({
  customDisable: {
    '& .MuiInputBase-input.Mui-disabled': {
      '-webkit-text-fill-color': 'black !important',
    },
  },
});
export const ConsentScreen = () => {
  const classes = useStyles();
  const user = useSelector(getUser);
  const firestore = useFirestore();
  const trainerAVVMissing = !user?.trainer?.trainerAVV?.changeDate;
  const privacyPolicyExpired = useSelector(getPrivacyPolicyExpired);
  const termsAndConditionsExpired = useSelector(getTermsAndConditionsExpired);
  const termsMissing = privacyPolicyExpired || termsAndConditionsExpired;

  const [editContract, setEditContract] = useState(false);

  const [privacyPolicyAndTOSAccepted, setPrivacyPolicyAndTOSAccepted] =
    useState(!privacyPolicyExpired && !termsAndConditionsExpired);
  const [trainerAvv, setTrainerAvv] = useState(t('SIGN_UP_CONTRACT'));

  const handlePrivacyPolicyChange = async () => {
    const now = moment().utc().format('YYYYMMDD');
    await firestore.update(usersDataQuery(user.id), {
      ['trainer.consent']: {
        privacyPolicy: {
          changeDate: now,
          accepted: true,
        },
        termsAndConditions: {
          changeDate: now,
          accepted: true,
        },
      },
    });
  };

  const handleTrainerAVVChange = async () => {
    const now = moment().utc().format('YYYYMMDD');
    await firestore.update(usersDataPublicProfileQuery(user.id), {
      'trainer.trainerAVV': {
        text: trainerAvv,
        changeDate: now,
      },
    });
    await firestore.update(usersDataQuery(user.id), {
      'trainer.trainerAVV': {
        text: trainerAvv,
        changeDate: now,
      },
      'trainer.registrationFlags.consent': true,
    });
  };
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
  const privacyButtonDisabled = !privacyPolicyAndTOSAccepted;
  return (
    <div style={styles.container}>
      <div style={styles.imageBackground}>
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
                  {t('CONSENT_TITLE')}
                </Typography>
                {termsMissing && (
                  <Typography
                    style={styles.subtitle}
                    alignSelf={'center'}
                    align={'center'}
                    variant={'subtitle1'}
                    color={white}
                  >
                    {t('CONSENT_TERMS_MISSING')}
                  </Typography>
                )}
                {trainerAVVMissing && !termsMissing && (
                  <Typography
                    style={styles.subtitle}
                    alignSelf={'center'}
                    align={'center'}
                    variant={'subtitle1'}
                    color={white}
                  >
                    {t('SIGN_UP_CONTRACT_EXPLANATION')}
                  </Typography>
                )}
                {termsMissing && (
                  <Grid container spacing={2}>
                    {(termsAndConditionsExpired || privacyPolicyExpired) && (
                      <div style={styles.checkboxContainer}>
                        <Checkbox
                          style={{color: light_gray}}
                          checked={privacyPolicyAndTOSAccepted}
                          onClick={() => {
                            setPrivacyPolicyAndTOSAccepted(
                              !privacyPolicyAndTOSAccepted,
                            );
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
                    )}
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{mt: 3, mb: 2}}
                      onClick={handlePrivacyPolicyChange}
                      disabled={privacyButtonDisabled}
                      style={{
                        ...styles.button,
                        opacity: !privacyButtonDisabled ? 1 : 0.6,
                      }}
                    >
                      {t('SIGN_UP_FORM_BUTTON_NEXT')}
                    </Button>
                  </Grid>
                )}
                {trainerAVVMissing && !termsMissing && (
                  <Box sx={{width: '100%'}}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <div style={styles.contractContainer}>
                          <TextField
                            id="filled-multiline-static"
                            multiline
                            value={trainerAvv}
                            disabled={editContract}
                            onChange={(newText) => {
                              setTrainerAvv(newText.target.value);
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
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{mt: 3, mb: 2}}
                      onClick={handleTrainerAVVChange}
                      style={{
                        ...styles.button,
                      }}
                    >
                      {t('SIGN_UP_FORM_BUTTON_NEXT')}
                    </Button>
                  </Box>
                )}
              </Box>
            </Container>
          </ThemeProvider>
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
    marginTop: 12,
    marginBottom: 24,
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
};
