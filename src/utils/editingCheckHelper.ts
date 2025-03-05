import firebase from 'firebase/app';
import moment from 'moment';
import {ExtendedFirestoreInstance} from 'react-redux-firebase';
import {
  addDailyCheckQuery,
  addGenericCheckQuery,
  addWeeklyCheckQuery,
  checkCategoryLibraryQuery,
  specificDailyCheckTemplateQuery,
  specificGenericCheckTemplateQuery,
  specificWeeklyCheckTemplateQuery,
  usersDataPublicProfileQuery,
} from '../logic/firestore';
import {
  CheckAthleteType,
  CheckCategoryLibrary,
  CheckQuestionAthleteType,
  CheckQuestionTemplate,
} from '../traindoo_shared/types/Check';
import {CheckType} from '../traindoo_shared/types/Training';
import {ImageUrlType} from '../traindoo_shared/types/UserStorageData';
import {
  CheckImageValueDocumentType,
  CheckValueDocumentType,
} from '../types/CheckValues';
import {calculateCalories, capitalizeFirstLetter} from './helper';

export const fixBrokenProgressImages = async (
  athleteIds: string[],
  firestore: ExtendedFirestoreInstance,
) => {
  const start = moment();
  //@ts-ignore firebase object wrongly typed
  for (let athleteIndex = 0; athleteIndex < athleteIds.length; athleteIndex++) {
    const athleteId = athleteIds[athleteIndex];
    generateProgressImages(athleteId, firestore);
  }
  const end = moment();
  console.log(end.diff(start, 'seconds'));
};

const generateProgressImages = async (
  athleteId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const trainingData = await firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(athleteId)
    .collection('training')
    .get();
  //const data = result.data();

  const trainings = trainingData.docs.map((element) => element.data());
  //@ts-ignore firebase object wrongly typed
  const batch = firestore.batch();
  const changeObject: {
    [key: string]: CheckValueDocumentType | CheckImageValueDocumentType;
  } = {};
  if (trainings) {
    for (const trainingElement of trainings) {
      if (trainingElement.trainingDays) {
        for (const dayKey of Object.keys(trainingElement.trainingDays)) {
          const day = trainingElement.trainingDays[dayKey];
          const dailyProgressImages = day.dailyProgressImages;
          const checkId = moment(day.date).format('YYYY-MM-DD');
          if (dailyProgressImages) {
            const addImageToChangeObject = (
              valueId: string,
              data: ImageUrlType,
            ) => {
              changeObject[valueId] = {
                id: valueId,
                questionId: valueId,
                categoryId: 'ProgressImages',
                values: {
                  ...(changeObject[valueId]?.values as {
                    [id: string]: {
                      checkId: string;
                      date: string;
                      value: ImageUrlType;
                    };
                  }),
                  [checkId]: {
                    checkId: checkId,
                    date: day.date,
                    value: {
                      fileName: data.fileName,
                      url: data.url,
                      uploadTime: data.uploadTime,
                    },
                  },
                },
              };
            };
            if (dailyProgressImages.frontImage) {
              addImageToChangeObject('Front', dailyProgressImages.frontImage);
            }
            if (dailyProgressImages.backImage) {
              addImageToChangeObject('Back', dailyProgressImages.backImage);
            }
            if (dailyProgressImages.sideImage) {
              addImageToChangeObject('Side', dailyProgressImages.sideImage);
            }
            if (dailyProgressImages.additionalImage) {
              addImageToChangeObject(
                'Additional',
                dailyProgressImages.additionalImage,
              );
            }
          }
        }
      }
    }
  }
  for (const key in changeObject) {
    const element = changeObject[key];
    batch.set(
      firestore
        //@ts-ignore firebase object wrongly typed
        .collection('user')
        .doc(athleteId)
        .collection('checkValues')
        .doc(element.id),
      element,
      {merge: true},
    );
  }
  batch.commit();
};

export const generateOldChecks = async (
  athleteIds: string[],
  firestore: ExtendedFirestoreInstance,
  categoryLibrary: CheckCategoryLibrary,
  getValueBackend: (value: string | number, unitId: string) => string | number,
) => {
  const start = moment();
  //@ts-ignore firebase object wrongly typed
  for (let athleteIndex = 0; athleteIndex < athleteIds.length; athleteIndex++) {
    const athleteId = athleteIds[athleteIndex];
    generateOldChecksAthlete(
      athleteId,
      firestore,
      categoryLibrary,
      getValueBackend,
    );
  }
  const end = moment();
  console.log(end.diff(start, 'seconds'));
};

const generateOldChecksAthlete = async (
  athleteId: string,
  firestore: ExtendedFirestoreInstance,
  categoryLibrary: CheckCategoryLibrary,
  getValueBackend: (value: string | number, unitId: string) => string | number,
) => {
  const trainingData = await firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(athleteId)
    .collection('training')
    .get();
  //const data = result.data();

  const trainings = trainingData.docs.map((element) => element.data());
  //@ts-ignore firebase object wrongly typed
  const batch = firestore.batch();
  const changeObject: {
    [key: string]: CheckValueDocumentType | CheckImageValueDocumentType;
  } = {};
  if (trainings) {
    for (const trainingElement of trainings) {
      const weeklyCheck = trainingElement.weeklyCheck as CheckType[];
      const weeklyFeedback = trainingElement.athleteFeedback;

      if (trainingElement.trainingDays) {
        for (const dayKey of Object.keys(trainingElement.trainingDays)) {
          const day = trainingElement.trainingDays[dayKey];
          const dailyCheck = day.dailyCheck;
          const dailyAthleteRemark = day.dailyAthleteRemark;
          const dailyProgressImages = day.dailyProgressImages;
          const checkId = moment(day.date).format('YYYY-MM-DD');
          if (dailyCheck) {
            for (const category of dailyCheck) {
              for (const question of category.question) {
                const data = question.athlete;
                if (
                  data &&
                  data.value &&
                  (isNaN(parseFloat(String(data.value))) || data.value > -1)
                ) {
                  const valueId = capitalizeFirstLetter(data.id);
                  const unitId =
                    categoryLibrary[category.category]?.questions[valueId]
                      ?.unit;
                  const valueBackend = getValueBackend(data.value, unitId);
                  changeObject[valueId] = {
                    id: valueId,
                    categoryId: category.category,
                    questionId: valueId,
                    values: {
                      ...(changeObject[valueId]?.values as {
                        [id: string]: {
                          checkId: string;
                          date: string;
                          value: string | number;
                        };
                      }),
                      [checkId]: {
                        checkId: checkId,
                        date: day.date,
                        value: valueBackend,
                      },
                    },
                  };
                }
              }
            }
          }
          if (dailyAthleteRemark) {
            const valueId = 'AthleteRemark';
            changeObject[valueId] = {
              id: valueId,
              categoryId: 'General',
              questionId: valueId,
              values: {
                ...(changeObject[valueId]?.values as {
                  [id: string]: {
                    checkId: string;
                    date: string;
                    value: string | number;
                  };
                }),
                [checkId]: {
                  checkId: checkId,
                  date: day.date,
                  value: dailyAthleteRemark,
                },
              },
            };
          }
          if (dailyProgressImages) {
            const addImageToChangeObject = (
              valueId: string,
              data: ImageUrlType,
            ) => {
              changeObject[valueId] = {
                id: valueId,
                questionId: valueId,
                categoryId: 'ProgressImages',
                values: {
                  ...(changeObject[valueId]?.values as {
                    [id: string]: {
                      checkId: string;
                      date: string;
                      value: ImageUrlType;
                    };
                  }),
                  [checkId]: {
                    checkId: checkId,
                    date: day.date,
                    value: {
                      fileName: data.fileName,
                      url: data.url,
                      uploadTime: data.uploadTime,
                    },
                  },
                },
              };
            };
            if (dailyProgressImages.frontImage) {
              addImageToChangeObject('Front', dailyProgressImages.frontImage);
            }
            if (dailyProgressImages.backImage) {
              addImageToChangeObject('Back', dailyProgressImages.backImage);
            }
            if (dailyProgressImages.sideImage) {
              addImageToChangeObject('Side', dailyProgressImages.sideImage);
            }
            if (dailyProgressImages.additionalImage) {
              addImageToChangeObject(
                'Additional',
                dailyProgressImages.additionalImage,
              );
            }
          }
        }
      }
      if (weeklyCheck) {
        const checkId = moment(trainingElement.startDate).format('YYYY-MM-DD');

        for (const category of weeklyCheck) {
          for (const question of category.question) {
            const data = question.athlete;
            if (
              data &&
              data.value &&
              (isNaN(parseFloat(String(data.value))) || data.value > -1)
            ) {
              const valueId = capitalizeFirstLetter(data.id);
              const unitId =
                categoryLibrary[category.category]?.questions[valueId]?.unit;
              const valueBackend = getValueBackend(data.value, unitId);
              changeObject[valueId] = {
                id: valueId,
                categoryId: category.category,
                questionId: valueId,
                values: {
                  ...(changeObject[valueId]?.values as {
                    [id: string]: {
                      checkId: string;
                      date: string;
                      value: string | number;
                    };
                  }),
                  [checkId]: {
                    checkId: checkId,
                    date: trainingElement.startDate,
                    value: valueBackend,
                  },
                },
              };
            }
          }
        }
      }
      if (weeklyFeedback) {
        const checkId = moment(trainingElement.startDate).format('YYYY-MM-DD');
        const valueId = 'WeeklyRemark';
        changeObject[valueId] = {
          id: valueId,
          categoryId: 'General',
          questionId: valueId,
          values: {
            ...(changeObject[valueId]?.values as {
              [id: string]: {
                checkId: string;
                date: string;
                value: string | number;
              };
            }),
            [checkId]: {
              checkId: checkId,
              date: trainingElement.startDate,
              value: weeklyFeedback,
            },
          },
        };
      }
    }
  }
  for (const key in changeObject) {
    const element = changeObject[key];
    batch.set(
      firestore
        //@ts-ignore firebase object wrongly typed
        .collection('user')
        .doc(athleteId)
        .collection('checkValues')
        .doc(element.id),
      element,
      {merge: true},
    );
  }
  batch.commit();
};

export const createNewDailyCheck = async (
  checkName: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const doc = await firestore.add(addDailyCheckQuery(userId), {
    name: checkName,
    notEditable: false,
    categories: {},
  });
  await firestore.set(
    specificDailyCheckTemplateQuery(userId, doc.id),
    {id: doc.id},
    {merge: true},
  );
  const path = 'trainer.dailyCheckInfo.dailyCheckArray';
  await firestore.update(usersDataPublicProfileQuery(userId), {
    [path]: firebase.firestore.FieldValue.arrayUnion({
      id: doc.id,
      name: checkName,
    }),
  });
  return doc.id;
};

export const createNewWeeklyCheck = async (
  checkName: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const doc = await firestore.add(addWeeklyCheckQuery(userId), {
    name: checkName,
    notEditable: false,
    categories: {},
  });
  await firestore.set(
    specificWeeklyCheckTemplateQuery(userId, doc.id),
    {id: doc.id},
    {merge: true},
  );
  const path = 'trainer.weeklyCheckInfo.weeklyCheckArray';
  await firestore.update(usersDataPublicProfileQuery(userId), {
    [path]: firebase.firestore.FieldValue.arrayUnion({
      id: doc.id,
      name: checkName,
    }),
  });
  return doc.id;
};

export const createNewGenericCheck = async (
  checkName: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const doc = await firestore.add(addGenericCheckQuery(userId), {
    name: checkName,
    notEditable: false,
    categories: {},
  });
  await firestore.set(
    specificGenericCheckTemplateQuery(userId, doc.id),
    {id: doc.id},
    {merge: true},
  );
  const path = 'trainer.genericCheckInfo.genericCheckArray';
  await firestore.update(usersDataPublicProfileQuery(userId), {
    [path]: firebase.firestore.FieldValue.arrayUnion({
      id: doc.id,
      name: checkName,
    }),
  });
  return doc.id;
};

export const deleteDailyCheck = async (
  checkName: string,
  checkId: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
  type: 'daily' | 'weekly' | 'generic',
) => {
  let templateQuery;
  let arrayPath;
  switch (type) {
    case 'daily':
      templateQuery = specificDailyCheckTemplateQuery;
      arrayPath = 'trainer.dailyCheckInfo.dailyCheckArray';
      break;
    case 'weekly':
      templateQuery = specificWeeklyCheckTemplateQuery;
      arrayPath = 'trainer.weeklyCheckInfo.weeklyCheckArray';
      break;
    case 'generic':
      templateQuery = specificGenericCheckTemplateQuery;
      arrayPath = 'trainer.genericCheckInfo.genericCheckArray';
      break;
  }
  await firestore.delete(templateQuery(userId, checkId));
  await firestore.update(usersDataPublicProfileQuery(userId), {
    [arrayPath]: firebase.firestore.FieldValue.arrayRemove({
      id: checkId,
      name: checkName,
    }),
  });
};

export const addDailyCheckTrainerValue = async (
  checkId: string,
  categoryId: string,
  questionId: string,
  questionIndex: number,
  trainerValue: string,
  getValueBackend: (value: string | number, unit: string) => number | string,
  athleteId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const checkRef = firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(athleteId)
    .collection('dailyCheck')
    .doc(checkId);
  firestore.runTransaction(async (transaction) => {
    const changeObject: {[path: string]: string | number} = {
      ['categories.' +
      categoryId +
      '.questions.' +
      questionId +
      '.trainerValue']: trainerValue,
    };
    if (categoryId === 'Nutrition' && questionId !== 'Calories') {
      const checkSnapShot = await transaction.get(checkRef);
      const calories = calculateCalories(
        checkSnapShot.data().categories.Nutrition.questions.Carbohydrates
          ?.trainerValue,
        checkSnapShot.data().categories.Nutrition.questions.Fats?.trainerValue,
        checkSnapShot.data().categories.Nutrition.questions.Proteins
          ?.trainerValue,
        trainerValue,
        questionIndex,
      );
      changeObject['categories.Nutrition.questions.Calories.trainerValue'] =
        getValueBackend(calories, 'kcal');
    }
    transaction.update(
      firestore
        //@ts-ignore firebase object wrongly typed
        .collection('user')
        .doc(athleteId)
        .collection('dailyCheck')
        .doc(checkId),
      changeObject,
    );
  });
};

export const addDailyCheckTrainingTrainerValue = async (
  checkIds: string[],
  categoryId: string,
  questionId: string,
  questionIndex: number,
  trainerValue: string,
  getValueBackend: (value: string | number, unit: string) => number | string,
  athleteId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const checkRef = firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(athleteId)
    .collection('dailyCheck')
    .doc(checkIds[0]);
  firestore.runTransaction(async (transaction) => {
    const changeObject: {[path: string]: string | number} = {
      [`categories.${categoryId}.questions.${questionId}.trainerValue`]:
        trainerValue,
    };
    if (categoryId === 'Nutrition' && questionId !== 'Calories') {
      const checkSnapShot = await transaction.get(checkRef);
      const calories = calculateCalories(
        checkSnapShot.data().categories.Nutrition.questions.Carbohydrates
          ?.trainerValue,
        checkSnapShot.data().categories.Nutrition.questions.Fats?.trainerValue,
        checkSnapShot.data().categories.Nutrition.questions.Proteins
          ?.trainerValue,
        trainerValue,
        questionIndex,
      );
      changeObject['categories.Nutrition.questions.Calories.trainerValue'] =
        getValueBackend(calories, 'kcal');
    }
    checkIds.forEach((checkId) => {
      transaction.update(
        firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(athleteId)
          .collection('dailyCheck')
          .doc(checkId),
        changeObject,
      );
    });
  });
};

export const insertDailyCheckCopyNew = async (
  checkIds: string[],
  checkCopy: CheckAthleteType,
  athleteId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const checkRef = firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(athleteId)
    .collection('dailyCheck')
    .doc(checkIds[0]);
  firestore.runTransaction(async (transaction) => {
    const changeObject = {};
    const checkSnapShot = await transaction.get(checkRef);
    const firstCheckData = checkSnapShot.data() as CheckAthleteType;
    for (const category of Object.values(firstCheckData.categories)) {
      for (const question of Object.values(category.questions)) {
        const value =
          checkCopy.categories[category.id]?.questions[question.id]
            ?.trainerValue;
        if (value !== undefined) {
          changeObject[
            `categories.${category.id}.questions.${question.id}.trainerValue`
          ] = value;
        }
      }
    }

    checkIds.forEach((checkId) => {
      transaction.update(
        firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(athleteId)
          .collection('dailyCheck')
          .doc(checkId),
        changeObject,
      );
    });
  });
};

export const editDefineDailyMakrosNew = async (
  checkIds: string[],
  categoryName: string,
  questions: {[questionId: string]: CheckQuestionAthleteType},
  value: boolean,
  athleteId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  //@ts-ignore firebase object wrongly typed
  const batch = firestore.batch();
  checkIds.forEach((checkId) => {
    const changeObject: {[path: string]: string | boolean} = {
      [`categories.${categoryName}.defineDaily`]: value,
    };
    if (value === false && questions) {
      Object.keys(questions).forEach((questionKey) => {
        if (questions[questionKey].trainerValue !== undefined) {
          changeObject[
            `categories.${categoryName}.questions.${questionKey}.trainerValue`
          ] = questions[questionKey].trainerValue;
        }
      });
    }
    batch.update(
      firestore
        //@ts-ignore firebase object wrongly typed
        .collection('user')
        .doc(athleteId)
        .collection('dailyCheck')
        .doc(checkId),
      changeObject,
    );
  });
  batch.commit();
};

// CheckCategoryLibrary

export const addCheckCategoryLibrary = async (
  categoryName: string,
  categoryId: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  await firestore.set(
    checkCategoryLibraryQuery(userId),
    {
      [categoryId]: {name: categoryName, id: categoryId},
    },
    {
      merge: true,
    },
  );
};

export const addCheckQuestionToCategoryLibrary = async (
  categoryId: string,
  question: CheckQuestionTemplate,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  await firestore.update(checkCategoryLibraryQuery(userId), {
    [categoryId + '.questions.' + question.id]: question,
  });
};

export const deleteCategoryFromLibrary = (
  categoryId: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const libraryRef = firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(userId)
    .collection('checkCategoryLibrary')
    .doc('categories');
  firestore.runTransaction(async (transaction) => {
    const libraryData = (await transaction.get(libraryRef)).data();
    const dailyCheckIds = libraryData[categoryId].usedIn?.daily ?? [];
    const weeklyCheckIds = libraryData[categoryId].usedIn?.weekly ?? [];
    const genericCheckIds = libraryData[categoryId].usedIn?.generic ?? [];
    for (const checkId of dailyCheckIds) {
      transaction.update(
        firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(userId)
          .collection('dailyCheckCollection')
          .doc(checkId),
        {
          ['categories.' + categoryId]: firebase.firestore.FieldValue.delete(),
        },
      );
    }
    for (const checkId of weeklyCheckIds) {
      transaction.update(
        firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(userId)
          .collection('weeklyCheckCollection')
          .doc(checkId),
        {
          ['categories.' + categoryId]: firebase.firestore.FieldValue.delete(),
        },
      );
    }
    for (const checkId of genericCheckIds) {
      transaction.update(
        firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(userId)
          .collection('genericCheckCollection')
          .doc(checkId),
        {
          ['categories.' + categoryId]: firebase.firestore.FieldValue.delete(),
        },
      );
    }
    transaction.update(libraryRef, {
      [categoryId + '.archived']: true,
    });
  });
};

export const deleteQuestionFromLibrary = (
  categoryId: string,
  questionId: string,
  userId: string,
  firestore: ExtendedFirestoreInstance,
) => {
  const libraryRef = firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(userId)
    .collection('checkCategoryLibrary')
    .doc('categories');
  firestore.runTransaction(async (transaction) => {
    const libraryData = (await transaction.get(libraryRef)).data();
    const dailyCheckIds =
      libraryData[categoryId]?.questions[questionId]?.usedIn?.dailyCheck ?? [];
    const weeklyCheckIds =
      libraryData[categoryId]?.questions[questionId]?.usedIn?.weeklyCheck ?? [];

    for (const checkId of dailyCheckIds) {
      transaction.update(
        firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(userId)
          .collection('dailyCheckCollection')
          .doc(checkId),
        {
          ['categories.' + categoryId + '.questions.' + [questionId]]:
            firebase.firestore.FieldValue.delete(),
        },
      );
    }
    for (const checkId of weeklyCheckIds) {
      transaction.update(
        firestore
          //@ts-ignore firebase object wrongly typed
          .collection('user')
          .doc(userId)
          .collection('weeklyCheckCollection')
          .doc(checkId),
        {
          ['categories.' + categoryId + '.questions.' + [questionId]]:
            firebase.firestore.FieldValue.delete(),
        },
      );
    }
    transaction.update(libraryRef, {
      [categoryId + '.questions.' + [questionId] + '.archived']: true,
    });
  });
};
