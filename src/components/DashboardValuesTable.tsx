import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import {v4 as uuidv4} from 'uuid';
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
import {DashboardElementScrollIndicator} from './DashboardElementScrollIndicator';
import {DashboardElementValueControl} from './DashboardElementValueControl';

type Props = {
  element: DailyCheckDashboardElementType;
  remove: () => void;
  setElementStatic: (elementKey: string, value: boolean) => void;
};

export const DashboardValuesTable = (props: Props) => {
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
  const getValueFrontend = useGetUnitValueFrontend();
  const dataObject: {[key: string]: {name: string; value: string}} = {};
  const questionColors = useSelector(getDailyDashboardColorInfo);
  const categoryLibrary = useSelector(getCheckCategoryLibrary);
  const athleteUserId = useSelector(getCurrentAthleteId);
  const translateQuestion = useCheckTranslateQuestion();
  useFirestoreConnect(
    checkKeys.length > 0 && athleteUserId
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
  let data = [];
  if (graphData) {
    for (const question of Object.values(graphData)) {
      if (question.values) {
        const questionInfo =
          categoryLibrary[question.categoryId]?.questions[question.questionId];
        for (const value of Object.values(question.values)) {
          dataObject[value.checkId] = {
            ...dataObject[value.checkId],
            name: moment(value.checkId, 'YYYY-MM-DD').toISOString(),
            [question.id]: getValueFrontend(questionInfo?.unit, value.value),
          };
        }
      }
    }
    data = Object.values(dataObject);
  }

  const avgObject = {};
  for (const key of checkKeys) {
    avgObject[key.questionId] = {
      value: 0,
      amountData: 0,
    };
  }

  const lineData = data
    .filter(
      (element) =>
        (endDate === '' ||
          moment(element?.name).isSameOrBefore(moment(endDate))) &&
        (startDate === '' ||
          moment(element?.name).isSameOrAfter(moment(startDate))),
    )
    .sort((a, b) => moment(b?.name).diff(moment(a?.name)))
    .map((entry) => {
      return (
        <tr key={'row' + entry?.name}>
          <td style={styles.tableDate} key={uuidv4()}>
            {moment(entry?.name).format('dd. L').slice(0, 9)}
          </td>
          {checkKeys?.map((question) => {
            const key = question.questionId;
            if (entry[key] && entry[key] > 0) {
              avgObject[key].value += entry[key];
              avgObject[key].amountData += 1;
            }
            return (
              <td style={styles.tableData} key={uuidv4()}>
                {entry[key]}
              </td>
            );
          })}
        </tr>
      );
    });

  const changeEditable = () => {
    const newEditable = editable !== undefined ? !editable : false;
    props.setElementStatic(elementKey, newEditable);
  };

  return (
    <div style={styles.innerContainer}>
      <DashboardElementHeadline
        editable={editable}
        startDate={startDate}
        endDate={endDate}
        removeElement={() => props.remove()}
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
        <table style={styles.table}>
          <thead style={styles.tableHeaderComponent}>
            <tr>
              <th style={styles.tableHead} />
              {checkKeys?.map((key) => {
                const questionInfo = translateQuestion(
                  key.categoryId,
                  key.questionId,
                );
                return (
                  <th
                    style={{
                      ...styles.tableHead,
                      ...{
                        color: questionColors[key.questionId] ?? white,
                      },
                    }}
                    key={uuidv4()}
                  >
                    {questionInfo?.name}
                  </th>
                );
              })}
            </tr>
            <tr>
              {checkKeys.length !== 0 && (
                <th style={styles.tableDate} key={uuidv4()}>
                  Ø
                </th>
              )}
              {checkKeys.map((question) => {
                const key = question.questionId;
                return (
                  <th style={styles.tableData} key={uuidv4()}>
                    {avgObject[key].amountData > 0
                      ? Math.round(
                          (avgObject[key].value / avgObject[key].amountData) *
                            100,
                        ) / 100
                      : ''}
                  </th>
                );
              })}
            </tr>
            <tr>
              <th colSpan={checkKeys.length + 1}>
                <div style={styles.dividerLine} />
              </th>
            </tr>
          </thead>
          <tbody>{lineData}</tbody>
        </table>
      </DashboardElementScrollIndicator>
      {checkKeys.length === 0 && (
        <div style={styles.noData}>{t('DASHBOARD_CHECKKEYS_NODATA')}</div>
      )}
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  table: CSSProperties;
  tableHead: CSSProperties;
  tableData: CSSProperties;
  noData: CSSProperties;
  dateColumn: CSSProperties;

  dividerLine: CSSProperties;
  tableHeaderComponent: CSSProperties;
  tableDate: CSSProperties;
};

const styles: Styles = {
  tableHeaderComponent: {
    position: 'sticky',
    top: 0,
    background: dark_gray,
    zIndex: 1,
  },
  dividerLine: {
    position: 'sticky',
    borderBottomWidth: 2,
    borderBottomColor: white,
    borderBottomStyle: 'solid',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 2,
    margin: 8,
  },
  innerContainer: {
    padding: 8,
    borderRadius: 8,
    boxShadow: '0 1px 2px',
    height: '100%',
    backgroundColor: dark_gray,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
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
  tableData: {
    textAlign: 'center',
    padding: 8,
    fontSize: 16,
    ...sharedStyle.textStyle.title2,
  },
  dateColumn: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignSelf: 'flex-start',
  },
  noData: {
    flex: 1,
    ...sharedStyle.textStyle.title2,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
};
