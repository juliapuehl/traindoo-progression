import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';
import {useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';

import {BrowserRouter, Navigate, Route} from 'react-router-dom';
import {BreakpointProvider, setDefaultBreakpoints} from 'react-socks';
import './App.css';
import CycleOverviewScreen from './components/trainingOverview/CycleOverviewScreen';
import {useUpdateLastLogin} from './hooks/useUpdateLastLogin';
import {
  checkCategoryLibraryQuery,
  currentAthleteDailyProgressImagesQuery,
  currentAthleteQuery,
  getUserId,
  legalInfoQuery,
  progressionToolQuery,
  usersDataPublicProfileQuery,
  usersDataQuery,
  usersExerciseLibraryQuery,
  webAppVersionInfoQuery,
  webSettingsLayoutQuery,
} from './logic/firestore';
import {LoginLayout} from './navigation/LoginLayout';
import {ProtectedLayout} from './navigation/ProtectedLayout';
import {AnalyticsScreen} from './screens/AnalyticsScreen';
import {AthletesScreen} from './screens/AthletesScreen';
import {ExerciseLibraryScreen} from './screens/ExerciseLibraryScreen';
import {ForgotPasswordScreen} from './screens/ForgotPasswordScreen';
import {LibraryScreen} from './screens/LibraryScreen';
import LoginScreen from './screens/LoginScreen';
import {RegistrationScreen} from './screens/RegistrationScreen';
import SettingsScreen from './screens/SettingsScreen';
import TrainingScreen from './screens/TrainingScreen';
import {getCurrentAthleteId} from './store/athleteSlice';
// import { sharedStyle } from "./styles/sharedStyles";
import {useMemo} from 'react';
import {SentryRoutes} from '.';
import WeekOverviewScreen from './components/trainingOverview/WeekOverviewScreen';
import {useGetAthletesCardData} from './hooks/useGetAthletesCardData';
import CheckPlanningScreen from './screens/CheckPlanningScreen';
import {DailyCheckEditScreen} from './screens/DailyCheckEditScreen';
import {PaymentScreen} from './screens/PaymentScreen';
import {WeeklyCheckEditScreen} from './screens/WeeklyCheckEditScreen';
import {getSelectedCycleIndex} from './store/trainingSlice';
import {primary_green, white} from './styles/colors';
import {allChatsQuery} from './traindoo_shared/selectors/chatQueries';
import {useInitLocales} from './translations/i18n';

const theme = createTheme({
  palette: {
    primary: {
      main: primary_green,
    },
    secondary: {
      main: white,
    },
  },
});

setDefaultBreakpoints([{xs: 0}, {s: 376}, {m: 426}, {l: 1800}, {xl: 2200}]);

const App = () => {
  const initLocales = useInitLocales();
  const intercomAppId = process.env.REACT_APP_INTERCOM_ENV;

  initLocales();

  const userId = useSelector(getUserId);
  const athleteId = useSelector(getCurrentAthleteId);
  const selectedCycle = useSelector(getSelectedCycleIndex);

  if (process.env.REACT_APP_ENV === 'development') {
    console.debug(userId, athleteId, selectedCycle);
  }

  // //TODO: move to backend
  useUpdateLastLogin();
  useGetAthletesCardData();
  // useFixSelectedAthleteRemoved();
  const watch = useMemo(() => {
    const returnArray = [
      legalInfoQuery(),
      webAppVersionInfoQuery(),
      progressionToolQuery(),
    ];
    // user needs to be signed in
    if (userId) {
      returnArray.push(usersDataQuery(userId));
      returnArray.push(usersExerciseLibraryQuery(userId));
      //TODO: Remove (usersDataPublicProfileQuery) after two month remove date: 14.08.2022
      returnArray.push(usersDataPublicProfileQuery(userId));
      returnArray.push(checkCategoryLibraryQuery(userId));
      returnArray.push(webSettingsLayoutQuery(userId));
      returnArray.push(allChatsQuery(userId));
      if (athleteId) {
        returnArray.push(currentAthleteQuery(athleteId));
        returnArray.push(currentAthleteDailyProgressImagesQuery(athleteId));
      }
    }
    return returnArray;
  }, [userId, athleteId]);
  useFirestoreConnect(watch);

  return (
    <StyledEngineProvider injectFirst>
      <BreakpointProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <SentryRoutes>
              <Route element={<LoginLayout />}>
                <Route index element={<Navigate to={'login'} />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordScreen />}
                />
                <Route path="/register" element={<RegistrationScreen />} />
              </Route>
              <Route path="/" element={<ProtectedLayout />}>
                <Route index element={<Navigate to={'home'} />} />
                <Route path="*" element={<Navigate to={'home'} />} />
                <Route path="/home" element={<AthletesScreen />} />
                <Route path="/checkout" element={<PaymentScreen />} />
                <Route path="/week-overview" element={<WeekOverviewScreen />} />
                <Route
                  path="/cycle-overview"
                  element={<CycleOverviewScreen />}
                />
                <Route path="/analytics" element={<AnalyticsScreen />} />
                <Route
                  path="/check-planning"
                  element={<CheckPlanningScreen />}
                />
                <Route path="/library" element={<LibraryScreen />}>
                  <Route index element={<Navigate to={'exercises'} />} />
                  <Route path="exercises" element={<ExerciseLibraryScreen />} />
                  <Route path="dailyCheck" element={<DailyCheckEditScreen />} />
                  <Route
                    path="weeklyCheck"
                    element={<WeeklyCheckEditScreen />}
                  />
                </Route>
                <Route path="/trainings" element={<TrainingScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
              </Route>
            </SentryRoutes>
          </BrowserRouter>
        </ThemeProvider>
      </BreakpointProvider>
    </StyledEngineProvider>
  );
};

export default App;
