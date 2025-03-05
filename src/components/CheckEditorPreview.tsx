import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {useCheckTranslateQuestion} from '../hooks/useCheckTranslate';
import {CheckTemplateType} from '../types/Check';
import {CategoryPreview} from './CategoryPreview';

type Props = {
  check: CheckTemplateType;
  type: 'daily' | 'weekly' | 'generic';
};
export const CheckEditorPreview = (props: Props) => {
  const check = props.check;
  const translateQuestion = useCheckTranslateQuestion();
  const generateContent = () => {
    return check && check.categories ? (
      Object.values(check.categories)
        .sort((a, b) => a.index - b.index)
        .map((category) => {
          const questionValues = Object.values(category.questions)
            .sort((a, b) => a.index - b.index)
            .map((question) => {
              return translateQuestion(category.id, question.id);
            });
          return (
            <CategoryPreview
              key={category.id}
              categoryId={category.id}
              questions={questionValues}
            />
          );
        })
    ) : (
      <></>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.notch} />
      <div style={styles.scrollView}>
        <div style={styles.title}>
          {props.type === 'daily'
            ? t('CHECK_PREVIEW_DAILY_TITLE')
            : t('CHECK_PREVIEW_WEEKLY_TITLE')}
        </div>
        {generateContent()}
      </div>
      <div style={styles.home} />
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  notch: CSSProperties;
  home: CSSProperties;
  title: CSSProperties;
  scrollView: CSSProperties;
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
  scrollView: {
    paddingTop: 48,
    height: 680,
    overflow: 'auto',
    paddingLeft: 16,
    paddingRight: 16,
    background: 'linear-gradient(#13161A, #2B3334)',
    paddingBottom: 128,
  },
  container: {
    width: 360,
    height: 680,
    overflow: 'hidden',
    marginLeft: 32,
    borderRadius: 48,
    border: '8px solid black',
    position: 'relative',
    boxShadow: '-10px 10px 2px rgba(0, 0, 0, 0.2)',
  },
  notch: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'black',
    height: 24,
    width: 180,
    borderRadius: '0px 0px 16px 16px',
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
  },
  home: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'white',
    height: 6,
    width: 120,
    borderRadius: 4,
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
};
