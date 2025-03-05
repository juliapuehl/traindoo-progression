import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import {ExtendedFirestoreInstance} from 'react-redux-firebase';
import {
  checkCategoryLibraryQuery,
  getCheckSpecificCategory,
  getDailyCheckArray,
  getDailyCheckTemplateCategories,
  getDailyUsedQuestionArray,
  getGenericCheckTemplateCategories,
  getGenericUsedQuestionArray,
  getWeeklyCheckArray,
  getWeeklyCheckTemplateCategories,
  getWeeklyUsedQuestionArray,
  specificDailyCheckTemplateQuery,
  specificGenericCheckTemplateQuery,
  specificWeeklyCheckTemplateQuery,
} from '../logic/firestore';
import {CheckQuestionTemplate} from '../traindoo_shared/types/Check';
import {CheckCategoryType, CheckQuestionType} from '../types/Check';
import {RootState} from './store';

const initialState: CheckEditorState = {
  selectedDailyCheckTemplateId: undefined,
  selectedWeeklyCheckTemplateId: undefined,
  selectedGenericCheckTemplateId: undefined,
};

export type CheckEditorState = {
  selectedDailyCheckTemplateId?: string;
  selectedWeeklyCheckTemplateId?: string;
  selectedGenericCheckTemplateId?: string;
};

export const checkEditorSliceKey = 'checkEditorState';

// == REDUCER
export const checkEditorSlice = createSlice({
  name: checkEditorSliceKey,
  initialState,
  reducers: {
    setSelectedDailyCheckTemplateId(state, action: PayloadAction<string>) {
      state.selectedDailyCheckTemplateId = action.payload;
    },
    setSelectedWeeklyCheckTemplateId(state, action: PayloadAction<string>) {
      state.selectedWeeklyCheckTemplateId = action.payload;
    },
    setSelectedGenericCheckTemplateId(state, action: PayloadAction<string>) {
      state.selectedGenericCheckTemplateId = action.payload;
    },
    resetCheckEditorSlice(state) {
      state.selectedDailyCheckTemplateId = undefined;
      state.selectedWeeklyCheckTemplateId = undefined;
      state.selectedGenericCheckTemplateId = undefined;
    },
  },
});

// == ACTIONS
export const {
  setSelectedDailyCheckTemplateId,
  setSelectedWeeklyCheckTemplateId,
  setSelectedGenericCheckTemplateId,
  resetCheckEditorSlice,
} = checkEditorSlice.actions;

// == SELECTORS
export const getSelectedDailyCheckTemplateId = (state: RootState) => {
  const checkArray = getDailyCheckArray(state);
  const selectedId = state[checkEditorSliceKey].selectedDailyCheckTemplateId;
  return selectedId ?? checkArray[0]?.id;
};
export const getSelectedWeeklyCheckTemplateId = (state: RootState) => {
  const checkArray = getWeeklyCheckArray(state);
  const selectedId = state[checkEditorSliceKey].selectedWeeklyCheckTemplateId;
  return selectedId ?? checkArray[0]?.id;
};
export const getSelectedGenericCheckTemplateId = (state: RootState) => {
  return state[checkEditorSliceKey].selectedGenericCheckTemplateId;
};

export const addCategoryToCheck = (state: RootState) => {
  return async (
    categoryName: string,
    categoryId: string,
    checkId: string,
    categoryIndex: number,
    userId: string,
    firestore: ExtendedFirestoreInstance,
    type: 'daily' | 'weekly' | 'generic',
  ) => {
    let checkCategories: {[categoryName: string]: CheckCategoryType};
    let templateQuery;
    let usedInPath;

    switch (type) {
      case 'daily':
        checkCategories = getDailyCheckTemplateCategories(state);
        templateQuery = specificDailyCheckTemplateQuery;
        usedInPath = categoryId + '.usedIn.daily';
        break;
      case 'weekly':
        checkCategories = getWeeklyCheckTemplateCategories(state);
        templateQuery = specificWeeklyCheckTemplateQuery;
        usedInPath = categoryId + '.usedIn.weekly';
        break;
      case 'generic':
        checkCategories = getGenericCheckTemplateCategories(state);
        templateQuery = specificGenericCheckTemplateQuery;
        usedInPath = categoryId + '.usedIn.generic';
        break;
    }
    const category = getCheckSpecificCategory(state, categoryId);
    const questions = {};
    if (category?.notEditable) {
      Object.values(category.questions)
        .sort((a, b) => a.index - b.index)
        .forEach((question: CheckQuestionTemplate, index: number) => {
          questions[question.id] = {
            id: question.id,
            index: index,
          };
        });
    }
    const newCheckCategories = {
      [categoryId]: {
        id: categoryId,
        questions: questions,
        index: categoryIndex,
      },
    };
    if (checkCategories) {
      for (const element of Object.values(checkCategories)) {
        if (element.index >= categoryIndex) {
          newCheckCategories[element.id] = {
            ...element,
            index: element.index + 1,
          };
        } else {
          newCheckCategories[element.id] = element;
        }
      }
    }
    await firestore.update(templateQuery(userId, checkId), {
      ['categories']: newCheckCategories,
    });
    await firestore.update(checkCategoryLibraryQuery(userId), {
      [usedInPath]: firebase.firestore.FieldValue.arrayUnion(checkId),
      [categoryId + '.archived']: false,
    });
  };
};

export const removeCategoryFromCheck = (state: RootState) => {
  return async (
    categoryId: string,
    checkId: string,
    categoryIndex: number,
    userId: string,
    firestore: ExtendedFirestoreInstance,
    type: 'daily' | 'weekly' | 'generic',
  ) => {
    let checkCategories: {[categoryName: string]: CheckCategoryType};
    let templateQuery;
    let usedInPath;

    switch (type) {
      case 'daily':
        checkCategories = getDailyCheckTemplateCategories(state);
        templateQuery = specificDailyCheckTemplateQuery;
        usedInPath = categoryId + '.usedIn.daily';
        break;
      case 'weekly':
        checkCategories = getWeeklyCheckTemplateCategories(state);
        templateQuery = specificWeeklyCheckTemplateQuery;
        usedInPath = categoryId + '.usedIn.weekly';
        break;
      case 'generic':
        checkCategories = getGenericCheckTemplateCategories(state);
        templateQuery = specificGenericCheckTemplateQuery;
        usedInPath = categoryId + '.usedIn.generic';
        break;
    }
    const newCheckCategories = {};
    if (checkCategories) {
      for (const element of Object.values(checkCategories)) {
        if (element.id !== categoryId) {
          if (element.index > categoryIndex) {
            newCheckCategories[element.id] = {
              ...element,
              index: element.index - 1,
            };
          } else {
            newCheckCategories[element.id] = element;
          }
        }
      }
    }

    firestore.update(templateQuery(userId, checkId), {
      ['categories']: newCheckCategories ?? {},
    });
    await firestore.update(checkCategoryLibraryQuery(userId), {
      [usedInPath]: firebase.firestore.FieldValue.arrayRemove(checkId),
    });
  };
};

export const removeQuestionFromCheck = (state: RootState) => {
  return async (
    categoryId: string,
    question: CheckQuestionType,
    checkId: string,
    userId: string,
    firestore: ExtendedFirestoreInstance,
    type: 'daily' | 'weekly' | 'generic',
  ) => {
    let usedQuestionArray: CheckQuestionType[];
    let templateQuery;
    let usedInPath = categoryId + '.questions.' + [question.id];

    switch (type) {
      case 'daily':
        usedQuestionArray = getDailyUsedQuestionArray(state, categoryId);
        templateQuery = specificDailyCheckTemplateQuery;
        usedInPath = usedInPath + '.usedIn.daily';
        break;
      case 'weekly':
        usedQuestionArray = getWeeklyUsedQuestionArray(state, categoryId);
        templateQuery = specificWeeklyCheckTemplateQuery;
        usedInPath = usedInPath + '.usedIn.weekly';
        break;
      case 'generic':
        usedQuestionArray = getGenericUsedQuestionArray(state, categoryId);
        templateQuery = specificGenericCheckTemplateQuery;
        usedInPath = usedInPath + '.usedIn.generic';
        break;
    }

    const newQuestions = {};
    usedQuestionArray.forEach((element) => {
      if (element.id !== question.id) {
        if (element.index > question.index) {
          newQuestions[element.id] = {...element, index: element.index - 1};
        } else {
          newQuestions[element.id] = element;
        }
      }
    });
    await firestore.update(templateQuery(userId, checkId), {
      ['categories.' + categoryId + '.questions']: newQuestions,
    });
    await firestore.update(checkCategoryLibraryQuery(userId), {
      [usedInPath]: firebase.firestore.FieldValue.arrayRemove(checkId),
    });
  };
};

export const addQuestionToCheck = (state: RootState) => {
  return async (
    checkId: string,
    categoryId: string,
    questionId: string,
    questionIndex: number,
    userId: string,
    firestore: ExtendedFirestoreInstance,
    type: 'daily' | 'weekly' | 'generic',
  ) => {
    let usedQuestionArray: CheckQuestionType[];
    let templateQuery;
    let usedInPath = categoryId + '.questions.' + [questionId];
    switch (type) {
      case 'daily':
        usedQuestionArray = getDailyUsedQuestionArray(state, categoryId);
        templateQuery = specificDailyCheckTemplateQuery;
        usedInPath = usedInPath + '.usedIn.daily';
        break;
      case 'weekly':
        usedQuestionArray = getWeeklyUsedQuestionArray(state, categoryId);
        templateQuery = specificWeeklyCheckTemplateQuery;
        usedInPath = usedInPath + '.usedIn.weekly';
        break;
      case 'generic':
        usedQuestionArray = getGenericUsedQuestionArray(state, categoryId);
        templateQuery = specificGenericCheckTemplateQuery;
        usedInPath = usedInPath + '.usedIn.generic';
        break;
    }

    const newQuestions = {
      [questionId]: {id: questionId, index: questionIndex},
    };
    if (usedQuestionArray) {
      usedQuestionArray?.forEach((element) => {
        if (element.index >= questionIndex) {
          newQuestions[element.id] = {...element, index: element.index + 1};
        } else {
          newQuestions[element.id] = element;
        }
      });
    }
    const path = 'categories.' + categoryId + '.questions';
    await firestore.update(templateQuery(userId, checkId), {
      [path]: newQuestions,
    });
    await firestore.update(checkCategoryLibraryQuery(userId), {
      [usedInPath]: firebase.firestore.FieldValue.arrayUnion(checkId),
      [categoryId + '.questions.' + [questionId] + '.archived']: false,
    });
  };
};
