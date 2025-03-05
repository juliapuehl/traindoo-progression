import {CameraAlt} from '@mui/icons-material';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useNavigate} from 'react-router-dom';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {
  getSpecificTraining,
  getSpecificWeightAvg,
  getWeekHasProgressImages,
} from '../store/trainingSlice';
import {primary_green, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {
  CategoryTypes,
  CheckType,
  dayIndicesArray,
  QuestionSplitterType,
} from '../traindoo_shared/types/Training';
import {useCalculateLengthBackend} from '../traindoo_shared/units/useCalculateLengthBackend';
import {useCalculateLengthFrontend} from '../traindoo_shared/units/useCalculateLengthFrontend';
import {useCalculateLoadBackend} from '../traindoo_shared/units/useCalculateLoadBackend';
import {useCalculateLoadFrontend} from '../traindoo_shared/units/useCalculateLoadFrontend';
import {editSpecificDailyCheckValue} from '../utils/editingTrainingHelper';
import {calculateCalories} from '../utils/helper';
import {CommentPopover} from './CommentPopover';
import DailyCheckAthleteValueField from './DailyCheckAthleteValueField';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  startDate: string;
  weekIndex: number;
};

export const handleAddValue = (value: string) => {
  if (
    !value ||
    value === '-1' ||
    parseFloat(value) < 1 ||
    isNaN(parseFloat(value))
  ) {
    return [0, 0];
  } else {
    return [parseFloat(value), 1];
  }
};

export const DailyCheckValuesComponent = (props: Props) => {
  const athleteUserId = useSelector(getCurrentAthleteId);
  const calculateWeightFrontend = useCalculateLoadFrontend();
  const calculateLengthFrontend = useCalculateLengthFrontend();
  const calculateWeightBackend = useCalculateLoadBackend();
  const calculateLengthBackend = useCalculateLengthBackend();
  const trainingWeek = useSelector((state: RootState) =>
    getSpecificTraining(state, props.weekIndex),
  );
  const thisWeekWeightAvg = useSelector((state: RootState) =>
    getSpecificWeightAvg(state, props.weekIndex),
  );
  const lastWeekWeightAvg = useSelector((state: RootState) =>
    getSpecificWeightAvg(state, props.weekIndex - 1),
  );
  const weekHasProgressImages = useSelector((state: RootState) =>
    getWeekHasProgressImages(state, props.weekIndex),
  );
  const navigate = useNavigate();
  const firestore = useFirestore();
  const navigateAnalyticsScreen = () => {
    navigate('/analytics');
  };

  const dayNameHeight = trainingWeek.defineDailyMakros
    ? {height: 44, display: 'flex', alignItems: 'center'}
    : {height: 24};
  const generateDayNames = () => {
    const viewArray = [];
    const day = moment(trainingWeek.startDate);
    for (let index = 0; index < 7; index++) {
      viewArray.push(
        <div key={'day' + index} style={dayNameHeight}>
          {day.format('dd')}
        </div>,
      );
      day.add(1, 'day');
    }
    viewArray.push(<div key={'dayAvg'}>{t('PLANNING_HEALTH_DAILY_AVG')}</div>);
    return viewArray;
  };

  const remarkIcons = [];

  const generateValueRows = () => {
    const viewArray = [];
    const avg = {};
    if (trainingWeek) {
      for (let index = 0; index < 7; index++) {
        const trainingDay = trainingWeek.trainingDays[dayIndicesArray[index]];
        const dailyCheck = trainingDay.dailyCheck.reduce(
          (acc, check: CheckType) => ({
            ...acc,
            [check.category]: check.question.reduce(
              (acc2, questionSplitter: QuestionSplitterType) => ({
                ...acc2,
                [questionSplitter.athlete.id]: {
                  categoryIndex: check.index,
                  questionIndex: questionSplitter.index,
                  athlete: questionSplitter.athlete.value,
                  trainer: questionSplitter.trainer.value,
                },
              }),
              {},
            ),
          }),
          {},
        );
        const views = Object.keys(dailyCheck).map((checkKey) => {
          return Object.keys(dailyCheck[checkKey]).map((questionKey) => {
            const checkData = dailyCheck[checkKey][questionKey];
            const [addValue, addValueSet] = handleAddValue(checkData.athlete);
            if (questionKey in avg) {
              avg[questionKey].value += addValue;
              avg[questionKey].amount += addValueSet;
            } else {
              avg[questionKey] = {value: addValue, amount: addValueSet};
            }
            const handleEdit = (value: string) => {
              let newValue = value;
              if (
                checkData.categoryIndex === 1 &&
                checkData.questionIndex === 0
              ) {
                newValue = calculateWeightBackend(value).toString();
              }
              if (
                checkData.categoryIndex === 1 &&
                checkData.questionIndex === 1
              ) {
                newValue = calculateLengthBackend(value).toString();
              }
              const changeArray = [
                {
                  categoryIndex: checkData.categoryIndex,
                  questionIndex: checkData.questionIndex,
                  value: newValue,
                },
              ];
              if (checkKey === CategoryTypes.nutrition) {
                const calories = calculateCalories(
                  dailyCheck[checkKey].carbohydrates?.trainer,
                  dailyCheck[checkKey].fats?.trainer,
                  dailyCheck[checkKey].proteins?.trainer,
                  newValue,
                  checkData.questionIndex,
                );
                changeArray.push({
                  categoryIndex: 0,
                  questionIndex: 0,
                  value: calories.toString(),
                });
              }
              editSpecificDailyCheckValue(
                trainingWeek.id,
                trainingWeek,
                changeArray,
                athleteUserId,
                index,
                firestore,
              );
            };
            return (
              <DailyCheckAthleteValueField
                key={checkKey + index + questionKey}
                index={index}
                questionKey={questionKey}
                checkKey={checkKey}
                athleteValue={checkData.athlete}
                trainerValue={checkData.trainer}
                defineDailyMarkos={trainingWeek.defineDailyMakros}
                uploadValue={(value: string) => handleEdit(value)}
              />
            );
          });
        });
        viewArray.push(
          <div style={styles.valueRow} key={'views' + index}>
            {views}
          </div>,
        );
        remarkIcons.push(
          <div style={styles.iconContainer} key={'icon' + index}>
            {trainingDay.dailyAthleteRemark && (
              <CommentPopover
                title={t('PLANNING_HEALTH_REMARK_TITLE')}
                description={t('PLANNING_HEALTH_REMARK_DESCRIPTION')}
                text={trainingDay.dailyAthleteRemark}
                justDisplay
              />
            )}
          </div>,
        );
      }
    }

    viewArray.push(
      <div style={styles.valueRowAvg} key={'AVG'}>
        {Object.keys(avg).map((checkKey) => {
          let value =
            avg[checkKey].amount > 0
              ? Math.round((avg[checkKey].value / avg[checkKey].amount) * 10) /
                10
              : '-';
          if (checkKey === 'weight') {
            value = calculateWeightFrontend(value);
          } else if (checkKey === 'waistSize') {
            value = calculateLengthFrontend(value);
          }
          return (
            <div style={styles.valueElement} key={'Check' + checkKey}>
              {value}
            </div>
          );
        })}
      </div>,
    );
    return viewArray;
  };

  const weightPercentage =
    lastWeekWeightAvg > 0
      ? Math.round((thisWeekWeightAvg / lastWeekWeightAvg - 1) * 100 * 100) /
        100
      : 0;
  const weightChange =
    lastWeekWeightAvg > 0
      ? Math.round((thisWeekWeightAvg - lastWeekWeightAvg) * 100) / 100
      : 0;
  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.rowHeadlines}>{generateDayNames()}</div>
        <div style={styles.values}>{generateValueRows()}</div>
        <div style={styles.values}>{remarkIcons}</div>
        <div style={styles.weightDevelopment}>
          <div style={sharedStyle.textStyle.primary_white_capital}>
            {t('PLANNING_HEALTH_WEIGHT_DETAIL')}
          </div>
          <div style={sharedStyle.textStyle.secondary_white_capital}>
            {t('PLANNING_HEALTH_WEIGHT_TREND_KG', {
              weight: calculateWeightFrontend(weightChange),
            })}
          </div>
          <div style={sharedStyle.textStyle.secondary_white_capital}>
            {t('PLANNING_HEALTH_WEIGHT_TREND_PERCENT', {
              weight: weightPercentage,
            })}
          </div>

          <div
            style={{
              ...sharedStyle.textStyle.secondary_white_capital,
              ...styles.progressImages,
            }}
          >
            {t('PLANNING_HEALTH_PROGRESS_IMAGES')}
            {weekHasProgressImages && (
              <IconWithTooltip
                muiIcon={CameraAlt}
                style={styles.progressImageIcon}
                onClick={navigateAnalyticsScreen}
                description={t('PLANNING_HEALTH_PROGRESS_IMAGES_DESCRIPTION')}
              />
            )}
            {!weekHasProgressImages && '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  rowHeadlines: CSSProperties;
  values: CSSProperties;
  valueElement: CSSProperties;
  valueRow: CSSProperties;
  weightDevelopment: CSSProperties;
  valueRowAvg: CSSProperties;
  iconContainer: CSSProperties;
  progressImages: CSSProperties;
  progressImageIcon: CSSProperties;
};

const styles: Styles = {
  container: {
    flex: 1,
    marginLeft: 4,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    flexGrow: 2,
    minWidth: 'fit-content',
  },
  rowHeadlines: {
    ...sharedStyle.textStyle.title2,
    width: 26,
  },
  values: {},
  valueRow: {display: 'flex', flexDirection: 'row'},
  valueElement: {
    color: white,
    width: 120,
    textAlign: 'center',
  },
  weightDevelopment: {
    borderLeft: '1px solid white',
    paddingLeft: 8,
    flexGrow: 2,
    minWidth: 200,
  },
  valueRowAvg: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px dotted white',
  },
  iconContainer: {
    width: 120,
    height: 21.333,
    display: 'flex',
    justifyContent: 'center',
  },
  progressImages: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  progressImageIcon: {marginLeft: 16, color: primary_green},
};
