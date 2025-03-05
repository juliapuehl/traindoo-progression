import {ArrowDropDown, ArrowDropUp} from '@mui/icons-material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import {
  useCheckTranslateCategoryName,
  useCheckTranslateQuestion,
} from '../hooks/useCheckTranslate';
import {
  getSpecificTrainingWeeklyCheck,
  specificWeeklyCheckQuery,
} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {
  getSpecificTrainingId,
  getSpecificWeeklyId,
} from '../store/trainingSlice';
import {dark_gray, light_gray, surveyColorArray, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {useGetUnitValueFrontend} from '../traindoo_shared/units/useUnits';
import {DailyMediaAthleteValue} from './DailyMediaAthleteValue';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  weekIndex: number;
};

export const WeeklyCheckComponentNew = (props: Props) => {
  const weeklyId = useSelector((state: RootState) =>
    getSpecificWeeklyId(state, props.weekIndex),
  );
  const athleteUserId = useSelector(getCurrentAthleteId);
  const getTranslatedQuestion = useCheckTranslateQuestion();
  const getValueFrontend = useGetUnitValueFrontend();
  const getCategoryTranslated = useCheckTranslateCategoryName();
  const trainingId = useSelector((state: RootState) =>
    getSpecificTrainingId(state, props.weekIndex),
  );
  useFirestoreConnect(
    trainingId
      ? specificWeeklyCheckQuery(athleteUserId, weeklyId, trainingId)
      : [],
  );
  const weeklyCheck = useSelector((state: RootState) =>
    getSpecificTrainingWeeklyCheck(state, trainingId),
  );
  const [extended, setExtended] = useState(false);

  const generateQuestions = () => {
    const resultArray = [];
    if (weeklyId && weeklyCheck) {
      Object.values(weeklyCheck?.categories)
        .sort((a, b) => a.index - b.index)
        .forEach((category) => {
          const categoryArray = [];
          if (category.questions) {
            Object.values(category.questions)
              .sort((a, b) => a.index - b.index)
              .map((question) => {
                const questionTranslated = getTranslatedQuestion(
                  category?.id,
                  question?.id,
                );
                let valueStyle = {};
                let value: string | number = question?.athleteText;
                if (
                  questionTranslated?.type === 'survey' &&
                  question.athleteValue !== undefined
                ) {
                  // Values go from 1-5 index from 0-4 => -1
                  valueStyle = {
                    color: surveyColorArray[question.athleteValue - 1],
                  };
                  value =
                    questionTranslated?.answers[question.athleteValue - 1];
                } else if (
                  questionTranslated?.type === 'buttonSurvey' &&
                  question.athleteValue !== undefined
                ) {
                  value = questionTranslated?.answers[question.athleteValue];
                } else if (questionTranslated?.type === 'input') {
                  value = getValueFrontend(
                    questionTranslated.unit,
                    question.athleteValue,
                  );
                }
                categoryArray.push(
                  <div
                    key={'question' + category?.id + question?.id}
                    style={styles.info}
                  >
                    <div style={styles.questionTitle}>
                      {questionTranslated?.question}
                    </div>
                    {questionTranslated?.type === 'media' ? (
                      <DailyMediaAthleteValue
                        description={questionTranslated.question}
                        url={question?.athleteImageLink?.url}
                      />
                    ) : (
                      <div style={{...styles.value, ...valueStyle}}>
                        {value === undefined ? '-' : value}
                      </div>
                    )}
                  </div>,
                );
              });
            resultArray.push(
              <div key={'category' + category?.id} style={styles.category}>
                <div style={styles.headline}>
                  {getCategoryTranslated(category?.id)}
                </div>
                {categoryArray}
              </div>,
            );
          }
        });
    }
    return <div style={styles.arrayContainer}>{resultArray}</div>;
  };

  if (weeklyId && weeklyCheck) {
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
            intercomTarget="weekly-check-component-extend-button"
          />
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
