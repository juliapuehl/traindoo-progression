import {XMarkIcon} from '@heroicons/react/20/solid';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {
  getExerciseHistoryData,
  getExerciseName,
  getSelectedCycleIndex,
} from '../store/trainingSlice';
import {LineGraphComponent} from './LineGraphComponent';
import {ReactDatePicker} from './ReactDatePicker';
import {TailwindDropdown} from './TailwindDropdown';
import {IconButton} from './tailwind/buttons/IconButton';

type Props = {
  exerciseIndex: number;
  setShowGraph: () => void;
  exerciseName?: string;
};

export const WorkoutGraphComponent = (props: Props) => {
  const [dataLabel, setDataLabel] = useState(t('GRAPHS_TOTAL_WEIGHT'));
  const [timeFrame, setTimeFrame] = useState(t('GRAPHS_SELECTOR_ALL_TIME'));
  const [startDate, setStartDate] = useState(
    moment().subtract(1, 'M').toISOString(),
  );
  const [endDate, setEndDate] = useState(moment().toISOString());
  let exerciseName = useSelector((state: RootState) =>
    getExerciseName(state, props.exerciseIndex),
  );
  exerciseName = props.exerciseName ? props.exerciseName : exerciseName;

  const currentCycle = useSelector(getSelectedCycleIndex);

  let minDate: string | undefined;
  let onlySpecificCycle: number | undefined;
  let timeFrameDates: {startDate: string; endDate: string} | undefined;
  let showTimePicker = false;
  switch (timeFrame) {
    case t('GRAPHS_SELECTOR_ALL_TIME'):
      minDate = undefined;
      onlySpecificCycle = undefined;
      break;
    case t('GRAPHS_SELECTOR_THIRTY'):
      minDate = moment().subtract(31, 'days').toISOString();
      onlySpecificCycle = undefined;
      break;
    case t('GRAPHS_SELECTOR_NINETY'):
      minDate = moment().subtract(91, 'days').toISOString();
      onlySpecificCycle = undefined;
      break;
    case t('GRAPHS_SELECTOR_CYCLE'):
      minDate = undefined;
      onlySpecificCycle = currentCycle;
      break;
    case t('GRAPHS_SELECTOR_CUSTOM'):
      minDate = undefined;
      onlySpecificCycle = undefined;
      timeFrameDates = {startDate: startDate, endDate: endDate};
      showTimePicker = true;
      break;
    default:
      minDate = undefined;
      onlySpecificCycle = undefined;
      break;
  }

  const exerciseHistoryData = useSelector((state: RootState) =>
    getExerciseHistoryData(
      state,
      exerciseName,
      minDate,
      onlySpecificCycle,
      timeFrameDates,
    ),
  );
  const weightData = [];
  exerciseHistoryData.forEach((data) => {
    if (data.totalWeight) {
      weightData.push({
        name: data?.date ? moment(data?.date).format('l') : '-',
        [t('GRAPHS_TOTAL_WEIGHT')]: data.totalWeight,
      });
    }
  });
  const oneRMData = [];
  exerciseHistoryData.forEach((data) => {
    if (data.max1RM) {
      let roundedMax1RM = data.max1RM;
      roundedMax1RM = Math.round(roundedMax1RM * 10) / 10;
      oneRMData.push({
        name: data?.date ? moment(data?.date).format('l') : '-',
        [t('GRAPHS_ONE_RM')]: roundedMax1RM,
      });
    }
  });
  const amountSets = [];
  exerciseHistoryData.forEach((data) => {
    if (data.amountSets) {
      amountSets.push({
        name: data?.date ? moment(data?.date).format('l') : '-',
        [t('GRAPHS_AMOUNT_SETS')]: data.amountSets,
      });
    }
  });
  const totalRepsData = [];
  exerciseHistoryData.forEach((data) => {
    if (data.totalReps) {
      totalRepsData.push({
        name: data?.date ? moment(data?.date).format('l') : '-',
        [t('GRAPHS_AMOUNT_REPS')]: data.totalReps,
      });
    }
  });
  const maxWeightData = [];
  exerciseHistoryData.forEach((data) => {
    if (data.totalReps) {
      maxWeightData.push({
        name: data?.date ? moment(data?.date).format('l') : '-',
        [t('GRAPHS_MAX_WEIGHT')]: data.maxWeight,
      });
    }
  });
  const handleDataChange = (value) => {
    setDataLabel(value);
  };
  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  let displayedData;
  switch (dataLabel) {
    case t('GRAPHS_TOTAL_WEIGHT'):
      displayedData = weightData;
      break;
    case t('GRAPHS_ONE_RM'):
      displayedData = oneRMData;
      break;
    case t('GRAPHS_AMOUNT_SETS'):
      displayedData = amountSets;
      break;
    case t('GRAPHS_AMOUNT_REPS'):
      displayedData = totalRepsData;
      break;
    case t('GRAPHS_MAX_WEIGHT'):
      displayedData = maxWeightData;
      break;
    default:
      displayedData = weightData;
      break;
  }

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.selectorContainer} className={'space-x-1'}>
          <TailwindDropdown
            values={[
              {
                label: t('GRAPHS_TOTAL_WEIGHT'),
                value: t('GRAPHS_TOTAL_WEIGHT'),
              },
              {label: t('GRAPHS_ONE_RM'), value: t('GRAPHS_ONE_RM')},

              {
                label: t('GRAPHS_AMOUNT_REPS'),
                value: t('GRAPHS_AMOUNT_REPS'),
              },
              {
                label: t('GRAPHS_AMOUNT_SETS'),
                value: t('GRAPHS_AMOUNT_SETS'),
              },
              {
                label: t('GRAPHS_MAX_WEIGHT'),
                value: t('GRAPHS_MAX_WEIGHT'),
              },
            ]}
            initialValue={{
              label: t('GRAPHS_TOTAL_WEIGHT'),
              value: t('GRAPHS_TOTAL_WEIGHT'),
            }}
            setNewValue={(value) => {
              handleDataChange(value);
            }}
          />
          <TailwindDropdown
            values={[
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
                label: t('GRAPHS_SELECTOR_CYCLE'),
                value: t('GRAPHS_SELECTOR_CYCLE'),
              },
              {
                label: t('GRAPHS_SELECTOR_CUSTOM'),
                value: t('GRAPHS_SELECTOR_CUSTOM'),
              },
            ]}
            initialValue={{
              label: t('GRAPHS_SELECTOR_ALL_TIME'),
              value: t('GRAPHS_SELECTOR_ALL_TIME'),
            }}
            setNewValue={(value) => {
              handleTimeFrameChange(value);
            }}
          />

          {showTimePicker && (
            <ReactDatePicker
              changeStartDate={(value: string) => setStartDate(value)}
              changeEndDate={(value: string) => setEndDate(value)}
              initialStartDate={startDate}
              initialEndDate={endDate}
            />
          )}
        </div>
        <IconButton
          icon={XMarkIcon}
          size="lg"
          className="text-white hover:text-grey-300 hover:bg-light_gray  ml-10"
          onClick={() => props.setShowGraph()}
        />
      </div>

      <LineGraphComponent
        data={displayedData}
        dataNames={[dataLabel ? dataLabel : '']}
        width={'98%'}
        height={300}
        legend
      />
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  innerContainer: CSSProperties;
  selectorContainer: CSSProperties;
};

const styles: Styles = {
  container: {
    flexGrow: 2,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  innerContainer: {
    minWidth: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    flex: 1,
  },
};
