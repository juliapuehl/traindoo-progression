import {AddCircle, RemoveCircle} from '@mui/icons-material';
import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {primary_green} from '../../styles/colors';
import BasicTextField from '../BasicTextField';
import IconWithTooltip from '../IconWithTooltip';

type Props = {
  answers: string[];
  setAnswers: (newAnswers: string[]) => void;
};

export const CheckEditorButtonSurveyQuestion = (props: Props) => {
  const changeAnswer = (value: string, index: number) => {
    const newAnswers = [...props.answers];
    newAnswers[index] = value;
    if (value.length > 20) {
      return;
    } else {
      props.setAnswers(newAnswers);
    }
  };

  const addAnswer = () => {
    const newAnswers = [...props.answers];
    newAnswers.push('');
    props.setAnswers(newAnswers);
  };

  const removeAnswer = () => {
    const newAnswers = [...props.answers];
    newAnswers.pop();
    props.setAnswers(newAnswers);
  };

  const generateSurvey = () => {
    return props.answers.map((answer, index) => {
      return (
        <BasicTextField
          style={styles.answerInput}
          key={index + 'answer'}
          onChange={(value: string) => changeAnswer(value, index)}
          value={answer}
          label={t('CHECKEDITOR_SURVEY_ANSWER') + (index + 1)}
        />
      );
    });
  };

  return (
    <div style={styles.answerContainer}>
      {generateSurvey()}
      <div style={styles.addIconContainer}>
        <IconWithTooltip
          hide={props.answers.length >= 10}
          style={styles.addIcon}
          onClick={addAnswer}
          muiIcon={AddCircle}
          description={t('CHECKEDITOR_SURVEY_ANSWER_ADD')}
        />
        <IconWithTooltip
          hide={props.answers.length <= 2}
          style={styles.addIcon}
          onClick={removeAnswer}
          muiIcon={RemoveCircle}
          description={t('CHECKEDITOR_SURVEY_ANSWER_REMOVE')}
        />
      </div>
    </div>
  );
};

type Styles = {
  answerContainer: CSSProperties;
  addIconContainer: CSSProperties;
  addIcon: CSSProperties;
  answerInput: CSSProperties;
};

const styles: Styles = {
  answerContainer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  addIconContainer: {
    paddingTop: 8,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  addIcon: {
    color: primary_green,
    height: 24,
  },
  answerInput: {
    width: 200,
    marginRight: 16,
    marginBottom: 0,
    marginTop: 16,
  },
};
