import {CheckTemplateType} from './Check';

export const standardDailyCheckTemplate: CheckTemplateType = {
  name: 'Default Daily Check',
  notEditable: true,
  id: 'testId',
  categories: {
    General: {
      id: 'General',
      index: 0,
      questions: {
        AthleteRemark: {
          index: 0,
          id: 'AthleteRemark',
        },
      },
    },
    Nutrition: {
      index: 1,
      id: 'Nutrition',
      questions: {
        Calories: {
          index: 0,
          id: 'Calories',
        },
        Carbohydrates: {
          index: 1,
          id: 'Carbohydrates',
        },
        Proteins: {
          index: 2,
          id: 'Proteins',
        },
        Fats: {
          index: 3,
          id: 'Fats',
        },
      },
    },
    Body: {
      index: 2,
      id: 'Body',
      questions: {
        Weight: {
          index: 0,
          id: 'Weight',
        },
        WaistSize: {
          index: 1,
          id: 'WaistSize',
        },
      },
    },
    Activity: {
      index: 3,
      id: 'Activity',
      questions: {
        StepsAmount: {
          index: 0,
          id: 'StepsAmount',
        },
      },
    },
    Sleep: {
      index: 4,
      id: 'Sleep',
      questions: {
        SleepDuration: {
          index: 0,
          id: 'SleepDuration',
        },
        SleepQuality: {
          index: 1,
          id: 'SleepQuality',
        },
      },
    },
    Regeneration: {
      index: 5,
      id: 'Regeneration',
      questions: {
        RegenerationScore: {
          index: 0,
          id: 'RegenerationScore',
        },
        SorenessScore: {
          index: 1,
          id: 'SorenessScore',
        },
      },
    },
    Hydration: {
      index: 6,
      id: 'Hydration',
      questions: {
        HydrationAmount: {
          index: 0,
          id: 'HydrationAmount',
        },
      },
    },
    ProgressImages: {
      index: 7,
      id: 'ProgressImages',
      questions: {
        Front: {
          index: 0,
          id: 'Front',
        },
        Side: {
          index: 1,
          id: 'Side',
        },
        Back: {
          index: 2,
          id: 'Back',
        },
        Additional: {
          index: 3,
          id: 'Additional',
        },
      },
    },
  },
};
