import moment from 'moment';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import {useCheckTranslateQuestion} from '../hooks/useCheckTranslate';
import {
  checkValueMultipleDocumentQuery,
  getCheckCategoryLibrary,
  getDailyDashboardColorInfo,
  getSpecificGraphData,
} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {dark_gray, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {useGetUnitValueFrontend} from '../traindoo_shared/units/useUnits';
import {CheckValueDocumentType} from '../types/CheckValues';
import {DailyCheckDashboardElementType} from '../types/DashboardLayout';
import {DashboardElementHeadline} from './DashboardElementHeadline';
import {DashboardElementValueControl} from './DashboardElementValueControl';
import {LineGraphComponentNew} from './LineGraphComponentNew';

type Props = {
  element: DailyCheckDashboardElementType;
  remove: () => void;
  setElementStatic: (elementKey: string, value: boolean) => void;
};

export const DashboardValuesGraph = (props: Props) => {
  const {
    editable,
    checkKeys,
    endDate,
    startDate,
    elementKey,
    timeFrame,
    name,
    type,
  } = props.element;
  const translatedQuestion = useCheckTranslateQuestion();

  const getValueFrontend = useGetUnitValueFrontend();
  const dataObject: {[key: string]: {name: string; value: string}} = {};
  const questionColors = useSelector(getDailyDashboardColorInfo);
  const athleteUserId = useSelector(getCurrentAthleteId);
  const categoryLibrary = useSelector(getCheckCategoryLibrary);
  useFirestoreConnect(
    checkKeys?.length > 0 && athleteUserId
      ? checkValueMultipleDocumentQuery(
          athleteUserId,
          checkKeys.map((key) => key.questionId),
          elementKey,
        )
      : [],
  );

  const graphData: {[checkKey: string]: CheckValueDocumentType} = useSelector(
    (state: RootState) => getSpecificGraphData(state, elementKey),
  );
  const colorArray = [];
  const dataNames = [];
  if (graphData) {
    for (const question of Object.values(graphData)) {
      const questionName = translatedQuestion(
        question.categoryId,
        question.questionId,
      )?.name;
      colorArray.push(questionColors[question.id]);
      dataNames.push(questionName);
      if (question.values && questionName) {
        const questionInfo =
          categoryLibrary[question.categoryId].questions[question.questionId];
        for (const value of Object.values(question.values)) {
          const frontendValue = getValueFrontend(
            questionInfo.unit,
            value.value,
          );
          if (frontendValue !== '' && typeof frontendValue === 'number') {
            dataObject[value.checkId] = {
              ...dataObject[value.checkId],
              name: moment(value.checkId, 'YYYY-MM-DD').toISOString(),
              [questionName]: frontendValue,
            };
          }
        }
      }
    }
  }
  const removeGraph = () => {
    props.remove();
  };

  const changeEditable = () => {
    const newEditable = editable !== undefined ? !editable : false;
    props.setElementStatic(elementKey, newEditable);
  };
  const timeFilteredData = Object.values(dataObject)
    .sort((a, b) => moment(a.name).diff(b.name))
    .filter(
      (dataPoint) =>
        (endDate === '' ||
          moment(dataPoint.name).isSameOrBefore(moment(endDate))) &&
        (startDate === '' ||
          moment(dataPoint.name).isSameOrAfter(moment(startDate))),
    );

  return (
    <div style={styles.innerContainer}>
      <DashboardElementHeadline
        editable={editable}
        startDate={startDate}
        endDate={endDate}
        removeElement={removeGraph}
        name={name}
        setEditable={changeEditable}
      />
      <DashboardElementValueControl
        editable={editable}
        startDate={startDate}
        endDate={endDate}
        elementKey={elementKey}
        timeFrame={timeFrame}
        checkKeys={checkKeys}
        name={name}
        type={type}
      />
      <LineGraphComponentNew
        data={timeFilteredData}
        colorArray={colorArray}
        width={'95%'}
        height={'80%'}
        dataNames={dataNames}
      />
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  icon: CSSProperties;
  timeSpan: CSSProperties;
  icons: CSSProperties;
};

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 600,
    minHeight: 400,
    margin: 8,
    scrollbarWidth: 'none',
  },
  innerContainer: {
    padding: 8,
    borderRadius: 8,
    height: '100%',
    boxShadow: '0 1px 2px',
    minWidth: 'fit-content',
    backgroundColor: dark_gray,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'auto',
  },
  icon: {marginLeft: 16, color: white},
  timeSpan: {...sharedStyle.textStyle.title2, marginBottom: 5},
  icons: {display: 'flex', flexDirection: 'row'},
};
