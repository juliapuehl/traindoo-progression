import {ArrowDropDown, ArrowDropUp} from '@mui/icons-material';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, Fragment, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import {
  checkValueMultipleDocumentQuery,
  getCheckCategoryLibrary,
  getDailyCheckValueQuestions,
  getSpecificGraphData,
} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {RootState} from '../store/store';
import {dark_gray, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {useGetUnitValueFrontend} from '../traindoo_shared/units/useUnits';
import {CheckValueDocumentType} from '../types/CheckValues';
import IconWithTooltip from './IconWithTooltip';
import {LineGraphComponent} from './LineGraphComponent';
import SimpleSelect from './SimpleSelect';
import TraindooDatePicker from './TraindooDatePicker';

export const DailyCheckGraphComponent = () => {
  const valueQuestions = useSelector(getDailyCheckValueQuestions);
  const [dataLabel, setDataLabel] = useState(valueQuestions[0]?.questionId);
  const [timeFrame, setTimeFrame] = useState(t('GRAPHS_SELECTOR_ALL_TIME'));
  const [extended, setExtended] = useState(false);
  const [startDate, setStartDate] = useState(
    moment().subtract(1, 'M').toISOString(),
  );
  const [endDate, setEndDate] = useState(moment().toISOString());
  const athleteUserId = useSelector(getCurrentAthleteId);
  const categoryLibrary = useSelector(getCheckCategoryLibrary);
  const getValueFrontend = useGetUnitValueFrontend();
  useFirestoreConnect(
    dataLabel && athleteUserId
      ? checkValueMultipleDocumentQuery(
          athleteUserId,
          [dataLabel],
          'dailyGraph',
        )
      : [],
  );

  const graphData: {[checkKey: string]: CheckValueDocumentType} = useSelector(
    (state: RootState) => getSpecificGraphData(state, 'dailyGraph'),
  );

  let minDate: string | undefined;
  let timeFrameDates: {startDate: string; endDate: string} | undefined =
    undefined;
  let showTimePicker = false;
  switch (timeFrame) {
    case t('GRAPHS_SELECTOR_ALL_TIME'):
      minDate = undefined;

      break;
    case t('GRAPHS_SELECTOR_THIRTY'):
      minDate = moment().subtract(31, 'days').toISOString();

      break;
    case t('GRAPHS_SELECTOR_NINETY'):
      minDate = moment().subtract(91, 'days').toISOString();

      break;
    case t('GRAPHS_SELECTOR_CUSTOM'):
      minDate = undefined;

      timeFrameDates = {startDate: startDate, endDate: endDate};
      showTimePicker = true;
      break;
    default:
      minDate = undefined;

      timeFrameDates = undefined;
      break;
  }

  const handleDataChange = (value) => {
    setDataLabel(value);
  };
  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  const dataArray = [];
  if (graphData) {
    const question = Object.values(graphData)[0];
    const unit =
      categoryLibrary[question.categoryId]?.questions[question.questionId]
        ?.unit;

    if (question.values) {
      for (const value of Object.values(question.values).sort((a, b) =>
        moment(a.checkId, 'YYYY-MM-DD').diff(moment(b.checkId, 'YYYY-MM-DD')),
      )) {
        const valueDate = moment(value.checkId, 'YYYY-MM-DD');
        if (
          (!minDate && !timeFrameDates) ||
          (minDate && valueDate.isAfter(moment(minDate))) ||
          (timeFrameDates &&
            valueDate.isAfter(moment(timeFrameDates.startDate)) &&
            valueDate.isBefore(moment(timeFrameDates.endDate)))
        )
          dataArray.push({
            name: valueDate.format('L'),
            value: getValueFrontend(unit, value.value),
          });
      }
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.headline}>
          {t('PLANNING_GRAPH')}
          <IconWithTooltip
            muiIcon={extended ? ArrowDropUp : ArrowDropDown}
            style={styles.arrowStyle}
            onClick={() => {
              setExtended(!extended);
            }}
          />
        </div>
        {extended && (
          <Fragment>
            <div style={styles.selectorContainer}>
              <SimpleSelect
                items={valueQuestions.map((question) => {
                  return {label: question.label, value: question.questionId};
                })}
                value={dataLabel ? dataLabel : ''}
                label={t('GRAPHS_SELECTOR_TITLE')}
                onChange={(value) => {
                  handleDataChange(value);
                }}
                style={styles.dataSelector}
              />
              <SimpleSelect
                items={[
                  {
                    label: t('GRAPHS_SELECTOR_ALL_TIME'),
                    value: t('GRAPHS_SELECTOR_ALL_TIME'),
                  },
                  {
                    label: t('GRAPHS_SELECTOR_THIRTY'),
                    value: t('GRAPHS_SELECTOR_THIRTY'),
                  },

                  {
                    label: t('GRAPHS_SELECTOR_NINETY'),
                    value: t('GRAPHS_SELECTOR_NINETY'),
                  },
                  {
                    label: t('GRAPHS_SELECTOR_CUSTOM'),
                    value: t('GRAPHS_SELECTOR_CUSTOM'),
                  },
                ]}
                value={timeFrame ? timeFrame : ''}
                label={t('GRAPHS_SELECTOR_TITLE_TIME')}
                onChange={(value) => {
                  handleTimeFrameChange(value);
                }}
                style={styles.timeSelector}
              />
              {showTimePicker && (
                <Fragment>
                  <TraindooDatePicker
                    value={startDate}
                    handleChange={(value: string) => setStartDate(value)}
                    headline={t('GRAPHS_TIMEFRAME_START')}
                    style={styles.dataSelector}
                    maxDate={new Date(endDate)}
                  />
                  <TraindooDatePicker
                    value={endDate}
                    handleChange={(value: string) => setEndDate(value)}
                    headline={t('GRAPHS_TIMEFRAME_END')}
                    style={styles.dataSelector}
                    minDate={new Date(startDate)}
                  />
                </Fragment>
              )}
            </div>
            <LineGraphComponent
              data={dataArray}
              dataNames={['value']}
              width={'100%'}
              height={300}
            />
          </Fragment>
        )}
      </div>
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  selectorContainer: CSSProperties;
  dataSelector: CSSProperties;
  timeSelector: CSSProperties;
  arrowStyle: CSSProperties;
  headline: CSSProperties;
};

const styles: Styles = {
  container: {
    paddingTop: 12,
    marginLeft: 8,
    marginRight: 8,
    flexGrow: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  innerContainer: {
    backgroundColor: dark_gray,
    padding: 8,
    borderRadius: 8,
    boxShadow: '0 1px 2px',
    flexGrow: 2,
    minWidth: 'fit-content',
  },
  selectorContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  dataSelector: {
    marginLeft: 16,
    marginRight: 16,
    maxWidth: 300,
    marginBottom: 32,
  },
  timeSelector: {maxWidth: 300, marginBottom: 32},
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
};
