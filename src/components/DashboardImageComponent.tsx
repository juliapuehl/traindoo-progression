import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import {v4 as uuidv4} from 'uuid';
import {useCheckTranslateQuestion} from '../hooks/useCheckTranslate';
import {
  checkValueMultipleDocumentQuery,
  getSpecificGraphData,
} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {setImageViewerPaths} from '../store/trainingSlice';
import {dark_gray, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {DailyCheckDashboardElementType} from '../types/DashboardLayout';
import {DashboardElementHeadline} from './DashboardElementHeadline';
import {DashboardElementScrollIndicator} from './DashboardElementScrollIndicator';
import {DashboardElementValueControl} from './DashboardElementValueControl';

type Props = {
  element: DailyCheckDashboardElementType;
  remove: () => void;
  setElementStatic: (elementKey: string, value: boolean) => void;
};

export const DashboardImageComponent = (props: Props) => {
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

  const getQuestionTranslated = useCheckTranslateQuestion();
  const [imageWidth, setImageWidth] = useState(40);
  const ref = useRef(null);
  const elementWidth = ref.current ? ref.current.offsetWidth : 0;

  const dispatch = useDispatch();
  const dataObject: {[key: string]: {name: string; value: string}} = {};
  const imagePaths = [];
  useEffect(() => {
    let tempWidth =
      (elementWidth - 70) / checkKeys.length - 2 * checkKeys.length;
    tempWidth = tempWidth > 150 ? tempWidth : 150;
    setImageWidth(tempWidth);
  }, [checkKeys.length, elementWidth, imageWidth]);

  const athleteUserId = useSelector(getCurrentAthleteId);
  useFirestoreConnect(
    checkKeys.length > 0 && athleteUserId
      ? checkValueMultipleDocumentQuery(
          athleteUserId,
          checkKeys.map((key) => key.questionId),
          elementKey,
        )
      : [],
  );

  const imageData = useSelector((state: RootState) =>
    getSpecificGraphData(state, elementKey),
  );

  const removeGraph = () => {
    props.remove();
  };

  const changeEditable = () => {
    props.setElementStatic(elementKey, !editable);
  };
  if (imageData) {
    for (const question of Object.values(imageData) as Array<{
      id: string;
      values: Array<{
        checkId: string;
        value: string;
      }>;
    }>) {
      if (question.values) {
        for (const value of Object.values(question.values)) {
          dataObject[value.checkId] = {
            ...dataObject[value.checkId],
            name: moment(value.checkId, 'YYYY-MM-DD').toISOString(),
            [question.id]: value.value,
          };
        }
      }
    }
  }

  const timeFilteredData = Object.values(dataObject)
    .filter(
      (dataPoint) =>
        (endDate === '' ||
          moment(dataPoint.name).isSameOrBefore(moment(endDate))) &&
        (startDate === '' ||
          moment(dataPoint.name).isSameOrAfter(moment(startDate))),
    )
    .sort((a, b) => moment(b.name).diff(a.name));

  const lineData = timeFilteredData.map((entry) => {
    return (
      <tr key={'row' + entry.name}>
        <td style={styles.tableDate}>
          {moment(entry.name).format('dd. L').slice(0, 9)}
        </td>
        {checkKeys?.map((question) => {
          const key = question.questionId;
          if (entry[key]) {
            const index = imagePaths.push(entry[key]?.url) - 1;
            return (
              <td
                key={key}
                style={styles.tableData}
                onClick={() => {
                  openImageViewer(index);
                }}
              >
                <img
                  style={{maxWidth: imageWidth, maxHeight: imageWidth}}
                  src={entry[key]?.url}
                  alt={entry[key]?.fileName + ' ' + key}
                />
              </td>
            );
          } else {
            return <td key={'tableData' + uuidv4()} style={styles.tableData} />;
          }
        })}
      </tr>
    );
  });

  const openImageViewer = (index: number) => {
    dispatch(setImageViewerPaths({selectedIndex: index, paths: imagePaths}));
  };

  const generateImageTable = () => {
    return (
      <table style={styles.table}>
        <thead style={styles.tableHeaderComponent}>
          <tr>
            <th />
            {checkKeys.map((element) => {
              const question = getQuestionTranslated(
                element.categoryId,
                element.questionId,
              );
              return (
                <th
                  style={styles.tableHead}
                  key={element.categoryId + element.questionId}
                >
                  {question?.name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{lineData}</tbody>
      </table>
    );
  };

  return (
    <div style={styles.innerContainer} ref={ref}>
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
      <DashboardElementScrollIndicator elementKey={elementKey}>
        {generateImageTable()}
      </DashboardElementScrollIndicator>
      {lineData.length === 0 && (
        <div style={styles.noData}>{t('DASHBOARD_CHECKKEYS_NODATA')}</div>
      )}
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  icon: CSSProperties;
  timeSpan: CSSProperties;
  icons: CSSProperties;
  table: CSSProperties;
  tableHead: CSSProperties;
  tableDate: CSSProperties;
  tableData: CSSProperties;
  tableHeaderComponent: CSSProperties;
  noData: CSSProperties;
};

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 600,
    minHeight: 400,
    margin: 8,
  },
  innerContainer: {
    padding: 8,
    borderRadius: 8,
    height: '100%',
    boxShadow: '0 1px 2px',
    backgroundColor: dark_gray,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'auto',
  },
  icon: {marginLeft: 16, color: white},
  timeSpan: {...sharedStyle.textStyle.title2, marginBottom: 5},
  icons: {display: 'flex', flexDirection: 'row'},
  table: {
    borderCollapse: 'collapse',
    maxWidth: '95%',
  },
  tableHead: {
    textAlign: 'center',
    fontSize: 16,
    ...sharedStyle.textStyle.title2,
  },
  tableDate: {
    textAlign: 'left',
    fontSize: 16,
    ...sharedStyle.textStyle.title2,
  },
  tableHeaderComponent: {
    position: 'sticky',
    top: -1, // is needed to close gap on top of table
    background: dark_gray,
    zIndex: 1,
  },
  tableData: {
    textAlign: 'center',
    padding: 8,
    fontSize: 16,
  },
  noData: {
    flex: 1,
    ...sharedStyle.textStyle.title2,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
};
