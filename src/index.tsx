import {CssBaseline} from '@mui/material';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ReactReduxFirebaseProvider} from 'react-redux-firebase';
import {createFirestoreInstance} from 'redux-firestore'; // <- needed if using firestore
import {PersistGate} from 'redux-persist/integration/react';
import App from './App';
import {config} from './firebase/config';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {persistor, store} from './store/store';
import './wdyr'; // <--- first import

import * as Sentry from '@sentry/react';
import {BrowserTracing} from '@sentry/tracing';
import {
  createRoutesFromChildren,
  matchRoutes,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import {ErrorOverlay} from './components/UI/ErrorOverlay';

const env = process.env.REACT_APP_ENV;
const fbConfig = config[env];

console.log('Current Environment: ' + env);

firebase.initializeApp(fbConfig);
firebase.firestore();
firebase
  .firestore()
  .enablePersistence()
  .catch((err) => {
    console.log(err);

    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });
//TODO: Switch to europe-west1
//https://firebase.google.com/docs/functions/locations#http_and_client-callable_functions
//https://stackoverflow.com/questions/57547745/how-to-use-httpscallable-on-a-region-other-then-us-central1-for-web?rq=1
firebase.functions();
firebase.storage();

const rrfConfig = {
  userProfile: 'user',
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  // enableClaims: true // Get custom claims along with the profile
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

console.log('release', process.env.REACT_APP_SENTRY_RELEASE);

Sentry.init({
  dsn: 'https://5c5ade9c37304545a175f3dfe54af7df@o1299768.ingest.sentry.io/4504275276201984',
  normalizeDepth: 10,
  sampleRate: 1,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
    }),
    new Sentry.Integrations.Breadcrumbs({
      console: false,
    }),
  ],
  tracesSampleRate: 1.0,
  environment: env,
  release: process.env.REACT_APP_SENTRY_RELEASE,
  beforeBreadcrumb(breadcrumb, _hint) {
    if (!breadcrumb.category) {
      return breadcrumb;
    }

    return ['ui.click', 'touch'].includes(breadcrumb.category)
      ? null
      : breadcrumb;
  },
  beforeSend: (event) => {
    console.log('sending error to sentry');
    return event;
  },
});

const fallbackComponent = (props: any) => (
  <ErrorOverlay
    {...props}
    userId={(store.getState().firebase as any).auth.uid}
  />
);

export const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <PersistGate loading={null} persistor={persistor}>
            <Sentry.ErrorBoundary fallback={fallbackComponent}>
              <App />
            </Sentry.ErrorBoundary>
          </PersistGate>
        </ReactReduxFirebaseProvider>
      </Provider>
    </CssBaseline>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
