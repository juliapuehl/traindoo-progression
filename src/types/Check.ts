// TRAINER DAILY CHECK TEMPLATE START
// Question infos are saved in the Category Library and only referenced here
// ######################
export type CheckTemplateType = {
  name: string;
  id: string;
  notEditable?: boolean;
  categories: {
    [categoryName: string]: CheckCategoryType;
  };
};

export type CheckCategoryType = {
  id: string;
  index: number;
  defineDaily?: boolean;
  questions: {[questionId: string]: CheckQuestionType};
};

export type CheckQuestionType = {
  id: string;
  index: number;
};
// ######################
// TRAINER DAILY CHECK TEMPLATE END

export const questionTypeArray = [
  {
    type: 'input',
    name: 'QUESTION_TYPE_INPUT',
  },
  {
    type: 'survey',
    name: 'QUESTION_TYPE_SURVEY',
  },
  {
    type: 'buttonSurvey',
    name: 'QUESTION_TYPE_BUTTONSURVEY',
  },
  {
    type: 'comment',
    name: 'QUESTION_TYPE_COMMENT',
  },
  {
    type: 'longText',
    name: 'QUESTION_TYPE_LONG_TEXT',
  },
  {
    type: 'media',
    name: 'QUESTION_TYPE_MEDIA',
  },
];
