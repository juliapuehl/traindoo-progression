import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import {
  checkValueMultipleDocumentQuery,
  getSpecificGraphData,
} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {dark_gray} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {DailyCheckDashboardElementType} from '../types/DashboardLayout';
import {DashboardElementHeadline} from './DashboardElementHeadline';
import {DashboardElementScrollIndicator} from './DashboardElementScrollIndicator';
import {DashboardElementTextCards} from './DashboardElementTextCards';
import {DashboardElementTextTable} from './DashboardElementTextTable';
import {DashboardElementValueControl} from './DashboardElementValueControl';
type Props = {
  element: DailyCheckDashboardElementType;
  remove: () => void;
  setElementStatic: (elementKey: string, value: boolean) => void;
};

export const DashboardTextComponent = (props: Props) => {
  const {
    editable,
    questionKey,
    endDate,
    startDate,
    elementKey,
    timeFrame,
    name,
    cardMode,
    type,
  } = props.element;

  const dataObject: {
    [key: string]: {name: string; [questionId: string]: string};
  } = {};

  const athleteUserId = useSelector(getCurrentAthleteId);
  useFirestoreConnect(
    questionKey && athleteUserId
      ? checkValueMultipleDocumentQuery(
          athleteUserId,
          [questionKey.questionId],
          elementKey,
        )
      : [],
  );
  const graphData = useSelector((state: RootState) =>
    getSpecificGraphData(state, elementKey),
  );
  if (graphData) {
    const question = Object.values(graphData)[0] as {
      id: string;
      values: Array<{
        checkId: string;
        value: string;
      }>;
    };

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

  const changeEditable = () => {
    const newEditable = editable !== undefined ? !editable : false;
    props.setElementStatic(elementKey, newEditable);
  };

  return (
    <div style={styles.container}>
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
        questionId={questionKey?.questionId}
        name={name}
        type={type}
      />
      {Object.values(dataObject).length ? (
        <DashboardElementScrollIndicator elementKey={elementKey}>
          {cardMode ? (
            <DashboardElementTextCards
              questionId={questionKey?.questionId}
              categoryId={questionKey?.categoryId}
              data={Object.values(dataObject)}
              startDate={startDate}
              endDate={endDate}
            />
          ) : (
            <DashboardElementTextTable
              questionId={questionKey?.questionId}
              categoryId={questionKey?.categoryId}
              data={Object.values(dataObject)}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </DashboardElementScrollIndicator>
      ) : (
        <div style={styles.noData}>{t('DASHBOARD_CHECKKEYS_NODATA')}</div>
      )}
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  noData: CSSProperties;
};

const styles: Styles = {
  container: {
    padding: 8,
    borderRadius: 8,
    boxShadow: '0 1px 2px',
    flexGrow: 2,
    height: '100%',
    backgroundColor: dark_gray,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'auto',
  },
  noData: {
    flex: 1,
    ...sharedStyle.textStyle.title2,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
};
