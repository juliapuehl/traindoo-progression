import {ContentCopy, ContentPaste} from '@mui/icons-material';
import {createTheme, Switch, ThemeProvider, Typography} from '@mui/material';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getTrainingDailyCheckArray} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {
  getDailyCheckCopy,
  getDailyCheckCopyExists,
  getSpecificTraining,
  getSpecificTrainingId,
  isDailyCheckCopied,
  setCopyDailyCheck,
} from '../store/trainingSlice';
import {
  dark_gray,
  light_gray,
  primary_green,
  ultra_light_gray,
} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {useCalculateLengthFrontend} from '../traindoo_shared/units/useCalculateLengthFrontend';
import {useCalculateLoadFrontend} from '../traindoo_shared/units/useCalculateLoadFrontend';
import {
  editDailyCheckValues,
  editDefineDailyMakros,
  insertDailyCheckCopy,
} from '../utils/editingTrainingHelper';
import {calculateCalories} from '../utils/helper';
import DailyCheckPlanningCatComponent from './DailyCheckPlanningCatComponent';
import {DailyCheckValuesComponent} from './DailyCheckValuesComponent';
import IconWithTooltip from './IconWithTooltip';

type Props = {
  weekIndex: number;
};

const customTheme = createTheme({
  palette: {
    primary: {
      main: primary_green,
    },
  },
});

export const DailyCheckPlanningComponent = (props: Props) => {
  const trainingId = useSelector((state: RootState) =>
    getSpecificTrainingId(state, props.weekIndex),
  );
  const trainingPlan = useSelector((state: RootState) =>
    getSpecificTraining(state, props.weekIndex),
  );
  const calculateWeightFrontend = useCalculateLoadFrontend();
  const calculateLengthFrontend = useCalculateLengthFrontend();
  const athleteUserId = useSelector(getCurrentAthleteId);
  const copyExists = useSelector(getDailyCheckCopyExists);
  const thisCheckCopied = useSelector((state: RootState) =>
    isDailyCheckCopied(state, props.weekIndex),
  );
  const copy = useSelector(getDailyCheckCopy);
  const checkArray = useSelector((state: RootState) =>
    getTrainingDailyCheckArray(state, trainingId),
  );
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const valueObj: {[k: string]: any} = {};

  const handleChangeValue = (
    categoryIndex: number,
    questionIndex: number,
    value: string,
  ) => {
    if (trainingId) {
      if (categoryIndex === 0 && questionIndex !== 0) {
        const calories = calculateCalories(
          valueObj.carbohydrates?.value,
          valueObj.fats?.value,
          valueObj.proteins?.value,
          value,
          questionIndex,
        );
        editDailyCheckValues(
          trainingId,
          trainingPlan,
          [
            {categoryIndex: 0, questionIndex: 0, value: calories.toString()},
            {
              categoryIndex: categoryIndex,
              questionIndex: questionIndex,
              value: value,
            },
          ],
          athleteUserId,
          firestore,
        );
      } else {
        editDailyCheckValues(
          trainingId,
          trainingPlan,
          [
            {
              categoryIndex: categoryIndex,
              questionIndex: questionIndex,
              value: value,
            },
          ],
          athleteUserId,
          firestore,
        );
      }
    }
  };

  if (
    checkArray.length === 0 &&
    trainingPlan?.trainingDays['day0'].dailyCheck
  ) {
    let showWaist = false;
    trainingPlan?.trainingDays['day0'].dailyCheck.forEach(
      (category, catIndex) => {
        category.question.forEach((question, questionIndex) => {
          if (question.trainer?.id === 'waistSize') {
            showWaist = true;
          }
          valueObj[question.trainer?.id] = {
            value: question.trainer.value,
            categoryIndex: catIndex,
            questionIndex: questionIndex,
          };
        });
      },
    );
    const handleCopy = () => {
      dispatch(
        setCopyDailyCheck({
          dailyValues: valueObj,
          weekIndex: props.weekIndex,
          cycleIndex: trainingPlan.trainingCycle,
        }),
      );
    };
    const handlePaste = () => {
      if (trainingId) {
        insertDailyCheckCopy(
          copy?.dailyValues,
          trainingPlan,
          athleteUserId,
          firestore,
        );
      }
    };
    const handleDefineDailyMakros = (value: boolean) => {
      if (trainingId) {
        editDefineDailyMakros(trainingId, athleteUserId, value, firestore);
      }
    };
    const insertDescription = t('PLANNING_HEALTH_ICON_INSERT', {
      index: copy?.trainingIndex + 1,
    });
    return (
      <div>
        <div style={styles.weekHeadline}>
          {t('PLANNING_HEALTH_WEEK_TITLE', {
            index: props.weekIndex + 1,
            date: moment(trainingPlan.startDate).format('L'),
          })}
        </div>
        <div style={styles.container}>
          <div style={styles.innerContainer}>
            <div style={styles.goal}>{t('PLANNING_HEALTH_GOAL')}</div>
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_KCAL')}
              value={String(Math.round(valueObj.calories?.value * 100) / 100)}
              uploadValue={(value) => {
                handleChangeValue(0, 0, value);
              }}
              noInput={trainingPlan.defineDailyMakros}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_CARBS')}
              value={valueObj.carbohydrates?.value}
              uploadValue={(value) => {
                handleChangeValue(0, 1, value);
              }}
              noInput={trainingPlan.defineDailyMakros}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_PROTEIN')}
              value={valueObj.proteins?.value}
              uploadValue={(value) => {
                handleChangeValue(0, 2, value);
              }}
              noInput={trainingPlan.defineDailyMakros}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_FAT')}
              value={valueObj.fats?.value}
              greenBorder
              uploadValue={(value) => {
                handleChangeValue(0, 3, value);
              }}
              noInput={trainingPlan.defineDailyMakros}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_WEIGHT')}
              value={calculateWeightFrontend(valueObj.weight?.value).toString()}
              uploadValue={(value) => {
                handleChangeValue(1, 0, value);
              }}
            />
            {showWaist && (
              <DailyCheckPlanningCatComponent
                name={t('PLANNING_WAIST_SIZE')}
                value={calculateLengthFrontend(
                  valueObj.waistSize?.value,
                ).toString()}
                greenBorder
                uploadValue={(value) => {
                  handleChangeValue(1, 1, value);
                }}
              />
            )}
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_STEPS')}
              value={valueObj.stepsAmount?.value}
              greenBorder
              uploadValue={(value) => {
                handleChangeValue(2, 0, value);
              }}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_SLEEP_HOUR')}
              value={valueObj.sleepDuration?.value}
              uploadValue={(value) => {
                handleChangeValue(3, 0, value);
              }}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_SLEEP_QUALITY')}
              value={'-'}
              noInput
              greenBorder
              uploadValue={(value) => {
                handleChangeValue(3, 1, value);
              }}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_REG_OVERALL')}
              value={'-'}
              noInput
              uploadValue={(value) => {
                handleChangeValue(4, 0, value);
              }}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_SORENESS')}
              value={'-'}
              noInput
              greenBorder
              uploadValue={(value) => {
                handleChangeValue(4, 1, value);
              }}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_DRINKING')}
              value={valueObj.hydration?.value}
              greenBorder
              uploadValue={(value) => {
                handleChangeValue(5, 0, value);
              }}
            />
            <DailyCheckPlanningCatComponent
              name={t('PLANNING_HEALTH_REMARK')}
              value={'-'}
              noInput
            />
            <IconWithTooltip
              active={thisCheckCopied}
              styleActive={styles.copyButtonGreen}
              style={styles.copyButton}
              onClick={handleCopy}
              muiIcon={ContentCopy}
              description={t('PLANNING_HEALTH_ICON_COPY')}
            />
            <IconWithTooltip
              hide={!copyExists || thisCheckCopied}
              style={styles.pasteButton}
              onClick={handlePaste}
              muiIcon={ContentPaste}
              description={insertDescription}
            />
          </div>
          <DailyCheckValuesComponent
            startDate={moment().toISOString()}
            weekIndex={props.weekIndex}
          />
          <div style={styles.dailyMakroSwitch}>
            <ThemeProvider theme={customTheme}>
              <Typography
                style={{
                  ...sharedStyle.textStyle.primary_white_capital,
                }}
              >
                {trainingPlan.defineDailyMakros
                  ? t('PLANNING_HEALTH_MARKOS_WEEKLY')
                  : t('PLANNING_HEALTH_MARKOS_DAILY')}
              </Typography>
              <Switch
                checked={trainingPlan.defineDailyMakros}
                onChange={(event) =>
                  handleDefineDailyMakros(event.target.checked)
                }
                color="primary"
              />
            </ThemeProvider>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  goal: CSSProperties;
  pasteButton: CSSProperties;
  copyButton: CSSProperties;
  copyButtonGreen: CSSProperties;
  weekHeadline: CSSProperties;
  dailyMakroSwitch: CSSProperties;
};

const styles: Styles = {
  container: {
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: dark_gray,
    borderRadius: 8,
    flex: 1,
    overflow: 'auto',
    boxShadow: '0 1px 2px',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    flexGrow: 2,
    minWidth: 'fit-content',
  },
  goal: {
    ...sharedStyle.textStyle.title2,
  },
  pasteButton: {
    color: primary_green,
    height: 24,
  },
  copyButton: {
    marginLeft: 16,
    color: light_gray,
    height: 24,
  },
  copyButtonGreen: {
    marginLeft: 16,
    color: primary_green,
    height: 24,
  },
  weekHeadline: {
    ...sharedStyle.textStyle.title1,
    color: ultra_light_gray,

    textAlign: 'left',
    paddingLeft: 16,
    paddingTop: 8,
  },

  dailyMakroSwitch: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
};
