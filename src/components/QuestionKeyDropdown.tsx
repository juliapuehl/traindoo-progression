import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  getDailyCheckTextQuestions,
  getUserId,
  webSettingsLayoutQuery,
} from '../logic/firestore';
import SimpleSelect from './SimpleSelect';

type Props = {
  currentGraphKey: string;
  questionKey: string;
};

export const QuestionKeyDropdown = (props: Props) => {
  const {currentGraphKey, questionKey} = props;
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const textQuestions = useSelector(getDailyCheckTextQuestions);

  const questionKeyPath =
    'dailyCheckLayout.elements.' + currentGraphKey + '.questionKey';

  const itemsDropdown = textQuestions
    ? textQuestions.map((question) => {
        return {
          value: question.questionId,
          label: question.label,
        };
      })
    : [];
  const addQuestion = (keyWord) => {
    const addValue = textQuestions.find(
      (question) => question.questionId === keyWord,
    );
    if (addValue) {
      firestore.update(webSettingsLayoutQuery(userId), {
        [questionKeyPath]: {
          categoryId: addValue.categoryId,
          questionId: addValue.questionId,
        },
      });
    }
  };

  return (
    <div style={styles.container}>
      <SimpleSelect
        items={itemsDropdown}
        value={questionKey}
        label={t('DASHBOARD_QUESTIONSELECTOR_TITLE')}
        onChange={addQuestion}
        style={styles.selector}
      />
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  selector: CSSProperties;
};

const styles: Styles = {
  container: {display: 'flex', flexDirection: 'row'},
  selector: {marginBottom: 5, width: 300},
};
