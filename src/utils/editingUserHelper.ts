import firebase from 'firebase/app';
import {ExtendedFirestoreInstance} from 'react-redux-firebase';
import {
  specificUserQuery,
  usersDataPublicProfileQuery,
} from '../logic/firestore';
import {AthleteStateType, AthleteTagType} from '../traindoo_shared/types/User';

export const editUserPersonalInformation = async (
  value: string,
  key: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(userId), {
    [key]: value,
  });
};
export const editUserPersonalInformationPublic = async (
  value: string,
  key: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(usersDataPublicProfileQuery(userId), {
    [key]: value,
  });
};
export const editUserWeeklyMailNotification = async (
  value: boolean,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(userId), {
    'trainer.settings.notificationOptions.weeklyMail': value,
  });
};

export const addNewAthleteTag = async (
  tag: AthleteTagType,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(userId), {
    'trainer.athleteTags': firebase.firestore.FieldValue.arrayUnion(tag),
  });
};

export const deleteAthleteTag = async (
  tag: AthleteTagType,
  userId: string,
  athleteStates: AthleteStateType,
  firestore: ExtendedFirestoreInstance,
) => {
  const changeObject = {
    'trainer.athleteTags': firebase.firestore.FieldValue.arrayRemove(tag),
  };
  if (athleteStates) {
    Object.keys(athleteStates).forEach((athleteUserId) => {
      changeObject['trainer.athleteStates.' + athleteUserId + '.tags'] =
        firebase.firestore.FieldValue.arrayRemove(tag);
    });
  }
  firestore.update(specificUserQuery(userId), changeObject);
};

export const addTagToAthlete = async (
  tag: AthleteTagType,
  userId: string,
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  firestore.update(specificUserQuery(userId), {
    ['trainer.athleteStates.' + athleteUserId + '.tags']:
      firebase.firestore.FieldValue.arrayUnion(tag),
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
export const changeTotalAthleteCounters = async (
  userId: string,
  firestore: ExtendedFirestoreInstance,
  reducePath: string,
  reducedAmount: number,
  increasePath?: string,
  increaseAmount?: number,
) => {
  const changeObject = {};
  changeObject[reducePath] = reducedAmount;
  if (increasePath && increaseAmount) {
    changeObject[increasePath] = increaseAmount;
  }
  firestore.update(specificUserQuery(userId), changeObject);
};
export const changeAthleteLatestCheck = async (
  athleteUserId: string,
  firestore: ExtendedFirestoreInstance,
  selectedDailyId: string,
  selectedWeeklyId: string,
) => {
  const pathDaily = 'athlete.training.lastDailyCheckId';
  const pathWeekly = 'athlete.training.lastWeeklyCheckId';
  firestore.update(specificUserQuery(athleteUserId), {
    [pathDaily]: selectedDailyId,
    [pathWeekly]: selectedWeeklyId,
  });
};
