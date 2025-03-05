import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId, webSettingsLayoutQuery} from '../logic/firestore';
import SimpleSelect from './SimpleSelect';
import TraindooDatePicker from './TraindooDatePicker';

type Props = {
  startDate: string;
  endDate: string;
  elementKey: string;
  timeFrame: string;
};

export const DashboardTimeFramePicker = (props: Props) => {
  const {startDate, endDate, elementKey, timeFrame} = props;
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const path = 'dailyCheckLayout.elements.' + elementKey;
  const startDatePath = path + '.startDate';
  const endDatePath = path + '.endDate';
  const timeFramePath = path + '.timeFrame';
  const handleTimeFrameChange = (value) => {
    switch (value) {
      case 'GRAPHS_SELECTOR_ALL_TIME':
        firestore.update(webSettingsLayoutQuery(userId), {
          [startDatePath]: '',
          [endDatePath]: '',
          [timeFramePath]: 'GRAPHS_SELECTOR_ALL_TIME',
        });
        break;
      case 'GRAPHS_SELECTOR_SEVEN':
        firestore.update(webSettingsLayoutQuery(userId), {
          [startDatePath]: moment().subtract(8, 'days').toISOString(),
          [endDatePath]: '',
          [timeFramePath]: 'GRAPHS_SELECTOR_SEVEN',
        });

        break;
      case 'GRAPHS_SELECTOR_THIRTY':
        firestore.update(webSettingsLayoutQuery(userId), {
          [startDatePath]: moment().subtract(31, 'days').toISOString(),
          [endDatePath]: '',
          [timeFramePath]: 'GRAPHS_SELECTOR_THIRTY',
        });

        break;
      case 'GRAPHS_SELECTOR_NINETY':
        firestore.update(webSettingsLayoutQuery(userId), {
          [startDatePath]: moment().subtract(91, 'days').toISOString(),
          [endDatePath]: '',
          [timeFramePath]: 'GRAPHS_SELECTOR_NINETY',
        });

        break;
      case 'GRAPHS_SELECTOR_CUSTOM':
        firestore.update(webSettingsLayoutQuery(userId), {
          [startDatePath]: '',
          [timeFramePath]: 'GRAPHS_SELECTOR_CUSTOM',
        });
        break;
      default:
        firestore.update(webSettingsLayoutQuery(userId), {
          [startDatePath]: '',
          [endDatePath]: '',
          [timeFramePath]: 'GRAPHS_SELECTOR_ALL_TIME',
        });
        break;
    }
  };

  const handleStartChange = (newValue: string) => {
    firestore.update(webSettingsLayoutQuery(userId), {
      [startDatePath]: newValue,
    });
  };

  const handleEndChange = (newValue: string) => {
    firestore.update(webSettingsLayoutQuery(userId), {
      [endDatePath]: newValue,
    });
  };
  return (
    <div style={styles.dateContainer}>
      <SimpleSelect
        items={[
          {
            label: t('GRAPHS_SELECTOR_ALL_TIME'),
            value: 'GRAPHS_SELECTOR_ALL_TIME',
          },
          {
            label: t('GRAPHS_SELECTOR_SEVEN'),
            value: 'GRAPHS_SELECTOR_SEVEN',
          },
          {
            label: t('GRAPHS_SELECTOR_THIRTY'),
            value: 'GRAPHS_SELECTOR_THIRTY',
          },

          {
            label: t('GRAPHS_SELECTOR_NINETY'),
            value: 'GRAPHS_SELECTOR_NINETY',
          },
          {
            label: t('GRAPHS_SELECTOR_CUSTOM'),
            value: 'GRAPHS_SELECTOR_CUSTOM',
          },
        ]}
        value={timeFrame ? timeFrame : 'GRAPHS_SELECTOR_ALL_TIME'}
        label={t('GRAPHS_SELECTOR_TITLE_TIME')}
        onChange={(value) => {
          handleTimeFrameChange(value);
        }}
        style={styles.timeSelector}
      />
      {timeFrame === 'GRAPHS_SELECTOR_CUSTOM' && (
        <div style={styles.dateColumn}>
          <TraindooDatePicker
            value={startDate}
            handleChange={handleStartChange}
            headline={t('GRAPHS_TIMEFRAME_START')}
            maxDate={new Date(endDate)}
            style={styles.datePicker}
          />
          <TraindooDatePicker
            value={endDate}
            handleChange={handleEndChange}
            headline={t('GRAPHS_TIMEFRAME_END')}
            minDate={new Date(startDate)}
            style={styles.datePicker}
          />
        </div>
      )}
    </div>
  );
};

type Styles = {
  dateContainer: CSSProperties;
  datePicker: CSSProperties;
  dateColumn: CSSProperties;
  timeSelector: CSSProperties;
};

const styles: Styles = {
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'end',
    marginTop: 5,
  },
  datePicker: {marginBottom: 5, marginLeft: 15},
  dateColumn: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignSelf: 'flex-start',
  },
  timeSelector: {width: 300},
};
