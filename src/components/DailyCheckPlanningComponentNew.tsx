import {ContentCopy, ContentPaste} from '@mui/icons-material';
import {Switch, ThemeProvider, Typography, createTheme} from '@mui/material';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore, useFirestoreConnect} from 'react-redux-firebase';
import {useCheckTranslateQuestion} from '../hooks/useCheckTranslate';
import {
  getTrainingDailyCheckArray,
  getUserLang,
  specificTrainingDailyCheckQuery,
} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {
  getDailyCheckCopyExistsNew,
  getDailyCheckCopyNew,
  getSelectedCycleIndex,
  getSpecificTraining,
  getSpecificTrainingId,
  isDailyCheckCopiedNew,
  setCopyDailyCheckNew,
} from '../store/trainingSlice';
import {dark_gray, light_gray, primary_green} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {
  CheckAthleteType,
  CheckQuestionTemplate,
} from '../traindoo_shared/types/Check';
import {UnitObjectType} from '../traindoo_shared/units/UnitTypes';
import {
  useGetUnitObject,
  useGetUnitValueBackend,
  useGetUnitValueFrontend,
} from '../traindoo_shared/units/useUnits';
import {
  addDailyCheckTrainerValue,
  addDailyCheckTrainingTrainerValue,
  editDefineDailyMakrosNew,
  insertDailyCheckCopyNew,
} from '../utils/editingCheckHelper';
import {CommentPopover} from './CommentPopover';
import DailyCheckAthleteValueFieldNew from './DailyCheckAthleteValueFieldNew';
import DailyCheckPlanningCatComponentNew from './DailyCheckPlanningCatComponentNew';
import {DailyMediaAthleteValue} from './DailyMediaAthleteValue';
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

export const DailyCheckPlanningComponentNew = (props: Props) => {
  const getValueFrontend = useGetUnitValueFrontend();
  const getValueBackend = useGetUnitValueBackend();
  const cycleIndex = useSelector(getSelectedCycleIndex);
  const getTranslatedQuestion = useCheckTranslateQuestion();
  const getUnitObject = useGetUnitObject();
  const trainingId = useSelector((state: RootState) =>
    getSpecificTrainingId(state, props.weekIndex),
  );
  const trainingPlan = useSelector((state: RootState) =>
    getSpecificTraining(state, props.weekIndex),
  );

  const athleteUserId = useSelector(getCurrentAthleteId);
  const copyExists = useSelector(getDailyCheckCopyExistsNew);
  const thisCheckCopied = useSelector((state: RootState) =>
    isDailyCheckCopiedNew(state, props.weekIndex, cycleIndex),
  );
  const copy = useSelector(getDailyCheckCopyNew);

  useFirestoreConnect(
    trainingId
      ? specificTrainingDailyCheckQuery(athleteUserId, trainingId)
      : [],
  );
  const checkArray = useSelector((state: RootState) =>
    getTrainingDailyCheckArray(state, trainingId),
  ) as CheckAthleteType[];
  const checkIds = checkArray.map((check) => check?.id);
  const firstCheck = checkArray?.[0];
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const userLang = useSelector(getUserLang);

  const handleCopy = () => {
    dispatch(
      setCopyDailyCheckNew({
        dailyValues: firstCheck,
        weekIndex: props.weekIndex,
        cycleIndex: cycleIndex,
      }),
    );
  };
  const handlePaste = () => {
    if (trainingId) {
      insertDailyCheckCopyNew(
        checkIds,
        copy.dailyValues,
        athleteUserId,
        firestore,
      );
    }
  };
  const handleDefineDailyMakros = (value: boolean) => {
    editDefineDailyMakrosNew(
      checkIds,
      'Nutrition',
      firstCheck.categories.Nutrition.questions,
      value,
      athleteUserId,
      firestore,
    );
  };
  const insertDescription = t('PLANNING_HEALTH_ICON_INSERT', {
    index: copy?.trainingIndex + 1,
  });
  const uploadTrainerValue = (
    value: string,
    categoryName: string,
    unitObject: UnitObjectType,
    question: CheckQuestionTemplate,
  ) => {
    addDailyCheckTrainingTrainerValue(
      checkIds,
      categoryName,
      question?.id,
      question.index,
      String(getValueBackend(value, unitObject?.id)),
      getValueBackend,
      athleteUserId,
      firestore,
    );
  };
  const uploadTrainerDailyValue = (
    value: string,
    categoryName: string,
    unitObject: UnitObjectType,
    question: CheckQuestionTemplate,
    checkId: string,
  ) => {
    addDailyCheckTrainerValue(
      checkId,
      categoryName,
      question?.id,
      question.index,
      String(getValueBackend(value, unitObject?.id)),
      getValueBackend,
      athleteUserId,
      firestore,
    );
  };
  const generateContent = () => {
    if (firstCheck && checkArray.length > 0) {
      const headerArray: JSX.Element[] = [<th key={'hi'} />];
      const contentArray: Array<JSX.Element[]> = [];
      checkArray.forEach((check) => {
        const momentDate = moment(check?.date);
        momentDate.locale(userLang);

        contentArray.push([
          <td key={check?.date} style={sharedStyle.textStyle.title2}>
            {momentDate ? momentDate.format('dd') : '-'}
          </td>,
        ]);
      });
      contentArray.push([
        <td key={'avg'} style={sharedStyle.textStyle.title2}>
          {t('PLANNING_HEALTH_DAILY_AVG')}
        </td>,
      ]);

      Object.values(firstCheck.categories)
        .sort((a, b) => a.index - b.index)
        .forEach((category) => {
          const questionArray = Object.values(category.questions).sort(
            (a, b) => a.index - b.index,
          );
          questionArray.forEach((question, questionIndex) => {
            const questionInfo = getTranslatedQuestion(
              category?.id,
              question?.id,
            );
            const trainerValue = question.trainerValue ?? '';
            if (questionInfo) {
              const unitObject = getUnitObject(questionInfo?.unit);
              headerArray.push(
                <th
                  key={'trainerCell' + category?.id + question?.id}
                  style={styles.trainerCell}
                >
                  <DailyCheckPlanningCatComponentNew
                    name={
                      questionInfo?.name +
                      (unitObject ? ' ' + unitObject?.label : '')
                    }
                    value={String(
                      getValueFrontend(unitObject?.id, trainerValue),
                    )}
                    uploadValue={(value: string) => {
                      uploadTrainerValue(
                        value,
                        category?.id,
                        unitObject,
                        questionInfo,
                      );
                    }}
                    noInput={
                      category.defineDaily || questionInfo.type !== 'input'
                    }
                    greenBorder={questionIndex === questionArray.length - 1}
                  />
                </th>,
              );
              let average = 0;
              let averageCount = 0;
              checkArray.forEach((check, checkIndex) => {
                const questionData =
                  check.categories[category?.id]?.questions[question?.id];
                const athleteValue = questionData?.athleteValue ?? '-';
                const athleteText = questionData?.athleteText ?? '-';
                const athleteImageLink = questionData?.athleteImageLink;

                const trainerValueAthlete =
                  check.categories[category?.id]?.questions[question?.id]
                    ?.trainerValue ?? '';
                const generateAthleteValue = () => {
                  const component = () => {
                    switch (questionInfo.type) {
                      case 'survey':
                      case 'input':
                        average +=
                          athleteValue !== '-' ? Number(athleteValue) : 0;
                        averageCount +=
                          athleteValue !== '-' &&
                          String(athleteValue).trim() !== ''
                            ? 1
                            : 0;
                        return (
                          <DailyCheckAthleteValueFieldNew
                            key={
                              'DailyCheckAthleteValueFieldNew' +
                              category?.id +
                              question?.id
                            }
                            athleteValue={String(
                              getValueFrontend(unitObject?.id, athleteValue),
                            )}
                            trainerValue={String(
                              getValueFrontend(
                                unitObject?.id,
                                trainerValueAthlete,
                              ),
                            )}
                            defineDailyMarkos={category.defineDaily}
                            uploadValue={(value: string) => {
                              uploadTrainerDailyValue(
                                value,
                                category?.id,
                                unitObject,
                                questionInfo,
                                check?.id,
                              );
                            }}
                          />
                        );
                      case 'buttonSurvey':
                        return (
                          <DailyCheckAthleteValueFieldNew
                            key={
                              'DailyCheckAthleteValueFieldNew' +
                              category?.id +
                              question?.id
                            }
                            athleteValue={
                              questionInfo?.answers[athleteValue] ?? '-'
                            }
                            trainerValue={String(trainerValueAthlete)}
                            defineDailyMarkos={category.defineDaily}
                            uploadValue={(value: string) => {
                              uploadTrainerDailyValue(
                                value,
                                category?.id,
                                unitObject,
                                questionInfo,
                                check?.id,
                              );
                            }}
                          />
                        );
                      case 'longText':
                      case 'comment':
                        return athleteText === '-' ? (
                          <DailyCheckAthleteValueFieldNew
                            key={
                              'DailyCheckAthleteValueFieldNew' +
                              category?.id +
                              question?.id
                            }
                            athleteValue={String(athleteValue)}
                            trainerValue={String(trainerValueAthlete)}
                            defineDailyMarkos={category.defineDaily}
                            uploadValue={(value: string) => {
                              uploadTrainerDailyValue(
                                value,
                                category?.id,
                                unitObject,
                                questionInfo,
                                check?.id,
                              );
                            }}
                          />
                        ) : (
                          <CommentPopover
                            key={
                              'DailyCheckAthleteValueFieldNew' +
                              category?.id +
                              question?.id
                            }
                            title={questionInfo.question}
                            description={t(
                              'PLANNING_HEALTH_REMARK_DESCRIPTION',
                            )}
                            justDisplay
                            style={styles.commentContainer}
                            text={athleteText}
                          />
                        );
                      case 'media':
                        return (
                          <DailyMediaAthleteValue
                            key={
                              'DailyCheckAthleteValueFieldNew' +
                              category?.id +
                              question?.id
                            }
                            description={questionInfo.question}
                            url={athleteImageLink?.url}
                          />
                        );
                      default:
                        return <></>;
                    }
                  };
                  return (
                    <td key={'content' + category?.id + question?.id}>
                      {component()}
                    </td>
                  );
                };
                contentArray[checkIndex].push(generateAthleteValue());
              });
              const avgValue = averageCount > 0 ? average / averageCount : '-';
              contentArray[contentArray.length - 1].push(
                <td
                  style={styles.avgValue}
                  key={'avg' + category?.id + question?.id}
                >
                  {getValueFrontend(unitObject?.id, avgValue)}
                </td>,
              );
            }
          });
        });
      return (
        <table id="dailyContent">
          <thead>
            <tr>{headerArray}</tr>
          </thead>
          <tbody>
            {contentArray.map((row, index) => (
              <tr key={'row' + index}>{row}</tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return <></>;
    }
  };

  if (checkArray.length > 0) {
    return (
      <div style={styles.container}>
        <div style={styles.innerContainer}>
          {generateContent()}
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
        {firstCheck?.categories &&
          Object.keys(firstCheck.categories).includes('Nutrition') && (
            <div style={styles.dailyMakroSwitch}>
              <ThemeProvider theme={customTheme}>
                <Typography
                  style={{
                    ...sharedStyle.textStyle.primary_white_capital,
                  }}
                >
                  {firstCheck.categories.Nutrition?.defineDaily
                    ? t('PLANNING_HEALTH_MARKOS_WEEKLY')
                    : t('PLANNING_HEALTH_MARKOS_DAILY')}
                </Typography>
                <Switch
                  checked={
                    firstCheck.categories.Nutrition?.defineDaily === true
                  }
                  onChange={() =>
                    handleDefineDailyMakros(
                      !firstCheck.categories.Nutrition?.defineDaily,
                    )
                  }
                  color="primary"
                />
              </ThemeProvider>
            </div>
          )}
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
  dailyMakroSwitch: CSSProperties;
  avgValue: CSSProperties;
  commentContainer: CSSProperties;
  trainerCell: CSSProperties;
};

const styles: Styles = {
  container: {
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: dark_gray,
    borderRadius: 8,
    overflow: 'auto',
    boxShadow: '0 1px 2px',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 8,
    maxWidth: 80,
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
  dailyMakroSwitch: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avgValue: {
    ...sharedStyle.textStyle.title2,
    textAlign: 'center',
    borderTop: '1px solid white',
  },
  commentContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  trainerCell: {
    // Height 1 is needed to stretch content height to 100%
    height: 1,
  },
};
