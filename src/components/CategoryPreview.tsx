import {CSSProperties} from 'react';
import {useCheckTranslateCategoryName} from '../hooks/useCheckTranslate';
import {CheckQuestionTemplate} from '../traindoo_shared/types/Check';
import {useGetUnitObject} from '../traindoo_shared/units/useUnits';
import {CommentPreview} from './CommentPreview';
import {LongTextInputPreview} from './LongTextInputPreview';
import {MediaInputPreview} from './MediaInputPreview';
import {SliderPreview} from './SliderPreview';
import {ValueInputPreview} from './ValueInputPreview';
import {ButtonSurveyPreview} from './check_editor/ButtonSurveyPreview';

type Props = {
  categoryId?: string;
  questions?: CheckQuestionTemplate[];
};

export const CategoryPreview = (props: Props) => {
  const getUnitObject = useGetUnitObject();
  const translateCategory = useCheckTranslateCategoryName();
  const generateElement = (question: CheckQuestionTemplate) => {
    if (question) {
      const unitObject = getUnitObject(question?.unit);
      switch (question.type) {
        case 'input':
          return (
            <ValueInputPreview
              question={question.question}
              valueTop={
                (question.defaultValue ?? '') +
                (question.unit ? ' ' + unitObject?.label : '')
              }
              value={question.defaultValue?.toString() ?? ''}
            />
          );
        case 'survey':
          return (
            <SliderPreview
              title={question.question}
              values={question.answers}
            />
          );
        case 'buttonSurvey':
          return (
            <ButtonSurveyPreview
              title={question.question}
              values={question.answers}
            />
          );
        case 'comment':
          return (
            <CommentPreview
              description={question.question}
              placeholder={question.placeholder}
            />
          );
        case 'longText':
          return (
            <LongTextInputPreview
              description={question.question}
              placeholder={question.placeholder}
            />
          );
        case 'media':
          return <MediaInputPreview title={question.question} />;
        default:
          return <div />;
      }
    } else {
      return <></>;
    }
  };
  const questions = props.questions?.map((question, index) => {
    if (!question) return <div key={'previewQuestionUndefined' + index} />;
    return (
      <div
        style={styles.questionContainer}
        key={'previewQuestion' + props.categoryId + question?.id}
      >
        {generateElement(question)}
      </div>
    );
  });
  return (
    <div style={styles.outestContainer}>
      <div style={styles.container}>
        <div style={styles.title}>{translateCategory(props.categoryId)}</div>
        {questions}
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  title: CSSProperties;
  outestContainer: CSSProperties;
  questionContainer: CSSProperties;
};

const styles: Styles = {
  title: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
  },
  container: {
    background: 'linear-gradient(#2D3636, #323839)',
    width: 400,
    borderRadius: 8,
    marginTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  outestContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  questionContainer: {
    marginTop: 16,
  },
};
