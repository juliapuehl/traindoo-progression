import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
//TODO: urgent remove following import (only allowed in dev env)
import {createReduxEnhancer} from '@sentry/react';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import localforage from 'localforage';
import {
  actionTypes as rrfActionTypes,
  ExtendedFirestoreInstance,
  firebaseReducer,
  FirebaseReducer,
} from 'react-redux-firebase';
import {
  constants as rfConstants,
  firestoreReducer,
  FirestoreReducer,
  getFirestore,
  reduxFirestore,
} from 'redux-firestore'; // <- needed if using firestore
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import {Message} from '../traindoo_shared/types/ChatTypes';
import {ExerciseLibraryEntryType} from '../traindoo_shared/types/ExerciseLibrary';
import {UserType} from '../traindoo_shared/types/User';
import {DailyProgressArray} from '../types/UserStorageData';
import {athleteSlice, athleteSliceKey, AthleteState} from './athleteSlice';
import {checkEditorSlice, checkEditorSliceKey} from './checkEditorSlice';
import {
  navigationSlice,
  navigationSliceKey,
  NavigationState,
} from './navigationSlice';
import {trainingSlice, trainingSliceKey, TrainingState} from './trainingSlice';

export const appReducer = combineReducers({
  [navigationSliceKey]: navigationSlice.reducer,
  [athleteSliceKey]: athleteSlice.reducer,
  [trainingSliceKey]: trainingSlice.reducer,
  [checkEditorSliceKey]: checkEditorSlice.reducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

export const persistConfig = {
  key: 'root',
  storage: localforage,
};

export type ThunkDependencies = () => ExtendedFirestoreInstance;

export const USER_LOGOUT = {
  type: 'USER_LOGOUT',
};

const rootReducer = (state, action) => {
  // Logout logic
  if (action.type === 'USER_LOGOUT') {
    // for all keys defined in your persistConfig(s)
    localforage.removeItem('persist:root');
    // storage.removeItem('persist:otherKey')
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistRootReducer = persistReducer(persistConfig, rootReducer);

const sentryReduxEnhancer = createReduxEnhancer({
  actionTransformer: (action) => {
    if (action.type === '@@reactReduxFirebase/LOGIN') {
      return {
        ...action,
        auth: {
          uid: action.auth.uid,
          emailVerified: action.auth.emailVerified,
        },
      };
    }

    if (action.type.toLowerCase().includes('redux')) {
      return null;
    }

    return action;
  },
  stateTransformer: (state) => ({
    firebase: {
      auth: {
        emailVerified: state.firebase.auth.emailVerified,
        uid: state.firebase.auth.uid,
        metadata: state.firebase.auth.metadata,
        providerId: state.firebase.auth.providerId,
        isAnonymous: state.firebase.auth.isAnonymous,
        isEmpty: state.firebase.auth.isEmpty,
        isLoaded: state.firebase.auth.isLoaded,
      },
      errors: state.firebase.errors,
      authError: state.firebase.authError,
      isInitializing: state.firebase.isInitializing,
      listeners: state.firebase.listeners,
      profile: state.firebase.profile,
      requested: state.firebase.requested,
      requesting: state.firebase.requesting,
      timestamps: state.firebase.timestamps,
    },
    // firestore: state.firestore, maximum call size exceeded :(
    navigationStates: state.navigationStates,
    athleteState: state.athleteState,
    trainingState: state.trainingState,
  }),
});

export const store = configureStore({
  reducer: persistRootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      immutableCheck: {
        ignoredPaths: ['firebase', 'firestore'],
      },
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          ...Object.keys(rfConstants.actionTypes).map(
            (type) => `${rfConstants.actionsPrefix}/${type}`,
          ),
          ...Object.keys(rrfActionTypes).map(
            (type) => `@@reactReduxFirebase/${type}`,
          ),
        ],
        ignoredPaths: ['firebase', 'firestore'],
      },
      thunk: {extraArgument: getFirestore},
    }),
  ],
  enhancers: (defaultEnhancers) => [
    sentryReduxEnhancer,
    reduxFirestore(firebase),
    ...defaultEnhancers,
  ],
});

export const getStore = () => store;
export const persistor = persistStore(store);

//export type RootState = ReturnType<typeof store.getState>;

type Entity<T> = FirestoreReducer.Entity<T>;
//import EntityWithId = FirestoreReducer.EntityWithId;

interface FirestoreSchema {
  publicTrainerProfile: Entity<UserType['trainer']>;
  dailyProgressImages: Entity<DailyProgressArray>;
  exerciseLibrary: Entity<ExerciseLibraryEntryType>;
  selectedAthlete: Entity<UserType>;
  user: Entity<UserType>;
  mostRecentChatMsgQuery: Entity<Message>;
}

export interface RootState {
  navigationStates: NavigationState;
  athleteState: AthleteState;
  trainingState: TrainingState;
  firebase: FirebaseReducer.Reducer<FirebaseReducer.Profile<UserType>>;
  firestore: FirestoreReducer.Reducer<FirestoreSchema>;
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  ThunkDependencies,
  Action<string>
>;
