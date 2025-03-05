import {
  Box,
  Button,
  CircularProgress,
  Container,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from '@mui/material';
import {t} from 'i18n-js';
import React, {CSSProperties, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import {useNavigate} from 'react-router-dom';
import {getUser, usersDataQuery} from '../logic/firestore';
import {
  background_color_dark,
  primary_green,
  sidebar_color_dark,
  white,
} from '../styles/colors';
import {sharedTheme} from '../styles/sharedTheme';

export const PaymentScreen = () => {
  Intercom('update', {
    vertical_padding: 20,
  });

  const [createdCustomer, setCreatedCustomer] = useState<boolean>(false);
  const [flag, setFlag] = useState<
    'setup' | 'subscriptionSuccessfull' | 'subscriptionFailed'
  >('setup');
  const [step, setStep] = useState<number>(0);

  const firebase = useFirebase();
  const firestore = useFirestore();
  const navigate = useNavigate();

  const user = useSelector(getUser);

  // create stripe customer once based on firebase information (email, firstName, lastName)
  useEffect(() => {
    if (
      user?.trainer?.enablePayment &&
      !user?.trainer?.paymentFlags &&
      !user?.trainer?.stripe &&
      !createdCustomer &&
      user?.trainer?.paymentFlags?.customer?.created !== true
    ) {
      setCreatedCustomer(true);
      //console.log('creating customer');
      const createStripeCustomer = firebase
        //@ts-ignore
        .app()
        .functions('europe-west1')
        .httpsCallable('stripeCreateCustomerRecord');
      createStripeCustomer({
        uid: user.id,
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
      })
        .then(() => {
          //console.log('customer created');
        })
        .catch((error) => {
          console.warn(error);
        });
    } else {
      //console.log(user?.trainer?.stripe?.stripeId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.trainer?.paymentFlags) {
      if (
        user?.trainer?.paymentFlags?.customer.created === true &&
        //Subscription erstellt
        user?.trainer?.paymentFlags?.customer?.subscription?.created === true &&
        user?.trainer?.paymentFlags?.customer.subscription
          .cancelled_at_period_end !== true &&
        //Checkout Session abgeschlossen
        user?.trainer?.paymentFlags?.checkout?.session?.completed === true
      ) {
        setStep(2);
        setFlag('subscriptionSuccessfull');
        console.log('subscriptionSuccessfull');
      }
      if (
        user?.trainer?.paymentFlags?.payment_intent?.status ===
        'requires_payment_method'
      ) {
        setStep(1);
        setFlag('setup');
      }
    }
  }, [user]);

  const steps = ['1', '2'];

  const finishPayment = () => {
    firestore.update(usersDataQuery(user.id), {
      'trainer.paymentFlags.subscriptionSetupCompleted': true,
    });
    navigate('/home');
  };

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
                  {t('PAYMENT_HEADLINE')}
                </Typography>
                {/* //TODO: Text strings */}
                <Typography
                  component="h1"
                  variant="subtitle1"
                  style={styles.subtitle}
                >
                  {flag === 'setup' ? t('PAYMENT_DESC') : t('PAYMENT_SUCCESS')}
                </Typography>
                <Box sx={{width: '35%', mt: 2}}>
                  <Stepper activeStep={step}>
                    {steps.map((label) => {
                      const labelProps: {
                        optional?: React.ReactNode;
                        error?: boolean;
                      } = {};
                      if (label === '2' && flag === 'subscriptionFailed') {
                        labelProps.error = true;
                      }
                      return (
                        <Step key={label}>
                          <StepLabel {...labelProps} />
                        </Step>
                      );
                    })}
                  </Stepper>
                </Box>
              </Box>

              {/* CHECKOUT BOX */}
              {flag === 'setup' && (
                <Box
                  sx={{
                    marginTop: 4,
                    marginBottom: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{display: 'flex', flex: 1}}>
                    <img
                      // eslint-disable-next-line max-len
                      src="https://uploads-ssl.webflow.com/61b39334403d442cc99556b7/624f0f650689d314792c7184_Traindoo-Gru%CC%88n-Text-Rechts.svg"
                      alt="Traindoo Logo"
                      sizes="300x300"
                      style={styles.image}
                    />
                    <div className="description" style={styles.descContainer}>
                      <h3 style={styles.product}>{t('PAYMENT_PRODUCT')}</h3>
                      <h5 style={styles.desc}>
                        {t('PAYMENT_PRODUCT_PRICING')}
                      </h5>
                    </div>
                  </Box>
                  {/* //TODO: Validate if stripe id exists */}

                  <Button
                    onClick={() => {
                      const env = process.env.REACT_APP_ENV;
                      switch (env) {
                        case 'development':
                          // eslint-disable-next-line max-len
                          window.location.href = `https://europe-west1-traindoo-io-dev.cloudfunctions.net/stripeCreateCheckoutSession?id=${user.trainer.stripe.stripeId}&trainerId=${user.id}`;
                          break;
                        case 'staging':
                          // eslint-disable-next-line max-len
                          window.location.href = `https://europe-west1-traindoo-dev.cloudfunctions.net/stripeCreateCheckoutSession?id=${user.trainer.stripe.stripeId}&trainerId=${user.id}`;
                          break;
                        case 'production':
                          console.warn('Stripe for production not set up');
                          window.location.href = `https://traindoo.io`;
                          break;
                        default:
                          console.warn('No environment set');
                          break;
                      }
                    }}
                    disabled={
                      typeof user?.trainer?.stripe === 'undefined'
                        ? true
                        : false
                    }
                    style={
                      (styles.button,
                      typeof user?.trainer?.stripe === 'undefined'
                        ? {...styles.button, ...styles.buttonDisabled}
                        : {...styles.button, ...styles.buttonActive})
                    }
                  >
                    {typeof user?.trainer?.stripe === 'undefined' ? (
                      <div style={styles.loaderBox}>
                        <CircularProgress style={styles.spinner} />
                        <div style={styles.spinnerText}>
                          {t('PAYMENT_CREATING_CUSTOMER')}
                        </div>
                      </div>
                    ) : (
                      <div>Checkout</div>
                    )}
                  </Button>
                </Box>
              )}

              {/* SUCCESS MESSAGE */}
              {flag === 'subscriptionSuccessfull' && (
                <div>
                  <Box
                    sx={{
                      marginTop: 4,
                      marginBottom: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      component="h1"
                      variant="subtitle1"
                      style={styles.subtitle}
                    >
                      {t('PAYMENT_QUESTIONS')}
                    </Typography>
                  </Box>
                  <Button
                    type="submit"
                    onClick={finishPayment}
                    fullWidth
                    variant="contained"
                    sx={{mt: 0, mb: 2}}
                    style={{
                      ...styles.finishButton,
                    }}
                  >
                    {t('PAYMENT_FINISH')}
                  </Button>
                </div>
              )}
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
  button: CSSProperties;
  desc: CSSProperties;
  product: CSSProperties;
  image: CSSProperties;
  descContainer: CSSProperties;
  main: CSSProperties;
  unlock: CSSProperties;
  subtitle: CSSProperties;
  finishButton: CSSProperties;
  buttonDisabled: CSSProperties;
  buttonActive: CSSProperties;
  loaderBox: CSSProperties;
  spinner: CSSProperties;
  spinnerText: CSSProperties;
};

const styles: Styles = {
  loaderBox: {display: 'flex', justifyContent: 'center'},
  spinner: {color: white, height: 25, width: 25},
  spinnerText: {marginLeft: 10, alignSelf: 'center', fontWeight: 250},
  unlock: {color: 'white', marginBottom: 2},
  main: {
    backgroundColor: sidebar_color_dark,
    minWidth: 360,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
  },
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
  button: {
    height: '36px',
    color: 'white',
    width: '100%',
    fontSize: '14px',
    border: 0,
    fontWeight: 500,
    letterSpacing: 0.6,
    borderRadius: '0 0 6px 6px',
    transition: 'all 0.2s ease',
    boxShadow: '0px 4px 5.5px 0px rgba(0, 0, 0, 0.07)',
  },
  buttonActive: {
    backgroundColor: primary_green,
  },
  buttonDisabled: {
    backgroundColor: 'grey',
  },
  desc: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '-0.154px',
    color: '#242d60',
    margin: 0,
    opacity: 0.5,
  },
  product: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '-0.154px',
    color: '#242d60',
    margin: 0,
  },
  image: {borderRadius: 6, margin: 10, width: 54, height: 57},
  descContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  subtitle: {
    color: 'white',
    marginBottom: 8,
    width: '65%',
    textAlign: 'center',
  },
  finishButton: {
    backgroundColor: primary_green,
    color: white,
  },
};
