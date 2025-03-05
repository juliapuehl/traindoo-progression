import detectBrowserLanguage from 'detect-browser-language';
import {t} from 'i18n-js';
import _ from 'lodash';
import moment from 'moment';
import {
  ExtendedFirestoreInstance,
  isLoaded,
  ReduxFirestoreQuerySetting,
} from 'react-redux-firebase';
import {RootState} from '../store/store';
import {getSelectedCycleIndex} from '../store/trainingSlice';
import {
  CheckAthleteType,
  CheckCategoryLibrary,
  CheckCategoryTemplate,
} from '../traindoo_shared/types/Check';
import {PublicUserType} from '../traindoo_shared/types/PublicUser';
import {TemplateArrayType, UserType} from '../traindoo_shared/types/User';
import {CheckCategoryType, CheckTemplateType} from '../types/Check';
import {
  DailyCheckLayoutElementsType,
  DailyCheckLayoutType,
  LayoutType,
} from '../types/DashboardLayout';
import {DailyProgressArray} from '../types/UserStorageData';

export const getAuth = (state: RootState) => {
  return state.firebase.auth;
};

export const getUserId = (state: RootState): string | undefined => {
  return state.firebase.auth?.uid;
};

export const getUser = (state: RootState): UserType | undefined => {
  const userId = getUserId(state);
  if (userId) {
    return state.firestore.data.user?.[userId];
  }
  return undefined;
};

export const getUserDocumentVersion = (state: RootState) => {
  return getUser(state)?.documentVersion ?? 0;
};

export const getAthleteIds = (state: RootState): Array<string> => {
  const user = getUser(state);
  if (user?.trainer) {
    return user.trainer.athleteIds;
  } else {
    return [];
  }
};
export const getWebLastUpdateDate = (state: RootState) => {
  return (
    getUser(state)?.webApp?.lastUpdateDate ?? moment(0).utc().toISOString()
  );
};
export const getShowUpdateOverlay = (state: RootState) => {
  const registrationCompleted =
    getRegistrationFlags(state)?.registrationCompleted;
  const lastUpdateDate = getWebLastUpdateDate(state);
  const firestoreUpdateDate = getWebAppInfo(state)?.lastUpdateDate;
  const updateMessageArray = getWebUpdateMessageArray(state);
  if (
    isLoaded(updateMessageArray) &&
    registrationCompleted === true &&
    firestoreUpdateDate &&
    moment(lastUpdateDate).isBefore(firestoreUpdateDate, 's')
  ) {
    return true;
  } else {
    return false;
  }
};
export const getWebUpdateMessageArray = (state: RootState) => {
  const userLang = getUserLang(state);
  return getWebAppInfo(state)?.updateMessageArray?.[userLang] ?? [];
};

export const getRegistrationFlags = (state: RootState) => {
  const user = getUser(state);
  if (user?.trainer) {
    return user.trainer.registrationFlags;
  } else {
    return undefined;
  }
};
export const getPaymentFlags = (state: RootState) => {
  const user = getUser(state);
  if (user?.trainer) {
    return user.trainer.paymentFlags;
  } else {
    return undefined;
  }
};
export const getEnablePayment = (state: RootState) => {
  const user = getUser(state);
  return user?.trainer?.enablePayment ?? false;
};

export const getSelectedAthlete = (state: RootState): UserType => {
  //@ts-expect-error works fine :)
  // TODO: fix type error
  return state.firestore.data.selectedAthlete;
};

export const getSpecificDailyCheck = (
  state: RootState,
  checkId: string,
): CheckAthleteType => {
  return state.firestore.data['dailyCheck-' + checkId];
};
export const getSpecificTrainingWeeklyCheck = (
  state: RootState,
  trainingId: string,
): CheckAthleteType => {
  return state.firestore.data['trainingWeeklyCheck-' + trainingId];
};
export const getTrainingDailyCheckArray = (
  state: RootState,
  trainingId: string,
): CheckAthleteType[] => {
  const checks = state.firestore.data['trainingDailyCheckArray-' + trainingId];
  return checks ? Object.values(checks) : [];
};

export const getDayTemplatesArray = (
  state: RootState,
): Array<TemplateArrayType> | undefined => {
  const user = getUser(state);
  if (user?.trainer) {
    return user.trainer.dayTemplatesArray;
  }
  return undefined;
};
export const getWeekTemplatesArray = (
  state: RootState,
): Array<TemplateArrayType> | undefined => {
  const user = getUser(state);
  if (user?.trainer) {
    return user.trainer.weekTemplatesArray;
  }
  return undefined;
};

export const getCycleTemplates = (state: RootState): TemplateArrayType[] => {
  const user = getUser(state);
  if (user?.trainer?.cycleTemplatesArray) {
    return user.trainer.cycleTemplatesArray;
  }
  return [];
};

export const getCycleTemplateNames = (state: RootState): Array<string> => {
  const user = getUser(state);
  if (user?.trainer?.cycleTemplatesArray) {
    return user.trainer.cycleTemplatesArray.map((entry) => entry.name);
  }
  return [];
};

export const getCurrentCycleTrainings = (state: RootState) => {
  const currentCycle = getSelectedCycleIndex(state);
  return getSpecificCycleTrainings(state, currentCycle);
};

export const getSpecificCycleTrainings = (state: RootState, cycle: number) => {
  const allTrainings = getAllTrainings(state);
  if (allTrainings) {
    return allTrainings
      .filter((training) => training.trainingCycle === cycle)
      .sort((a, b) => a.trainingWeek - b.trainingWeek);
  } else {
    return undefined;
  }
};

export const getDailyCheckNames = (state: RootState) => {
  const dailyCheckArrayOld = getDailyCheckArray(state);
  if (dailyCheckArrayOld.length > 0) {
    const dailyCheckArray = _.cloneDeep(dailyCheckArrayOld);
    return dailyCheckArray
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .map((entry) => entry.name);
  } else {
    return [];
  }
};

export const getDailyCheckArray = (state: RootState) => {
  const user = getPublicUserProfile(state);
  if (user?.trainer?.dailyCheckInfo?.dailyCheckArray) {
    return user?.trainer?.dailyCheckInfo?.dailyCheckArray;
  } else {
    return [];
  }
};
export const getWeeklyCheckNames = (state: RootState) => {
  const dailyCheckArrayOld = getWeeklyCheckArray(state);
  if (dailyCheckArrayOld.length > 0) {
    const dailyCheckArray = _.cloneDeep(dailyCheckArrayOld);
    return dailyCheckArray
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .map((entry) => entry.name);
  } else {
    return [];
  }
};

export const getWeeklyCheckArray = (state: RootState) => {
  const user = getPublicUserProfile(state);
  if (user?.trainer?.weeklyCheckInfo?.weeklyCheckArray) {
    return user?.trainer?.weeklyCheckInfo?.weeklyCheckArray;
  } else {
    return [];
  }
};
export const getGenericCheckNames = (state: RootState) => {
  const dailyCheckArrayOld = getGenericCheckArray(state);
  if (dailyCheckArrayOld.length > 0) {
    const dailyCheckArray = _.cloneDeep(dailyCheckArrayOld);
    return dailyCheckArray
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .map((entry) => entry.name);
  } else {
    return [];
  }
};

export const getGenericCheckArray = (state: RootState) => {
  const user = getPublicUserProfile(state);
  if (user?.trainer?.weeklyCheckInfo?.weeklyCheckArray) {
    return user?.trainer?.weeklyCheckInfo?.weeklyCheckArray;
  } else {
    return [];
  }
};

export const getLastDailyCheckId = (state: RootState) => {
  const athlete = getSelectedAthlete(state);
  const userDailyCheckArray = getDailyCheckArray(state);
  if (athlete?.athlete?.training?.lastDailyCheckId) {
    return athlete?.athlete?.training?.lastDailyCheckId;
  } else if (userDailyCheckArray.length > 0) {
    return userDailyCheckArray[0].id;
  } else {
    return undefined;
  }
};
export const getLastWeeklyCheckId = (state: RootState) => {
  const athlete = getSelectedAthlete(state);
  const userDailyCheckArray = getWeeklyCheckArray(state);
  if (athlete?.athlete?.training?.lastWeeklyCheckId) {
    return athlete?.athlete?.training?.lastWeeklyCheckId;
  } else if (userDailyCheckArray.length > 0) {
    return userDailyCheckArray[0].id;
  } else {
    return undefined;
  }
};

export const getLastTraining = (state: RootState) => {
  const trainings = getAllTrainings(state);
  if (trainings && trainings.length > 0) {
    return trainings[trainings.length - 1];
  }
  return null;
};
export const getSecondLastTraining = (state: RootState) => {
  const trainings = getAllTrainings(state);
  if (trainings && trainings.length > 1) {
    return trainings[trainings.length - 2];
  }
  return null;
};

export const getLastCycleTraining = (state: RootState) => {
  const currentCycle = getSelectedCycleIndex(state);
  if (currentCycle > 1) {
    const cycleTrainings = getSpecificCycleTrainings(state, currentCycle - 1);
    if (cycleTrainings && cycleTrainings.length > 0) {
      return cycleTrainings.sort((a, b) => a.trainingWeek - b.trainingWeek)[
        cycleTrainings.length - 1
      ];
    }
  }
  return undefined;
};

export const getAllTrainings = (state: RootState) => {
  // @ts-ignore
  const allTrainings = state.firestore.ordered?.allTrainings;

  if (allTrainings) {
    return allTrainings.slice().reverse();
  } else {
    return [];
  }
};

export const getNavigatePayment = (state: RootState) => {
  const paymentFlags = getPaymentFlags(state);
  const enablePayment = getEnablePayment(state);
  if (
    enablePayment &&
    (paymentFlags?.subscriptionSetupCompleted !== true ||
      (paymentFlags?.customer.subscription.cancelled_at_period_end === true &&
        moment(paymentFlags?.customer.subscription.cancel_at).diff(moment()) <=
          0) ||
      paymentFlags?.payment_intent?.status === 'requires_payment_method')
  ) {
    return true;
  }
  return false;
};

export const getCurrentCycleTrainingsLength = (state: RootState) => {
  const cycleIndex = getSelectedCycleIndex(state);
  return getSpecificCycleTrainingsLength(state, cycleIndex);
};

export const getSpecificCycleTrainingsLength = (
  state: RootState,
  cycle: number,
) => {
  const trainings = getSpecificCycleTrainings(state, cycle);
  if (trainings) {
    return trainings.length;
  } else {
    return 0;
  }
};

export const getLastTrainingWeekNumber = (state: RootState) => {
  const lastTraining = getLastTraining(state);
  if (lastTraining) {
    return lastTraining.trainingWeek;
  } else {
    return 0;
  }
};
export const getLastTrainingCycle = (state: RootState) => {
  const lastTraining = getLastTraining(state);
  if (lastTraining) {
    return lastTraining.trainingCycle;
  } else {
    return 0;
  }
};

export const getStartDateLastPlan = (state: RootState) => {
  return getLastTraining(state)?.trainingDays?.['day0']?.date;
};
export const getEndDateLastPlan = (state: RootState) => {
  return getLastTraining(state)?.trainingDays?.['day6']?.date;
};

export const getUserFirstName = (state: RootState) => {
  const user = getUser(state);
  if (user) {
    return user.firstName;
  }
  return undefined;
};
export const getUserLastName = (state: RootState) => {
  const user = getUser(state);
  if (user) {
    return user.lastName;
  }
  return undefined;
};
export const getUserBusinessName = (state: RootState) => {
  return getUser(state)?.trainer?.businessName ?? '';
};
export const getTrainerProfilePicture = (state: RootState) => {
  return getUser(state)?.trainer?.profilePicture;
};

export const getTrainerCode = (state: RootState) => {
  const user = getUser(state);
  if (user?.trainer) {
    return user.trainer.code;
  }
  return undefined;
};
export const getUserLang = (state: RootState) => {
  const user = getUser(state);
  if (user?.trainer?.settings?.webLang) {
    return user.trainer?.settings?.webLang;
  } else {
    return detectBrowserLanguage();
  }
};

export const getDontWarnSaveSet = (state: RootState) => {
  return getUser(state)?.trainer?.webSettings?.dontWarnSaveSet ?? false;
};

export const getDontShowEditAthleteValuesWarning = (state: RootState) => {
  return (
    getUser(state)?.trainer?.webSettings?.dontShowEditAthleteValuesWarning ??
    false
  );
};
export const getUserDateFormat = (state: RootState) => {
  const user = getUser(state);
  if (user?.trainer?.settings?.dateFormat) {
    return user.trainer?.settings?.dateFormat;
  } else {
    return detectBrowserLanguage();
  }
};
export const getWeeklyNotificationSetting = (state: RootState) => {
  const setting =
    getUser(state)?.trainer?.settings?.notificationOptions?.weeklyMail;
  if (setting !== undefined) {
    return setting;
  } else {
    return true;
  }
};
export const getTrainerTags = (state: RootState) => {
  return getUser(state)?.trainer?.athleteTags;
};

export const getTrainerTagNames = (state: RootState) => {
  const tags = getUser(state)?.trainer?.athleteTags;
  if (tags) {
    return tags.map((tag) => tag.title);
  } else {
    return [];
  }
};

export const getAthleteStates = (state: RootState) => {
  return getUser(state)?.trainer?.athleteStates;
};

export const getAthleteTags = (state: RootState, athleteUserId: string) => {
  const athleteStates = getAthleteStates(state);
  if (athleteStates) {
    return athleteStates[athleteUserId]?.tags ?? [];
  } else {
    return [];
  }
};

export const getAthleteTagNames = (state: RootState, athleteUserId: string) => {
  const tags = getAthleteTags(state, athleteUserId);
  if (tags) {
    return tags.map((tag) => tag.title);
  } else {
    return [];
  }
};

export const getUnusedTags = (state: RootState, athleteUserId: string) => {
  const trainerTagNames = getTrainerTags(state);
  const athleteTagNames = getAthleteTags(state, athleteUserId);
  if (trainerTagNames && athleteTagNames) {
    return trainerTagNames.filter((x) => {
      return !Object.values(athleteTagNames)
        .map((element) => element.title)
        .includes(x.title);
    });
  } else {
    return trainerTagNames ?? [];
  }
};

export const getAthleteState = (state: RootState, athleteUserId: string) => {
  const athleteStates = getUser(state)?.trainer?.athleteStates;
  if (athleteStates) {
    return athleteStates[athleteUserId]?.currentState ?? 'active';
  } else {
    return 'active';
  }
};

export const getAthleteStateChangeIndex = (
  state: RootState,
  athleteUserId: string,
) => {
  const athleteStates = getAthleteStates(state);
  if (athleteStates) {
    return athleteStates[athleteUserId]?.stateChanges?.length
      ? athleteStates[athleteUserId]?.stateChanges?.length - 1
      : -1;
  } else {
    return -1;
  }
};

export const getCurrentAthleteDailyProgressImages = (
  state: RootState,
): DailyProgressArray => {
  return state.firestore.data.dailyProgressImages?.data;
};

export const getPublicBusinessName = (state: RootState) => {
  const trainerPublicProfile = state.firestore.data.publicTrainerProfile;
  if (trainerPublicProfile?.trainer) {
    return trainerPublicProfile.trainer.businessName;
  }
  return null;
};

export const getCheckCategoryLibrary = (
  state: RootState,
): CheckCategoryLibrary => {
  // @ts-expect-error firestore data is not typed
  return state.firestore.data.checkCategoryLibrary;
};

export const getCategoryTemplateName = (
  state: RootState,
  categoryId: string,
) => {
  const library = getCheckCategoryLibrary(state);
  return library?.[categoryId]?.name;
};

export const getDailyCheckValueQuestions = (
  state: RootState,
): Array<{categoryId: string; questionId: string; label: string}> => {
  const library = getCheckCategoryLibrary(state);
  if (library) {
    const result = [];
    for (const category of Object.values(library)) {
      if (category.questions) {
        for (const question of Object.values(category.questions)) {
          if (question.type === 'survey' || question.type === 'input') {
            result.push({
              categoryId: category.id,
              questionId: question.id,
              label:
                (category.translated ? t(category.name) : category.name) +
                ' ' +
                (question.translated ? t(question.name) : question.name),
            });
          }
        }
      }
    }

    return result;
  } else {
    return [];
  }
};
export const getDailyCheckTextQuestions = (
  state: RootState,
): Array<{categoryId: string; questionId: string; label: string}> => {
  const library = getCheckCategoryLibrary(state);
  if (library) {
    const result = [];
    for (const category of Object.values(library)) {
      if (category.questions) {
        for (const question of Object.values(category.questions)) {
          if (
            question.type === 'comment' ||
            question.type === 'longText' ||
            question.type === 'buttonSurvey'
          ) {
            result.push({
              categoryId: category.id,
              questionId: question.id,
              label:
                (category.translated ? t(category.name) : category.name) +
                ' ' +
                (question.translated ? t(question.name) : question.name),
            });
          }
        }
      }
    }

    return result;
  } else {
    return [];
  }
};
export const getDailyCheckMediaQuestions = (
  state: RootState,
): Array<{categoryId: string; questionId: string; label: string}> => {
  const library = getCheckCategoryLibrary(state);
  if (library) {
    const result = [];
    for (const category of Object.values(library)) {
      if (category.questions) {
        for (const question of Object.values(category.questions)) {
          if (question.type === 'media') {
            result.push({
              categoryId: category.id,
              questionId: question.id,
              label:
                (category.translated ? t(category.name) : category.name) +
                ' ' +
                (question.translated ? t(question.name) : question.name),
            });
          }
        }
      }
    }

    return result;
  } else {
    return [];
  }
};
export const getCheckSpecificCategory = (
  state: RootState,
  categoryId: string,
): CheckCategoryTemplate | undefined => {
  const categories = getCheckCategoryLibrary(state);
  if (categories) {
    return categories[categoryId];
  }
  return undefined;
};
export const getCheckSpecificQuestion = (
  state: RootState,
  categoryId: string,
  questionId: string,
) => {
  const category = getCheckSpecificCategory(state, categoryId);
  if (category && category.questions) {
    return category.questions[questionId];
  }
  return undefined;
};
export const getIndexNewCheckQuestion = (
  state: RootState,
  categoryId: string,
  type: 'daily' | 'weekly' | 'generic',
) => {
  let questions;
  switch (type) {
    case 'daily':
      questions =
        getDailyCheckTemplate(state)?.categories[categoryId]?.questions;
      break;
    case 'weekly':
      questions =
        getWeeklyCheckTemplate(state)?.categories[categoryId]?.questions;
      break;
    case 'generic':
      questions =
        getGenericCheckTemplate(state)?.categories[categoryId]?.questions;
      break;
  }
  if (questions) {
    return Object.keys(questions).length;
  } else {
    return 0;
  }
};
export const getDailyCheckTemplate = (
  state: RootState,
): undefined | CheckTemplateType => {
  // @ts-expect-error firestore data is not typed
  return state.firestore.data.dailyCheckTemplate;
};
export const getWeeklyCheckTemplate = (
  state: RootState,
): undefined | CheckTemplateType => {
  // @ts-expect-error firestore data is not typed
  return state.firestore.data.weeklyCheckTemplate;
};
export const getGenericCheckTemplate = (
  state: RootState,
): undefined | CheckTemplateType => {
  // @ts-expect-error firestore data is not typed
  return state.firestore.data.genericCheckTemplate;
};
export const getDailyCheckTemplateCategories = (
  state: RootState,
): undefined | {[categoryName: string]: CheckCategoryType} => {
  return getDailyCheckTemplate(state)?.categories;
};
export const getWeeklyCheckTemplateCategories = (
  state: RootState,
): undefined | {[categoryName: string]: CheckCategoryType} => {
  return getWeeklyCheckTemplate(state)?.categories;
};
export const getGenericCheckTemplateCategories = (
  state: RootState,
): undefined | {[categoryName: string]: CheckCategoryType} => {
  return getGenericCheckTemplate(state)?.categories;
};
export const getAmountCategoriesSelectedCheck = (state: RootState): number => {
  const check = getDailyCheckTemplate(state);
  if (check?.categories) {
    return Object.keys(check.categories)?.length;
  }
  return 0;
};
export const getCategoryIdsSelectedDailyCheck = (
  state: RootState,
): string[] => {
  const check = getDailyCheckTemplate(state);
  if (check?.categories) {
    return Object.keys(check.categories);
  }
  return [];
};
export const getCategoryIdsSelectedWeeklyCheck = (
  state: RootState,
): string[] => {
  const check = getWeeklyCheckTemplate(state);
  if (check?.categories) {
    return Object.keys(check.categories);
  }
  return [];
};
export const getCategoryIdsSelectedGenericCheck = (
  state: RootState,
): string[] => {
  const check = getGenericCheckTemplate(state);
  if (check?.categories) {
    return Object.keys(check.categories);
  }
  return [];
};
export const getCheckCategoryNames = (
  state: RootState,
  showArchived: boolean,
) => {
  const categories = getCheckCategoryLibrary(state);
  return categories
    ? Object.values(categories)
        .filter((element) => {
          if (showArchived) {
            return true;
          } else {
            return !element.archived;
          }
        })
        .map((element) => {
          return {id: element.id, name: element.name};
        })
    : [];
};
export const getUnusedCategoryNamesSelectedCheck = (
  state: RootState,
  showArchived: boolean,
  type: 'daily' | 'weekly' | 'generic',
) => {
  const allCategoryNames = getCheckCategoryNames(state, showArchived);
  let usedCategoryIds;
  switch (type) {
    case 'daily':
      usedCategoryIds = getCategoryIdsSelectedDailyCheck(state);
      break;
    case 'weekly':
      usedCategoryIds = getCategoryIdsSelectedWeeklyCheck(state);
      break;
    case 'generic':
      usedCategoryIds = getCategoryIdsSelectedGenericCheck(state);
      break;
  }
  return allCategoryNames
    ?.filter((element) => !usedCategoryIds?.includes(element.id))
    .map((element) => {
      return {id: element.id, name: element.name};
    });
};

export const getCategoryQuestionIds = (
  state: RootState,
  categoryId: string,
  showArchived: boolean,
) => {
  const questions = getCheckCategoryLibrary(state)[categoryId]?.questions;
  if (questions) {
    return questions
      ? Object.values(questions)
          .filter((element) => {
            if (showArchived) {
              return true;
            } else {
              return !element.archived;
            }
          })
          .map((element) => {
            return element.id;
          })
      : [];
  } else {
    return [];
  }
};
export const getCategoryQuestionNames = (
  state: RootState,
  categoryId: string,
  showArchived: boolean,
) => {
  const questions = getCheckCategoryLibrary(state)[categoryId]?.questions;
  if (questions) {
    return questions
      ? Object.values(questions)
          .filter((element) => {
            if (showArchived) {
              return true;
            } else {
              return !element.archived;
            }
          })
          .map((element) => {
            return element.name;
          })
      : [];
  } else {
    return [];
  }
};

export const getCategoryUsedQuestions = (
  state: RootState,
  categoryName: string,
  type: 'daily' | 'weekly' | 'generic',
) => {
  let getterFunction;
  switch (type) {
    case 'daily':
      getterFunction = getDailyUsedQuestionArray;
      break;
    case 'weekly':
      getterFunction = getWeeklyUsedQuestionArray;
      break;
    case 'generic':
      getterFunction = getGenericUsedQuestionArray;
      break;
  }

  return getterFunction(state, categoryName)?.map((element) => {
    return element.id;
  });
};

export const getDailyUsedQuestionArray = (
  state: RootState,
  categoryName: string,
) => {
  const questions =
    getDailyCheckTemplate(state)?.categories[categoryName]?.questions;
  return questions ? Object.values(questions) : [];
};
export const getWeeklyUsedQuestionArray = (
  state: RootState,
  categoryName: string,
) => {
  const questions =
    getWeeklyCheckTemplate(state)?.categories[categoryName]?.questions;
  return questions ? Object.values(questions) : [];
};
export const getGenericUsedQuestionArray = (
  state: RootState,
  categoryName: string,
) => {
  const questions =
    getGenericCheckTemplate(state).categories[categoryName]?.questions;
  return questions ? Object.values(questions) : [];
};

export const getUnusedQuestionsSelectedCategory = (
  state: RootState,
  categoryId: string,
  showArchived: boolean,
  type: 'daily' | 'weekly' | 'generic',
) => {
  const allQuestionIds = getCategoryQuestionIds(
    state,
    categoryId,
    showArchived,
  );
  const usedQuestions = getCategoryUsedQuestions(state, categoryId, type);
  if (usedQuestions) {
    return allQuestionIds?.filter(
      (element) => !usedQuestions?.includes(element),
    );
  } else {
    return allQuestionIds;
  }
};

export const getLegalInfo = (state: RootState) => {
  // @ts-expect-error firestore data is not typed
  return state.firestore.data.legal;
};
export const getWebAppInfo = (state: RootState) => {
  // @ts-expect-error firestore data is not typed
  return state.firestore.data.webApp;
};
export const getProgressionToolUnlockedUsers = (state: RootState) => {
  // @ts-expect-error firestore data is not typed
  return state.firestore.data.progressionTool?.unlockedUsers;
};
export const getProgressionUserIsUnlocked = (state: RootState) => {
  const userId = getUserId(state);
  const unlockedUsers = getProgressionToolUnlockedUsers(state) ?? [];
  return unlockedUsers.includes(userId);
};

export const getConsentExpired = (state: RootState) => {
  const user = getUser(state);
  const privacyPolicyExpired = getPrivacyPolicyExpired(state);
  const termsAndConditionsExpired = getTermsAndConditionsExpired(state);
  const trainerAVVMissing = !user?.trainer?.trainerAVV?.changeDate;
  if (!user || !user?.trainer?.registrationFlags?.registrationCompleted) {
    return false;
  }
  return privacyPolicyExpired || termsAndConditionsExpired || trainerAVVMissing;
};
export const getPrivacyPolicyExpired = (state: RootState) => {
  const user = getUser(state);
  const legal = getLegalInfo(state);
  return (
    user?.trainer?.consent?.privacyPolicy?.changeDate === undefined ||
    (legal?.privacyPolicyWeb?.changeDate &&
      legal?.privacyPolicyWeb?.changeDate >
        user?.trainer?.consent?.privacyPolicy?.changeDate)
  );
};
export const getTermsAndConditionsExpired = (state: RootState) => {
  const user = getUser(state);
  const legal = getLegalInfo(state);
  return (
    user?.trainer?.consent?.termsAndConditions?.changeDate === undefined ||
    (legal?.termsAndConditionsWeb?.changeDate &&
      legal?.termsAndConditionsWeb?.changeDate >
        user?.trainer?.consent?.termsAndConditions?.changeDate)
  );
};

export const getSpecificGraphData = (state: RootState, graphKey: string) => {
  return state.firestore.data[graphKey];
};
export const getPublicUserProfile = (state: RootState): PublicUserType => {
  // @ts-expect-error firestore data is not typed
  return state.firestore.data.publicProfile;
};

export const getDailyDashboardInformation = (
  state: RootState,
): DailyCheckLayoutType | undefined => {
  // @ts-expect-error firestore data is not typed
  return state.firestore.data.dashboardLayout?.dailyCheckLayout;
};
export const getDailyDashboardElements = (
  state: RootState,
): DailyCheckLayoutElementsType => {
  return getDailyDashboardInformation(state)?.elements ?? {};
};
export const getDailyElementsLength = (state: RootState): number => {
  const elements = getDailyDashboardElements(state);
  if (elements) {
    return Object.keys(elements).length ?? 0;
  }
  return 0;
};
export const getDailyDashboardLayout = (state: RootState): LayoutType => {
  return getDailyDashboardInformation(state)?.layout ?? {};
};
export const getDailyDashboardColorInfo = (state: RootState) => {
  return getDailyDashboardInformation(state)?.questionColors ?? {};
};

export const getAllAthletes = (state: RootState) => {
  let result = [];
  let index = 0;
  //TODO: fix this
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const data = state?.firestore?.data['athleteArray' + index];
    if (data) {
      result = {...result, ...data};
      index += 1;
    } else {
      break;
    }
  }
  return Object.values(result);
};

export const getAllActiveAthletes = (state: RootState) => {
  return getAllAthletes(state).filter(
    (athlete: UserType) =>
      athlete?.athlete?.trainerInfo?.currentState === 'active',
  );
};

export const getMessageAthlete = (state: RootState) => {
  //@ts-expect-error works fine :)
  // TODO: fix type error
  return state.firestore.data.messageAthlete;
};

export const getMessageAthleteLastLogin = (state: RootState) => {
  return getMessageAthlete(state)?.athlete?.lastLogin;
};
export const getMessageAthleteLastLoginString = (state: RootState) => {
  const lastLogin = getMessageAthlete(state)?.athlete?.lastLogin;
  const lastLoginDateTime = moment(lastLogin).calendar();
  if (lastLoginDateTime.length > 10) {
    const lastLoginShort = lastLoginDateTime.substring(
      0,
      lastLoginDateTime.length - 3,
    );
    return lastLoginShort;
  } else {
    return lastLoginDateTime;
  }
};

export const usersDataQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
  };
};

export const usersDataPublicProfileQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'public', doc: 'profile'}],
    storeAs: 'publicProfile',
  };
};

export const usersExerciseLibraryQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'exerciseLibrary', doc: 'exercises'}],
    storeAs: 'exerciseLibrary',
  };
};

export const addLibraryEntry = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'exerciseLibrary', doc: 'exercises'}],
  };
};

export const currentCycleQuery = (userId: string, currentCycle: number) => {
  // return {
  //   collection: `user/${userId}/training`,
  //   where: ["trainingCycle", "==", 2],
  //   storeAs: "cycleTrainings",
  // } as ReduxFirestoreQuerySetting;
  return {
    collection: 'user',
    doc: userId,
    subcollections: [
      {
        collection: 'training',
        where: ['trainingCycle', '==', currentCycle],
        orderBy: [['startDate', 'asc']],
      },
    ],
    storeAs: 'cycleTrainings',
  } as ReduxFirestoreQuerySetting;
};

export const legalInfoQuery = () => {
  return {
    collection: 'data',
    doc: 'legal',
    storeAs: 'legal',
  } as ReduxFirestoreQuerySetting;
};

export const webAppVersionInfoQuery = () => {
  return {
    collection: 'data',
    doc: 'webApp',
    storeAs: 'webApp',
  } as ReduxFirestoreQuerySetting;
};

export const progressionToolQuery = () => {
  return {
    collection: 'data',
    doc: 'progressionTool',
    storeAs: 'progressionTool',
  } as ReduxFirestoreQuerySetting;
};

export const allTrainingsQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [
      {
        collection: 'training',
        orderBy: [['calendarWeek', 'desc']],
        limit: 50,
      },
    ],
    storeAs: 'allTrainings',
  } as ReduxFirestoreQuerySetting;
};

export const currentAthleteQuery = (athleteUserId: string) => {
  return {
    collection: 'user',
    doc: athleteUserId,
    storeAs: 'selectedAthlete',
  } as ReduxFirestoreQuerySetting;
};

export const messageAthleteQuery = (athleteUserId: string) => {
  return {
    collection: 'user',
    doc: athleteUserId,
    storeAs: 'messageAthlete',
  } as ReduxFirestoreQuerySetting;
};

export const currentAthleteDailyProgressImagesQuery = (
  athleteUserId: string,
) => {
  return {
    collection: 'user',
    doc: athleteUserId,
    subcollections: [
      {collection: 'userStorageData', doc: 'dailyProgressImages'},
    ],
    storeAs: 'dailyProgressImages',
  };
};

export const addTrainingDataQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'training'}],
    storeAs: 'trainingCollection',
  };
};

export const specificTrainingDataQuery = (
  userId: string,
  trainingId: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'training', doc: trainingId}],
    storeAs: 'specificTrainingQuery',
  };
};

export const addDayTemplateQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'dayTemplatesCollection'}],
  };
};

export const specificDayTemplateQuery = (
  userId: string,
  templateId: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'dayTemplatesCollection', doc: templateId}],
    storeAs: 'dayTemplate',
  };
};

export const addWeekTemplateQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'weekTemplatesCollection'}],
  };
};
export const addCycleTemplateQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'cycleTemplatesCollection'}],
  };
};

export const specificCycleTemplateQuery = (
  userId: string,
  templateId: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'cycleTemplatesCollection', doc: templateId}],
    storeAs: 'cycleTemplate',
  };
};

export const specificWeekTemplateQuery = (
  userId: string,
  templateId: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'weekTemplatesCollection', doc: templateId}],
    storeAs: 'weekTemplate',
  };
};

export const specificUserQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
  };
};

export const specificTrainingDataQueryBatch = (
  userId: string,
  trainingId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  return (
    firestore
      //@ts-ignore firebase object wrongly typed
      .collection('user')
      .doc(userId)
      .collection('training')
      .doc(trainingId)
  );
};
export const specificUserQueryBatch = (
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  return (
    firestore
      //@ts-ignore firebase object wrongly typed
      .collection('user')
      .doc(userId)
  );
};

export const addDailyCheckQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'dailyCheckCollection'}],
  };
};
export const addWeeklyCheckQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'weeklyCheckCollection'}],
  };
};
export const addGenericCheckQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'genericCheckCollection'}],
  };
};

export const specificDailyCheckTemplateQuery = (
  userId: string,
  checkId: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'dailyCheckCollection', doc: checkId}],
    storeAs: 'dailyCheckTemplate',
  };
};
export const specificWeeklyCheckTemplateQuery = (
  userId: string,
  checkId: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'weeklyCheckCollection', doc: checkId}],
    storeAs: 'weeklyCheckTemplate',
  };
};

export const specificGenericCheckTemplateQuery = (
  userId: string,
  checkId: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'genericCheckCollection', doc: checkId}],
    storeAs: 'genericCheckTemplate',
  };
};

export const specificDailyCheckQuery = (userId: string, checkId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'dailyCheck', doc: checkId}],
    storeAs: 'dailyCheck-' + checkId,
  };
};
export const specificWeeklyCheckQuery = (
  userId: string,
  checkId: string,
  trainingId: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'weeklyCheck', doc: checkId}],
    storeAs: 'trainingWeeklyCheck-' + trainingId,
  };
};
export const specificTrainingDailyCheckQuery = (
  userId: string,
  trainingId: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [
      {
        collection: 'dailyCheck',
        where: ['trainingId', '==', trainingId],
        orderBy: ['date', 'asc'],
      },
    ],
    storeAs: 'trainingDailyCheckArray-' + trainingId,
  } as ReduxFirestoreQuerySetting;
};

export const checkCategoryLibraryQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'checkCategoryLibrary', doc: 'categories'}],
    storeAs: 'checkCategoryLibrary',
  };
};

export const addCheckCategoryLibrary = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [{collection: 'checkCategoryLibrary', doc: 'categories'}],
  };
};

export const checkValueDocumentQuery = (userId: string, questionId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [
      {
        collection: 'checkValues',
        doc: questionId,
      },
    ],
  };
};

export const checkValueMultipleDocumentQuery = (
  userId: string,
  documentIds: string[],
  name: string,
) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [
      {
        collection: 'checkValues',
        where: ['id', 'in', documentIds],
      },
    ],
    storeAs: name,
  } as ReduxFirestoreQuerySetting;
};

export const multipleAthleteIdQuery = (
  userId: string,
  athelteIds: string[],
  index: number,
) => {
  return {
    collection: 'user',
    where: ['id', 'in', athelteIds],
    storeAs: 'athleteArray' + index,
  } as ReduxFirestoreQuerySetting;
};

export const webSettingsLayoutQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [
      {
        collection: 'webSettings',
        doc: 'dashboardLayout',
      },
    ],
    storeAs: 'dashboardLayout',
  } as ReduxFirestoreQuerySetting;
};

export const lastMessagesQuery = (userId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [
      {
        collection: 'messages',
        doc: 'lastMessages',
      },
    ],
    storeAs: 'lastMessages',
  } as ReduxFirestoreQuerySetting;
};

export const specificChatMessageQuery = (userId: string, messageId: string) => {
  return {
    collection: 'user',
    doc: userId,
    subcollections: [
      {
        collection: 'messages',
        doc: messageId,
      },
    ],
  } as ReduxFirestoreQuerySetting;
};
