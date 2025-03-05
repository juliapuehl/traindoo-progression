import {ArrowDropDown, ArrowDropUp} from '@mui/icons-material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {
  getSpecificAthleteWeeklyFeedback,
  getSpecificWeeklyCheck,
} from '../store/trainingSlice';
import {dark_gray, light_gray, surveyColorArray, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {QuestionTypes} from '../traindoo_shared/types/Training';
import {handleValues} from '../utils/helper';
import {CommentPopover} from './CommentPopover';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  weekIndex: number;
};

export const WeeklyCheckComponent = (props: Props) => {
  const weeklyCheck = useSelector((state: RootState) =>
    getSpecificWeeklyCheck(state, props.weekIndex),
  );
  const athleteFeedback = useSelector((state: RootState) =>
    getSpecificAthleteWeeklyFeedback(state, props.weekIndex),
  );
  const [extended, setExtended] = useState(false);

  const generateQuestions = () => {
    const generalArray = [];
    const trainingArray = [];
    const nutritionArray = [];
    const otherArray = [];
    if (weeklyCheck) {
      weeklyCheck.forEach((check) => {
        check.question.forEach((question, questionIndex) => {
          let value = handleValues(question.athlete.value);
          if (question.athlete.type === QuestionTypes.survey) {
            const index =
              typeof question.athlete.value === 'string'
                ? parseFloat(question.athlete.value)
                : question.athlete.value;
            if (index > 0) {
              value = question.trainer.options[index - 1];
            }
          }
          let valueStyle = {};

          if (
            question.athlete.type === QuestionTypes.survey &&
            question.athlete.value !== -1
          ) {
            valueStyle = {
              color:
                surveyColorArray[
                  parseFloat(String(question.athlete.value)) - 1
                ],
            };
          }

          // Check if custom question
          const valueTranslated =
            typeof value === 'string' &&
            value !== '-' &&
            value.includes('SURVEY_')
              ? t(value)
              : value;
          const titleTranslated = question.athlete.title.includes('WEEKLY_')
            ? t(question.athlete.title + '_QUESTION')
            : question.athlete.title;

          const view = (
            <div
              key={'key' + question + check + questionIndex}
              style={styles.info}
            >
              <div style={styles.questionTitle}>{titleTranslated}</div>
              <div style={{...styles.value, ...valueStyle}}>
                {valueTranslated}
              </div>
            </div>
          );
          switch (check.category) {
            case 'Nutrition':
              nutritionArray.push(view);
              break;
            case 'Training':
              trainingArray.push(view);
              break;
            case 'General':
              generalArray.push(view);
              break;
            default:
              otherArray.push(view);
              break;
          }
        });
      });
    }
    return (
      <div style={styles.arrayContainer}>
        <div style={styles.category}>
          <div style={styles.headline}>
            {t('PLANNING_HEALTH_WEEKLY_TITLE_GENERAL')}
          </div>
          {generalArray}
        </div>
        <div style={styles.category}>
          <div style={styles.headline}>
            {t('PLANNING_HEALTH_WEEKLY_TITLE_TRAINING')}
          </div>
          {trainingArray}
        </div>
        <div style={styles.category}>
          <div style={styles.headline}>
            {t('PLANNING_HEALTH_WEEKLY_TITLE_NUTRITION')}
          </div>
          {nutritionArray}
        </div>
        {/* <div style={styles.category}>
          <div>{"Other"}</div>
          {otherArray}
        </div> */}
      </div>
    );
  };
  if (weeklyCheck) {
    return (
      <div style={styles.container}>
        <div style={styles.headline}>
          {t('PLANNING_HEALTH_WEEKLY_TITLE')}
          <IconWithTooltip
            muiIcon={extended ? ArrowDropUp : ArrowDropDown}
            style={styles.arrowStyle}
            onClick={() => {
              setExtended(!extended);
            }}
          />
          {athleteFeedback && (
            <CommentPopover
              title={t('PLANNING_HEALTH_WEEKLY_ATHLETE_FEEDBACK_TITLE')}
              description={t(
                'PLANNING_HEALTH_WEEKLY_ATHLETE_FEEDBACK_DESCRIPTION',
              )}
              text={athleteFeedback}
              justDisplay
            />
          )}
        </div>
        {extended && <div>{generateQuestions()}</div>}
      </div>
    );
  } else {
    return <></>;
  }
};

type Styles = {
  container: CSSProperties;
  headline: CSSProperties;
  info: CSSProperties;
  arrayContainer: CSSProperties;
  category: CSSProperties;
  value: CSSProperties;
  questionTitle: CSSProperties;
  arrowStyle: CSSProperties;
};

const styles: Styles = {
  container: {
    marginRight: 8,
    marginLeft: 8,
    marginTop: 4,
    backgroundColor: dark_gray,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    padding: 8,
    borderRadius: 8,
    boxShadow: '0 1px 2px',
  },
  headline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: white,
    ...sharedStyle.textStyle.title2,
  },
  arrowStyle: {
    marginLeft: 16,
  },
  info: {
    paddingRight: 36,
    display: 'flex',
    flexDirection: 'row',
    borderBottom: `1px dotted ${light_gray}`,
  },
  arrayContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    color: white,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 16,
  },
  value: {
    minWidth: 60,
  },
  questionTitle: {
    width: 800,
  },
};
