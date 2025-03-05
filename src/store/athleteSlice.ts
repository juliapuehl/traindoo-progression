import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {athleteSorting} from '../hooks/useGetAthletesCardData';
import {getSelectedAthlete} from '../logic/firestore';
import {
  AthleteActiveState,
  trainerOneRMTableOptions,
  UserType,
} from '../traindoo_shared/types/User';
import {RootState} from './store';

const initialState: AthleteState = {
  athleteId: undefined,
  athleteTagFilterArray: [],
  allAthletes: {},
};

export type AthleteState = {
  athleteId: string | undefined;
  athleteTagFilterArray: Array<string>;
  allAthletes: {[userId: string]: {state: AthleteActiveState; data: UserType}};
};

export const athleteSliceKey = 'athleteState';

// == REDUCER
export const athleteSlice = createSlice({
  name: athleteSliceKey,
  initialState,
  reducers: {
    setAthleteTagFilter(state, action: PayloadAction<Array<string>>) {
      state.athleteTagFilterArray = action.payload;
    },
    setCurrentAthleteId(state, action: PayloadAction<string>) {
      state.athleteId = action.payload;
    },

    resetCurrentAthleteId(state) {
      state.athleteId = undefined;
    },
    resetAthleteTagFilter(state) {
      state.athleteTagFilterArray = undefined;
    },
    resetAthleteSlice(state) {
      state.athleteId = undefined;
      state.athleteTagFilterArray = undefined;
    },
    setAthleteData(
      state,
      action: PayloadAction<{
        state: AthleteActiveState;
        data: UserType;
        id: string;
      }>,
    ) {
      const newData = {
        state: action.payload.state,
        data: action.payload.data,
      };
      if (!state.allAthletes) {
        state.allAthletes = {[action.payload.id]: newData};
      } else {
        state.allAthletes[action.payload.id] = newData;
      }
    },
  },
});

// == ACTIONS
export const {
  setCurrentAthleteId,
  resetCurrentAthleteId,
  resetAthleteTagFilter,
  resetAthleteSlice,
  setAthleteTagFilter,
  setAthleteData,
} = athleteSlice.actions;

// == SELECTORS
export const getAllAthletes = (state: RootState) => {
  const data = state[athleteSliceKey]?.allAthletes;
  if (data) {
    return Object.values(data).sort(athleteSorting);
  } else {
    return [];
  }
};
export const getCurrentAthlete = (state: RootState): UserType => {
  return getSelectedAthlete(state);
};

export const getAthleteTagFilter = (state: RootState): Array<string> => {
  return state[athleteSliceKey].athleteTagFilterArray;
};
export const getCurrentAthleteId = (state: RootState): string => {
  return state[athleteSliceKey].athleteId;
};
export const getCurrentAthleteCycle = (state: RootState) => {
  const cycle = getCurrentAthlete(state)?.currentCycle;
  if (cycle && cycle >= 1) {
    return cycle;
  } else {
    return 1;
  }
};
export const getCurrentAthleteOneRMTable = (state: RootState) => {
  const setting =
    getCurrentAthlete(state)?.athlete?.trainerSettings?.trainerOneRMTable;
  if (setting !== undefined) {
    return setting;
  } else {
    return trainerOneRMTableOptions.powerlifting;
  }
};
export const getCurrentAthleteOneRMValues = (state: RootState) => {
  return getCurrentAthlete(state)?.athlete?.oneRMs;
};
export const getCurrentAthleteOneRMCycleValues = (
  state: RootState,
  cycleIndex: number,
) => {
  const cycles = getCurrentAthlete(state)?.athlete?.oneRMs?.cycles;
  if (cycles) {
    return cycles['cycle' + cycleIndex];
  }
  return undefined;
};
export const getCurrentAthleteOneRMCycleSetting = (state: RootState) => {
  const option =
    getCurrentAthlete(state)?.athlete?.trainerSettings
      ?.showTrainerOneRMCycleTable;
  if (option !== undefined) {
    return option;
  } else {
    return false;
  }
};
export const getCurrentAthletePercentageRoundTarget = (state: RootState) => {
  const target =
    getCurrentAthlete(state)?.athlete?.trainerSettings?.percentageRoundTarget;
  if (target !== undefined) {
    return target;
  } else {
    return 0.01;
  }
};
export const getCurrentAthleteTrainerNote = (state: RootState) => {
  const note = getCurrentAthlete(state)?.athlete?.trainerSettings?.trainerNote;
  if (note !== undefined) {
    return note;
  }
  return '';
};
export const getCurrentAthleteWeeklyNotificationSetting = (
  state: RootState,
) => {
  const setting =
    getCurrentAthlete(state)?.athlete?.trainerSettings?.notificationOptions
      ?.weeklyMail;
  if (setting !== undefined) {
    return setting;
  } else {
    return true;
  }
};
export const getCurrentAthleteUseRir = (state: RootState) => {
  const setting = getCurrentAthlete(state)?.athlete?.trainerSettings?.useRir;
  if (setting !== undefined) {
    return setting;
  } else {
    return false;
  }
};
export const getAthleteStartDay = (state: RootState) => {
  const startDay = getCurrentAthlete(state)?.startDayInWeek;
  if (startDay && !isNaN(startDay)) {
    return startDay;
  } else {
    return 0;
  }
};
export const getAthleteCompetitionDate = (state: RootState) => {
  return getCurrentAthlete(state)?.athlete?.competitionDate;
};

export const getAthleteTotalCycle = (state: RootState) => {
  const totalCycles = getSelectedAthlete(state)?.totalCycles;
  const currentCycle = getCurrentAthleteCycle(state);
  if (totalCycles && totalCycles >= 1 && totalCycles >= currentCycle) {
    return totalCycles;
  } else if (currentCycle) {
    return currentCycle;
  } else {
    return 1;
  }
};
export const getAthleteFullName = (state: RootState) => {
  const firstName = getCurrentAthlete(state)?.firstName;
  const lastName = getCurrentAthlete(state)?.lastName;
  if (lastName && firstName) {
    return firstName + ' ' + lastName;
  } else {
    return '';
  }
};
export const getAthleteFirstName = (state: RootState) => {
  return getCurrentAthlete(state)?.firstName ?? '';
};
export const getAthleteCurrentWeek = (state: RootState) => {
  const week = getCurrentAthlete(state)?.currentWeek;
  if (week) {
    return week;
  } else {
    return 1;
  }
};

export const getAthleteProfilePicture = (state: RootState) => {
  return getCurrentAthlete(state)?.athlete?.profilePicture;
};

export const getAthletePlanningStartDate = (state: RootState) => {
  return getCurrentAthlete(state)?.planningStartDate;
};
