import {t} from 'i18n-js';
import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {getCheckCategoryLibrary} from '../logic/firestore';

//TODO: Check if i18n-js has error handling. If yes we dont need this (t(category.name) ?? category.name)
export const useCheckTranslateCategoryName = () => {
  const library = useSelector(getCheckCategoryLibrary);
  return (categoryId: string) => {
    if (!library || !library[categoryId]) return '';
    const category = library[categoryId];
    return category && category.translated ? t(category.name) : category.name;
  };
};
export const useCheckTranslateQuestion = () => {
  const library = useSelector(getCheckCategoryLibrary);
  return useCallback(
    (categoryId: string, questionId: string) => {
      if (!library || !categoryId || !questionId || !library[categoryId]) {
        return undefined;
      }
      const question = library[categoryId]?.questions[questionId];
      if (question) {
        return question && question.translated
          ? {
              ...question,
              name: t(question.name),
              question: t(question.question),
              placeholder: question?.placeholder ? t(question.placeholder) : '',
              answers: question.answers
                ? question.answers.map((element) => t(element))
                : [],
            }
          : question;
      } else {
        return undefined;
      }
    },
    [library],
  );
};
