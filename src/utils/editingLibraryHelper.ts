import firebase from 'firebase/app';
import {t} from 'i18n-js';
import {cloneDeep, uniqBy} from 'lodash';
import {ExtendedFirestoreInstance} from 'react-redux-firebase';
import {
  addLibraryEntry,
  specificCycleTemplateQuery,
  specificDayTemplateQuery,
  specificTrainingDataQuery,
  specificWeekTemplateQuery,
  usersDataQuery,
} from '../logic/firestore';
import {
  ExerciseLibraryEntryType,
  ExerciseLibraryType,
} from '../traindoo_shared/types/ExerciseLibrary';
import {UserType} from '../traindoo_shared/types/User';
import {firestorePathRegex} from '../types/RegexTemplates';
import {WeekTemplateType} from '../types/Templates';

export const createExerciseLibrary = async (
  user: UserType,
  athleteIds: string[],
  firestore: ExtendedFirestoreInstance,
) => {
  const exercisesAlreadyCreated =
    user?.trainer?.registrationFlags?.exerciseLibraryCreated;
  if (user?.trainer?.athleteIds && !exercisesAlreadyCreated) {
    const userId = user.id;
    const result = [];
    for (
      let athleteIndex = 0;
      athleteIndex < athleteIds.length;
      athleteIndex++
    ) {
      const trainings = [];
      const athleteId = athleteIds[athleteIndex];

      const trainingData = await firestore
        //@ts-ignore firebase object wrongly typed
        .collection('user')
        .doc(athleteId)
        .collection('training')
        .get();
      // const data = result.data();

      trainingData.docs.forEach((element) => trainings.push(element.data()));

      if (trainings) {
        trainings.forEach((trainingElement) => {
          const changeObjectDay = {};
          let changes = false;
          Object.keys(trainingElement.trainingDays).forEach((dayKey) => {
            const day = trainingElement.trainingDays[dayKey];
            const exercises = day.exercises;
            Object.keys(exercises).forEach((exerciseKey) => {
              const name = exercises[exerciseKey].name;
              if (name !== undefined) {
                let newName = name?.trim().replace(firestorePathRegex, '-');
                newName = newName.replace('.', '');
                result.push(newName);
                if (name !== newName) {
                  changes = true;
                  changeObjectDay[
                    'trainingDays.' +
                      dayKey +
                      '.exercises.' +
                      exerciseKey +
                      '.name'
                  ] = newName;
                }
              }
            });
          });
          if (changes) {
            firestore.update(
              specificTrainingDataQuery(athleteId, trainingElement.id),
              changeObjectDay,
            );
          }
        });
      }
    }
    const dayTemplatePromise = await firestore
      //@ts-ignore firebase object wrongly typed
      .collection('user')
      .doc(user.id)
      .collection('dayTemplatesCollection')
      .get();
    const dayTemplates = [];
    if (dayTemplatePromise) {
      dayTemplatePromise.docs.forEach((element) =>
        dayTemplates.push(element.data()),
      );
      dayTemplates.forEach((day) => {
        const changeObject = {};
        let changes = false;
        const exercises = day.training.exercises;
        Object.keys(exercises).forEach((exerciseKey) => {
          const name = exercises[exerciseKey].name;
          if (name !== undefined) {
            let newName = name.trim().replace(firestorePathRegex, '-');
            newName = newName.replace('.', '');

            result.push(newName);
            if (name !== newName) {
              changes = true;
              changeObject['training.exercises.' + exerciseKey + '.name'] =
                newName;
            }
          }
        });
        if (changes) {
          firestore.update(
            specificDayTemplateQuery(userId, day.id),
            changeObject,
          );
        }
      });
    }

    const weekTemplatePromise = await firestore
      //@ts-ignore firebase object wrongly typed
      .collection('user')
      .doc(user.id)
      .collection('weekTemplatesCollection')
      .get();
    const weekTemplates = [];
    if (dayTemplatePromise) {
      weekTemplatePromise.docs.forEach((element) =>
        weekTemplates.push(element.data()),
      );
      weekTemplates.forEach(async (trainingElement) => {
        const newTemplate = cloneDeep(trainingElement);
        let change = false;
        if (trainingElement.trainingDays) {
          Object.keys(trainingElement.trainingDays).forEach((dayKey) => {
            const day = trainingElement.trainingDays[dayKey];
            const exercises = day.exercises;
            Object.keys(exercises).forEach((exerciseKey) => {
              const name = exercises[exerciseKey].name;
              if (name !== undefined) {
                let newName = name.trim().replace(firestorePathRegex, '-');
                newName = newName.replace('.', '');

                result.push(newName);
                if (name !== newName) {
                  change = true;
                  newTemplate.trainingDays[dayKey].exercises[exerciseKey].name =
                    newName;
                }
              }
            });
          });
        }
        if (change) {
          await firestore.set(
            specificWeekTemplateQuery(userId, trainingElement.id),
            newTemplate,
          );
        }
      });
    }

    const cycleTemplatePromise = await firestore
      //@ts-ignore firebase object wrongly typed
      .collection('user')
      .doc(user.id)
      .collection('cycleTemplatesCollection')
      .get();
    if (cycleTemplatePromise) {
      const cycleTemplates = [];
      cycleTemplatePromise.docs.forEach((element) =>
        cycleTemplates.push(element.data()),
      );
      cycleTemplates.forEach(async (cycleTemplate) => {
        const newTemplate = cloneDeep(cycleTemplate);
        Object.values(cycleTemplate?.template).forEach(
          async (trainingElement: WeekTemplateType, index) => {
            let change = false;
            Object.keys(trainingElement.trainingDays).forEach((dayKey) => {
              const day = trainingElement.trainingDays[dayKey];
              const exercises = day.exercises;
              Object.keys(exercises).forEach((exerciseKey) => {
                const name = exercises[exerciseKey].name;
                if (name !== undefined) {
                  let newName = name.trim().replace(firestorePathRegex, '-');
                  newName = newName.replace('.', '');

                  result.push(newName);
                  if (name !== newName) {
                    change = true;
                    newTemplate.template['week' + index].trainingDays[
                      dayKey
                    ].exercises[exerciseKey].name = newName;
                  }
                }
              });
            });

            if (change) {
              await firestore.set(
                specificCycleTemplateQuery(userId, trainingElement.id),
                newTemplate,
              );
            }
          },
        );
      });
    }

    let uniqueExercises = uniqBy(result, (x: string) => x);
    uniqueExercises = uniqueExercises.filter((e) => e !== '');
    const changeObject = {
      [t('LIBRARY_EXAMPLE_ENTRY_TITLE')]: generateExampleLibraryEntry(),
    };
    uniqueExercises.forEach(
      (name) => (changeObject[name] = generateEmptyLibraryEntry(name)),
    );
    try {
      await firestore.set(addLibraryEntry(userId), changeObject, {
        merge: true,
      });
      await firestore.update(usersDataQuery(userId), {
        ['trainer.registrationFlags.exerciseLibraryCreated']: true,
      });
    } catch (error) {
      console.warn(error);
    }
  }
};

export const getLinkedExercises = async (
  athleteIds: string[],
  userId: string,
  firestore: ExtendedFirestoreInstance,
  oldName: string,
  secondaryExercises: ExerciseLibraryEntryType[],
  library: ExerciseLibraryType,
) => {
  const results = {};
  const resultsDayTemplates = {};
  const resultsWeekTemplates = {};
  const resultsCycleTemplates = {};
  const resultsSecondaryExercises = [];

  if (athleteIds) {
    for (
      let athleteIndex = 0;
      athleteIndex < athleteIds.length;
      athleteIndex++
    ) {
      const trainings = [];
      const athleteId = athleteIds[athleteIndex];
      const trainingData = await firestore
        //@ts-ignore firebase object wrongly typed
        .collection('user')
        .doc(athleteId)
        .collection('training')
        .get();
      // const data = result.data();

      trainingData.docs.forEach((element) => trainings.push(element.data()));

      if (trainings) {
        trainings?.forEach((trainingElement) => {
          const exercisesArray = [];
          if (trainingElement.trainingDays) {
            Object.keys(trainingElement.trainingDays).forEach((dayKey) => {
              const day = trainingElement.trainingDays[dayKey];
              const exercises = day.exercises;
              Object.keys(exercises).forEach((exerciseKey) => {
                if (exercises[exerciseKey].name === oldName) {
                  exercisesArray.push(
                    'trainingDays.' +
                      dayKey +
                      '.exercises.' +
                      exerciseKey +
                      '.name',
                  );
                }
              });
            });
          }
          if (exercisesArray.length > 0) {
            if (!results[athleteId]) {
              results[athleteId] = {};
            }
            results[athleteId][trainingElement.id] = exercisesArray;
          }
        });
      }
    }
  }

  const cycleTemplatePromise = await firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(userId)
    .collection('cycleTemplatesCollection')
    .get();
  if (cycleTemplatePromise) {
    const cycleTemplates = [];
    cycleTemplatePromise.docs.forEach((element) =>
      cycleTemplates.push(element.data()),
    );
    cycleTemplates.forEach(async (cycleTemplate) => {
      Object.keys(cycleTemplate?.template).forEach(async (weekKey: string) => {
        const trainingElement = cycleTemplate?.template[weekKey];
        const exercisesArray = [];
        Object.keys(trainingElement.trainingDays).forEach((dayKey) => {
          const day = trainingElement.trainingDays[dayKey];
          const exercises = day.exercises;
          Object.keys(exercises).forEach((exerciseKey) => {
            if (exercises[exerciseKey].name === oldName) {
              exercisesArray.push({
                weekKey: weekKey,
                dayKey: day.dayKey,
                exerciseKey: exerciseKey,
              });
            }
          });
        });
        if (exercisesArray.length > 0) {
          resultsCycleTemplates[cycleTemplate.id] = {
            ...resultsCycleTemplates[cycleTemplate.id],
            [weekKey]: {
              oldArray: trainingElement.trainingDays,
              paths: exercisesArray,
            },
          };
        }
      });
    });
  }

  const dayTemplatePromise = await firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(userId)
    .collection('dayTemplatesCollection')
    .get();
  const dayTemplates = [];
  if (dayTemplatePromise) {
    dayTemplatePromise?.docs?.forEach((element) =>
      dayTemplates.push(element.data()),
    );
    dayTemplates.forEach((dayTemplate) => {
      const exercisesArray = [];
      const exercises = dayTemplate.training.exercises;
      Object.keys(exercises).forEach((exerciseKey) => {
        if (exercises[exerciseKey].name === oldName) {
          exercisesArray.push('training.exercises.' + exerciseKey + '.name');
        }
      });
      if (exercisesArray.length > 0) {
        resultsDayTemplates[dayTemplate.id] = exercisesArray;
      }
    });
  }

  const weekTemplatePromise = await firestore
    //@ts-ignore firebase object wrongly typed
    .collection('user')
    .doc(userId)
    .collection('weekTemplatesCollection')
    .get();
  const weekTemplates = [];
  if (weekTemplatePromise) {
    weekTemplatePromise?.docs?.forEach((element) =>
      weekTemplates.push(element.data()),
    );
    weekTemplates.forEach((weekTemplate) => {
      const exercisesArray = [];
      Object.keys(weekTemplate.trainingDays).forEach((dayKey) => {
        const day = weekTemplate.trainingDays[dayKey];
        const exercises = day.exercises;
        Object.keys(exercises).forEach((exerciseKey) => {
          if (exercises[exerciseKey].name === oldName) {
            exercisesArray.push({
              dayKey: day.dayKey,
              exerciseKey: exerciseKey,
            });
          }
        });
      });
      if (exercisesArray.length > 0) {
        resultsWeekTemplates[weekTemplate.id] = {
          oldArray: weekTemplate.trainingDays,
          paths: exercisesArray,
        };
      }
    });
  }

  if (secondaryExercises && library) {
    secondaryExercises.forEach((secExercise) => {
      if (library[secExercise?.name]?.linkedPrimaryEx === oldName) {
        resultsSecondaryExercises.push(secExercise.name);
      }
    });
  }
  return {
    plans: results,
    dayTemplates: resultsDayTemplates,
    weekTemplates: resultsWeekTemplates,
    cycleTemplates: resultsCycleTemplates,
    secondaryExercises: resultsSecondaryExercises,
  };
};

export const changeExerciseLinkingLibrary = async (
  userId: string,
  firestore: ExtendedFirestoreInstance,
  oldName: string,
  newName: string,
  linkedExercises: any,
) => {
  if (linkedExercises.plans) {
    Object.keys(linkedExercises.plans).forEach((athleteId) => {
      const trainingIds = Object.keys(linkedExercises.plans[athleteId]);
      trainingIds.forEach((trainingId) => {
        const changeObject = {};

        const paths = linkedExercises.plans[athleteId][trainingId];
        paths.forEach((path) => {
          changeObject[path] = newName;
        });
        try {
          firestore.update(
            specificTrainingDataQuery(athleteId, trainingId),
            changeObject,
          );
        } catch (error) {
          console.warn(error);
        }
      });
    });
  }
  if (linkedExercises.dayTemplates) {
    Object.keys(linkedExercises.dayTemplates).forEach((dayTemplateId) => {
      const changeObject = {};

      linkedExercises.dayTemplates[dayTemplateId].forEach((path) => {
        changeObject[path] = newName;
      });
      try {
        firestore.update(
          specificDayTemplateQuery(userId, dayTemplateId),
          changeObject,
        );
      } catch (error) {
        console.warn(error);
      }
    });
  }
  if (linkedExercises.weekTemplates) {
    Object.keys(linkedExercises.weekTemplates).map(async (weekTemplateId) => {
      const newArray = linkedExercises.weekTemplates[weekTemplateId].oldArray;
      const paths = linkedExercises.weekTemplates[weekTemplateId].paths;
      paths.forEach((path) => {
        const dayIndex = newArray.findIndex(
          (element) => element.dayKey === path.dayKey,
        );
        newArray[dayIndex].exercises[path.exerciseKey].name = newName;
      });
      try {
        firestore.update(specificWeekTemplateQuery(userId, weekTemplateId), {
          trainingDays: newArray,
        });
      } catch (error) {
        console.warn(error);
      }
    });
  }
  if (linkedExercises.cycleTemplates) {
    Object.keys(linkedExercises.cycleTemplates).map(async (cycleTemplateId) => {
      const weekTemplates = linkedExercises.cycleTemplates[cycleTemplateId];
      const changeObject = {};
      Object.keys(weekTemplates).map(async (weekKey) => {
        const newArray =
          linkedExercises.cycleTemplates[cycleTemplateId][weekKey].oldArray;
        const paths =
          linkedExercises.cycleTemplates[cycleTemplateId][weekKey].paths;
        paths.forEach((path) => {
          const dayIndex = newArray.findIndex(
            (element) => element.dayKey === path.dayKey,
          );
          newArray[dayIndex].exercises[path.exerciseKey].name = newName;
        });
        changeObject['template.' + weekKey + '.trainingDays'] = newArray;
      });
      try {
        firestore.update(
          specificCycleTemplateQuery(userId, cycleTemplateId),
          changeObject,
        );
      } catch (error) {
        console.warn(error);
      }
    });
  }
  if (linkedExercises.secondaryExercises) {
    const changeObject = {};
    linkedExercises.secondaryExercises.forEach((name) => {
      changeObject[name + '.linkedPrimaryEx'] = newName;
    });
    await firestore.update(addLibraryEntry(userId), changeObject);
  }
};

export const createLibraryEntry = async (
  userId: string,
  firestore: ExtendedFirestoreInstance,
  name: string,
) => {
  try {
    const emptyEntry = generateEmptyLibraryEntry(name);
    await firestore.set(
      addLibraryEntry(userId),
      {[name]: emptyEntry},
      {
        merge: true,
      },
    );
  } catch (error) {
    console.warn(error);
  }
};

export const editLibraryEntry = async (
  userId: string,
  firestore: ExtendedFirestoreInstance,
  exerciseKey: string,
  changes: Array<{key: string; value: any}>,
) => {
  const changeObject: any = {};
  changes.forEach((change) => {
    changeObject[exerciseKey + '.' + change.key] = change.value;
  });
  await firestore.update(addLibraryEntry(userId), changeObject);
};

export const editNameLibraryEntry = async (
  userId: string,
  firestore: any,
  oldExerciseName: string,
  newExerciseName: string,
  newEntry: ExerciseLibraryEntryType,
  linkedExercises: any,
) => {
  try {
    await changeExerciseLinkingLibrary(
      userId,
      firestore,
      oldExerciseName,
      newExerciseName,
      linkedExercises,
    );
    await firestore.update(addLibraryEntry(userId), {
      [oldExerciseName]: firebase.firestore.FieldValue.delete(),
    });
    await firestore.update(addLibraryEntry(userId), {
      [newExerciseName]: newEntry,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editChangeToNewLibraryEntry = async (
  userId: string,
  firestore: ExtendedFirestoreInstance,
  oldExerciseName: string,
  newExerciseName: string,
  linkedExercises: any,
) => {
  try {
    await changeExerciseLinkingLibrary(
      userId,
      firestore,
      oldExerciseName,
      newExerciseName,
      linkedExercises,
    );
    await firestore.update(addLibraryEntry(userId), {
      [oldExerciseName]: firebase.firestore.FieldValue.delete(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteLibraryEntry = async (
  userId: string,
  firestore: ExtendedFirestoreInstance,
  exerciseName: string,
) => {
  try {
    await firestore.update(addLibraryEntry(userId), {
      [exerciseName]: firebase.firestore.FieldValue.delete(),
    });
  } catch (error) {
    console.log(error);
  }
};

const generateEmptyLibraryEntry = (name: string): ExerciseLibraryEntryType => {
  return {
    name: name,
    category: 'LIBRARY_PRIMARY_EXERCISE',
    description: '',
    muscleGroup: [],
    videoLinks: [],
    photoLinks: [],
    equipmentDesc: '',
  };
};

export const generateExampleLibraryEntry = (): ExerciseLibraryEntryType => {
  return {
    name: t('LIBRARY_EXAMPLE_ENTRY_TITLE'),
    category: 'LIBRARY_PRIMARY_EXERCISE',
    description: t('LIBRARY_EXAMPLE_ENTRY_DESCRIPTION'),
    muscleGroup: ['MUSCLE_GROUP_CALVES', 'MUSCLE_GROUP_HAMS'],
    videoLinks: [],
    photoLinks: [],
    equipmentDesc: t('LIBRARY_EXAMPLE_ENTRY_DESCRIPTION_EQUIPMENT'),
  };
};
