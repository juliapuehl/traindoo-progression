import {CheckTemplateType} from './Check';

export const standardWeeklyCheckTemplate: CheckTemplateType = {
  name: 'Default Weekly Check',
  notEditable: true,
  id: 'testId',
  categories: {
    General: {
      id: 'General',
      index: 0,
      questions: {
        WeeklyRemark: {
          index: 0,
          id: 'WeeklyRemark',
        },
        WeeklyStress: {
          index: 1,
          id: 'WeeklyStress',
        },
        WeeklyIntegration: {
          index: 2,
          id: 'WeeklyIntegration',
        },
        WeeklyProblemsIntegration: {
          index: 3,
          id: 'WeeklyProblemsIntegration',
        },
        WeeklyFeedback: {
          index: 4,
          id: 'WeeklyFeedback',
        },
      },
    },
    Sleep: {
      index: 1,
      id: 'Sleep',
      questions: {
        WeeklySleep: {
          index: 0,
          id: 'WeeklySleep',
        },
      },
    },
    Training: {
      index: 2,
      id: 'Training',
      questions: {
        WeeklyExhaustion: {
          index: 0,
          id: 'WeeklyExhaustion',
        },
        WeeklyPain: {
          index: 1,
          id: 'WeeklyPain',
        },
        WeeklyMuscleGroup: {
          index: 2,
          id: 'WeeklyMuscleGroup',
        },
        WeeklyFun: {
          index: 3,
          id: 'WeeklyFun',
        },
        WeeklyFunFeedback: {
          index: 4,
          id: 'WeeklyFunFeedback',
        },
        WeeklyContent: {
          index: 5,
          id: 'WeeklyContent',
        },
        WeeklyContentFeedback: {
          index: 6,
          id: 'WeeklyContentFeedback',
        },
        WeeklyQuestion: {
          index: 7,
          id: 'WeeklyQuestion',
        },
      },
    },
    WeeklyNutrition: {
      index: 3,
      id: 'WeeklyNutrition',
      questions: {
        WeeklyHunger: {
          index: 0,
          id: 'WeeklyHunger',
        },
        WeeklyNutrition: {
          index: 1,
          id: 'WeeklyNutrition',
        },
        WeeklyNutritionQuestion: {
          index: 2,
          id: 'WeeklyNutritionQuestion',
        },
      },
    },
  },
};
