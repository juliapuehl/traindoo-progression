import {t} from 'i18n-js';

const defaultQuestionCategories = [
  'DEFAULT_LAYOUT_WEEKLY_NOTE',
  'DEFAULT_LAYOUT_DAILY_NOTE',
  'DEFAULT_STATS_PROGRESS_IMAGES',
  'DEFAULT_STATS_NUTRITION',
  'DEFAULT_STATS_NUTRITION_SUMMARY',
  'DEFAULT_STATS_WEIGHT',
  'DEFAULT_STATS_CALORIES',
  'DEFAULT_STATS_PERF_FATIGUE',
];

/* Check if default category name is used. If yes, return translated string.
 * Once user changes the category name, this custom name will always be returned. */
export const getDashboardCategoryName = (name: string) => {
  return defaultQuestionCategories.includes(name) ? t(name) : name;
};

export const defaultDashboardLayout = () => ({
  questionColors: {
    Additional: '#ffa88c',
    WaistSize: '#ffccfd',
    WeeklyExhaustion: '#fcec99',
    Side: '#ef86c5',
    Calories: '#6bef9a',
    Carbohydrates: '#6786e5',
    Fats: '#f97af1',
    Weight: '#f9c0d8',
    Front: '#dcf271',
    Proteins: '#ea6981',
    Back: '#aeea72',
    StepsAmount: '#7ac1ff',
    WeeklyContent: '#ccfffe',
  },
  elements: {
    element1664991187: {
      type: 'text',
      editable: false,
      minW: 4,
      endDate: '',
      name: 'DEFAULT_LAYOUT_WEEKLY_NOTE',
      minH: 4,
      questionKey: {categoryId: 'General', questionId: 'WeeklyRemark'},
      startDate: '',
      timeFrame: 'GRAPHS_SELECTOR_ALL_TIME',
      elementKey: 'element1664991187',
      index: 5,
    },
    element1664991141: {
      type: 'text',
      index: 4,
      name: 'DEFAULT_LAYOUT_DAILY_NOTE',
      minW: 4,
      elementKey: 'element1664991141',
      questionKey: {questionId: 'AthleteRemark', categoryId: 'General'},
      editable: false,
      minH: 4,
      startDate: '',
      timeFrame: 'GRAPHS_SELECTOR_ALL_TIME',
      endDate: '',
    },
    element1664991569: {
      editable: false,
      elementKey: 'element1664991569',
      endDate: '',
      minW: 4,
      startDate: '',
      checkKeys: [
        {questionId: 'Front', categoryId: 'ProgressImages'},
        {categoryId: 'ProgressImages', questionId: 'Back'},
        {categoryId: 'ProgressImages', questionId: 'Side'},
        {questionId: 'Additional', categoryId: 'ProgressImages'},
      ],
      type: 'media',
      minH: 4,
      timeFrame: 'GRAPHS_SELECTOR_ALL_TIME',
      index: 8,
      name: 'DEFAULT_STATS_PROGRESS_IMAGES',
    },
    element1664990884: {
      timeFrame: 'GRAPHS_SELECTOR_THIRTY',
      index: 2,
      checkKeys: [
        {categoryId: 'Nutrition', questionId: 'Fats'},
        {categoryId: 'Nutrition', questionId: 'Proteins'},
        {questionId: 'Carbohydrates', categoryId: 'Nutrition'},
      ],
      endDate: '',
      minH: 4,
      type: 'graph',
      startDate: '2022-09-04T17:28:33.933Z',
      minW: 4,
      name: 'DEFAULT_STATS_NUTRITION',
      editable: false,
      elementKey: 'element1664990884',
    },
    element1664991277: {
      index: 7,
      endDate: '',
      editable: false,
      checkKeys: [
        {questionId: 'Fats', categoryId: 'Nutrition'},
        {categoryId: 'Nutrition', questionId: 'Proteins'},
        {categoryId: 'Nutrition', questionId: 'Carbohydrates'},
        {categoryId: 'Nutrition', questionId: 'Calories'},
        {questionId: 'Weight', categoryId: 'Body'},
      ],
      type: 'table',
      timeFrame: 'GRAPHS_SELECTOR_ALL_TIME',
      minW: 4,
      elementKey: 'element1664991277',
      minH: 4,
      startDate: '',
      name: 'DEFAULT_STATS_NUTRITION_SUMMARY',
    },
    element1664991234: {
      elementKey: 'element1664991234',
      name: 'DEFAULT_STATS_WEIGHT',
      timeFrame: 'GRAPHS_SELECTOR_THIRTY',
      startDate: '2022-09-04T17:34:22.883Z',
      endDate: '',
      checkKeys: [{questionId: 'Weight', categoryId: 'Body'}],
      type: 'graph',
      editable: false,
      minW: 4,
      index: 6,
      minH: 4,
    },
    element1664990954: {
      timeFrame: 'GRAPHS_SELECTOR_THIRTY',
      type: 'graph',
      minW: 4,
      index: 3,
      checkKeys: [{questionId: 'Calories', categoryId: 'Nutrition'}],
      editable: false,
      minH: 4,
      name: 'DEFAULT_STATS_CALORIES',
      endDate: '',
      startDate: '2022-09-04T17:29:39.930Z',
      elementKey: 'element1664990954',
    },
    element1664990802: {
      editable: false,
      checkKeys: [
        {questionId: 'WeeklyContent', categoryId: 'Training'},
        {questionId: 'WeeklyExhaustion', categoryId: 'Training'},
      ],
      minW: 4,
      minH: 4,
      index: 1,
      name: 'DEFAULT_STATS_PERF_FATIGUE',
      timeFrame: 'GRAPHS_SELECTOR_NINETY',
      elementKey: 'element1664990802',
      type: 'graph',
      endDate: '',
      startDate: '2022-07-06T17:31:30.984Z',
    },
  },
  layout: {
    sm: [
      {
        x: 0,
        minW: 4,
        w: 6,
        static: false,
        y: 0,
        minH: 4,
        moved: false,
        i: 'element1664991141',
        h: 4,
      },
      {
        y: 25,
        x: 0,
        static: false,
        w: 6,
        i: 'element1664991187',
        moved: false,
        minW: 4,
        h: 4,
        minH: 4,
      },
      {
        minW: 4,
        x: 0,
        y: 21,
        static: false,
        moved: false,
        h: 4,
        minH: 4,
        w: 6,
        i: 'element1664990802',
      },
      {
        moved: false,
        minH: 4,
        y: 12,
        x: 0,
        static: false,
        w: 6,
        i: 'element1664991234',
        h: 4,
        minW: 4,
      },
      {
        x: 0,
        minH: 4,
        minW: 4,
        h: 6,
        i: 'element1664991569',
        y: 29,
        moved: false,
        w: 6,
        static: false,
      },
      {
        minH: 4,
        moved: false,
        static: false,
        x: 0,
        i: 'element1664991277',
        minW: 4,
        w: 6,
        h: 5,
        y: 16,
      },
      {
        i: 'element1664990954',
        static: false,
        x: 0,
        minH: 4,
        moved: false,
        w: 6,
        h: 4,
        y: 8,
        minW: 4,
      },
      {
        w: 6,
        h: 4,
        moved: false,
        static: false,
        minH: 4,
        minW: 4,
        i: 'element1664990884',
        y: 4,
        x: 0,
      },
    ],
    lg: [
      {
        h: 4,
        y: 0,
        minH: 4,
        x: 0,
        minW: 4,
        moved: false,
        i: 'element1664991141',
        static: false,
        w: 4,
      },
      {
        minH: 4,
        x: 0,
        moved: false,
        static: false,
        w: 12,
        i: 'element1664991569',
        y: 12,
        minW: 4,
        h: 6,
      },
      {
        x: 4,
        static: false,
        h: 4,
        y: 4,
        moved: false,
        i: 'element1664990954',
        minH: 4,
        w: 4,
        minW: 4,
      },
      {
        minW: 4,
        h: 4,
        w: 4,
        minH: 4,
        i: 'element1664991187',
        x: 0,
        moved: false,
        static: false,
        y: 4,
      },
      {
        moved: false,
        minH: 4,
        minW: 4,
        static: false,
        h: 4,
        w: 8,
        y: 0,
        i: 'element1664990884',
        x: 4,
      },
      {
        minW: 4,
        moved: false,
        w: 6,
        y: 8,
        minH: 4,
        x: 0,
        h: 4,
        i: 'element1664990802',
        static: false,
      },
      {
        minW: 4,
        moved: false,
        h: 4,
        i: 'element1664991234',
        w: 4,
        y: 4,
        static: false,
        x: 8,
        minH: 4,
      },
      {
        minH: 4,
        h: 4,
        minW: 4,
        static: false,
        i: 'element1664991277',
        y: 8,
        moved: false,
        w: 6,
        x: 6,
      },
    ],
    xxs: [
      {
        w: 2,
        x: 0,
        minW: 4,
        minH: 4,
        h: 4,
        i: 'element1664990954',
        moved: false,
        static: false,
        y: 8,
      },
      {
        h: 4,
        minW: 4,
        minH: 4,
        w: 2,
        y: 25,
        moved: false,
        static: false,
        x: 0,
        i: 'element1664991187',
      },
      {
        moved: false,
        static: false,
        h: 4,
        i: 'element1664991234',
        minH: 4,
        minW: 4,
        y: 12,
        w: 2,
        x: 0,
      },
      {
        moved: false,
        minW: 4,
        minH: 4,
        x: 0,
        y: 21,
        w: 2,
        static: false,
        h: 4,
        i: 'element1664990802',
      },
      {
        minW: 4,
        moved: false,
        h: 4,
        y: 0,
        i: 'element1664991141',
        x: 0,
        static: false,
        minH: 4,
        w: 2,
      },
      {
        i: 'element1664991569',
        y: 29,
        w: 2,
        h: 6,
        minH: 4,
        moved: false,
        minW: 4,
        x: 0,
        static: false,
      },
      {
        h: 4,
        x: 0,
        minW: 4,
        moved: false,
        w: 2,
        y: 4,
        i: 'element1664990884',
        static: false,
        minH: 4,
      },
      {
        static: false,
        moved: false,
        i: 'element1664991277',
        minW: 4,
        w: 2,
        x: 0,
        y: 16,
        h: 5,
        minH: 4,
      },
    ],
    md: [
      {
        y: 4,
        static: false,
        x: 4,
        moved: false,
        i: 'element1664990954',
        w: 6,
        h: 4,
        minW: 4,
        minH: 4,
      },
      {
        y: 4,
        h: 4,
        minW: 4,
        minH: 4,
        i: 'element1664991187',
        static: false,
        moved: false,
        x: 0,
        w: 4,
      },
      {
        x: 6,
        minH: 4,
        h: 4,
        w: 4,
        minW: 4,
        i: 'element1664991234',
        y: 8,
        moved: false,
        static: false,
      },
      {
        w: 6,
        y: 8,
        i: 'element1664990802',
        moved: false,
        static: false,
        h: 4,
        minW: 4,
        x: 0,
        minH: 4,
      },
      {
        minH: 4,
        minW: 4,
        h: 4,
        moved: false,
        x: 0,
        i: 'element1664991141',
        w: 4,
        y: 0,
        static: false,
      },
      {
        y: 17,
        h: 6,
        moved: false,
        static: false,
        i: 'element1664991569',
        w: 10,
        minW: 4,
        minH: 4,
        x: 0,
      },
      {
        h: 4,
        y: 0,
        x: 4,
        w: 6,
        i: 'element1664990884',
        moved: false,
        minW: 4,
        minH: 4,
        static: false,
      },
      {
        x: 0,
        i: 'element1664991277',
        minH: 4,
        static: false,
        y: 12,
        minW: 4,
        h: 5,
        w: 10,
        moved: false,
      },
    ],
    l: [
      {
        static: false,
        minH: 4,
        moved: false,
        w: 10,
        i: 'element1664991569',
        minW: 4,
        h: 7,
        y: 13,
        x: 0,
      },
      {
        x: 10,
        minW: 4,
        y: 5,
        static: false,
        h: 4,
        minH: 4,
        i: 'element1664990954',
        w: 10,
        moved: false,
      },
      {
        x: 10,
        i: 'element1664991234',
        static: false,
        minW: 4,
        y: 9,
        minH: 4,
        moved: false,
        h: 4,
        w: 10,
      },
      {
        minW: 4,
        x: 10,
        y: 13,
        moved: false,
        minH: 4,
        i: 'element1664991277',
        w: 10,
        static: false,
        h: 7,
      },
      {
        w: 10,
        y: 0,
        static: false,
        moved: false,
        h: 7,
        minW: 4,
        x: 0,
        i: 'element1664990802',
        minH: 4,
      },
      {
        y: 7,
        minW: 4,
        i: 'element1664991187',
        w: 5,
        moved: false,
        x: 5,
        minH: 4,
        h: 6,
        static: false,
      },
      {
        w: 5,
        i: 'element1664991141',
        minH: 4,
        moved: false,
        y: 7,
        h: 6,
        static: false,
        x: 0,
        minW: 4,
      },
      {
        x: 10,
        minH: 4,
        y: 0,
        w: 10,
        h: 5,
        i: 'element1664990884',
        static: false,
        minW: 4,
        moved: false,
      },
    ],
  },
});
