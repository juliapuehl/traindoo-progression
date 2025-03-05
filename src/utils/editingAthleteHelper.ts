import firebase from 'firebase/app';
import {Dispatch} from 'react';
import {ExtendedFirestoreInstance} from 'react-redux-firebase';
import {specificUserQuery} from '../logic/firestore';
import {setIndexSelectedCycle} from '../store/trainingSlice';
import {
  AthleteTagType,
  trainerOneRMTableOptions,
} from '../traindoo_shared/types/User';

export const addToAthleteTotalCycles = async (
  currentValue: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const changeObject = {} as {totalCycles: number};
  changeObject.totalCycles = currentValue ? currentValue + 1 : 1;
  firestore.update(specificUserQuery(athleteUserId), changeObject);
};

export const removeFromAthleteTotalCycles = async (
  totalCycles: number,
  totalTrainings: number,
  athleteUserId: string,
  dispatch: Dispatch<any>,
  firestore: ExtendedFirestoreInstance,
) => {
  if (totalTrainings <= 1 && totalCycles > 1) {
    const newCycle = totalCycles ? totalCycles - 1 : 1;
    firestore.update(specificUserQuery(athleteUserId), {
      totalCycles: newCycle,
      currentCycle: newCycle,
    });
    dispatch(setIndexSelectedCycle(newCycle));
  }
};

export const editAthleteStartDayInWeek = async (
  startDayInWeek: number,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  if (startDayInWeek >= 0 && !isNaN(startDayInWeek) && startDayInWeek < 7) {
    firestore.update(specificUserQuery(athleteUserId), {
      startDayInWeek: startDayInWeek,
    });
  }
};
export const editAthleteTrainerNote = async (
  text: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  if (text !== undefined) {
    firestore.update(specificUserQuery(athleteUserId), {
      'athlete.trainerSettings.trainerNote': text,
    });
  }
};

export const editAthleteWeeklyNotification = async (
  value: boolean,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  if (value !== undefined) {
    firestore.update(specificUserQuery(athleteUserId), {
      'athlete.trainerSettings.notificationOptions.weeklyMail': value,
    });
  }
};
export const editAthleteCompetitionDate = async (
  value: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  if (value !== undefined) {
    firestore.update(specificUserQuery(athleteUserId), {
      'athlete.competitionDate': value,
    });
  }
};
export const editAthleteOneRMTableSettings = async (
  athleteUserId: string,
  newSetting: trainerOneRMTableOptions,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(athleteUserId), {
    'athlete.trainerSettings.trainerOneRMTable': newSetting,
  });
};
export const editAthleteOneRMCycleTableSettings = async (
  athleteUserId: string,
  newSetting: boolean,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(athleteUserId), {
    'athlete.trainerSettings.showTrainerOneRMCycleTable': newSetting,
  });
};
export const editRirSwitch = async (
  athleteUserId: string,
  newSetting: boolean,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(athleteUserId), {
    'athlete.trainerSettings.useRir': newSetting,
  });
};
export const editAthleteOneRMPercentageRound = async (
  athleteUserId: string,
  newValue: number,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(athleteUserId), {
    'athlete.trainerSettings.percentageRoundTarget': newValue,
  });
};

export const setAthleteTotalCycles = async (
  athleteUserId: string,
  totalCycles: number,
  firestore: ExtendedFirestoreInstance,
) => {
  await firestore.update(specificUserQuery(athleteUserId), {
    totalCycles: totalCycles,
    currentCycle: totalCycles,
    'athlete.registrationFlags.currentCycleSetByTrainer': true,
  });
};
export const setAthleteOneRM = async (
  value: number,
  path: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const oneRMPath = 'athlete.oneRMs.' + path;
  await firestore.update(specificUserQuery(athleteUserId), {
    [oneRMPath]: value,
  });
};
export const setAthleteOneRMCycle = async (
  value: number,
  path: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const oneRMPath = 'athlete.oneRMs.cycles.' + path;
  await firestore.update(specificUserQuery(athleteUserId), {
    [oneRMPath]: value,
  });
};

export const unlockAthleteAccount = (
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(athleteUserId), {
    ['athlete.registrationFlags.accountUnlocked']: true,
  });
};

export const deleteTagFromAthlete = async (
  tag: AthleteTagType,
  userId: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(userId), {
    ['trainer.athleteStates.' + athleteUserId + '.tags']:
      firebase.firestore.FieldValue.arrayRemove(tag),
  });
};
