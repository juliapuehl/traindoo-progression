import {Alert} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {t} from 'i18n-js';
import _ from 'lodash';
import {CSSProperties, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {
  getSelectedTrainingIndex,
  getSpecificWeightAvg,
} from '../store/trainingSlice';
import {light_gray, sidebar_color_dark, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {OneRMFormula} from './OneRMFormula';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: sidebar_color_dark,
  border: '2px solid #000',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
  maxHeight: '95%',
  overflow: 'auto',
};

type Props = {
  open: boolean;
  handleClose: () => void;
  oneRMValue: number;
  exerciseName: string;
};

const baseValues = [
  1, 0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68,
  0.653, 0.626, 0.599, 0.584, 0.57, 0.557, 0.544, 0.532, 0.52, 0.509, 0.498,
  0.488, 0.477, 0.468, 0.458, 0.449, 0.44, 0.432,
];

const baseValuesCalisthenics = [
  [1, 0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707],
  [
    0.9775, 0.9385, 0.907, 0.8775, 0.85, 0.824, 0.7985, 0.774, 0.7505, 0.723,
    0.6935,
  ],
  [0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68],
  [
    0.9385, 0.907, 0.8775, 0.85, 0.824, 0.7985, 0.774, 0.7505, 0.723, 0.6935,
    0.6665,
  ],
  [0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653],
  [
    0.907, 0.8775, 0.85, 0.824, 0.7985, 0.774, 0.7505, 0.723, 0.6935, 0.6665,
    0.6395,
  ],
  [0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626],
  [
    0.8775, 0.85, 0.824, 0.7985, 0.774, 0.7505, 0.723, 0.6935, 0.6665, 0.6395,
    0.6125,
  ],
  [0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626, 0.599],
  [
    0.85, 0.824, 0.7985, 0.774, 0.7505, 0.723, 0.6935, 0.6665, 0.6395, 0.6125,
    0.5915,
  ],
];

export const RPETableModal = (props: Props) => {
  const [showNotification, setShowNotification] = useState('');
  const [oneRM, setOneRM] = useState(props.oneRMValue);
  const isCalisthenics =
    props.exerciseName === t('PLANNING_ONERM_MUSCLE_UP') ||
    props.exerciseName === t('PLANNING_ONERM_DIP') ||
    props.exerciseName === t('PLANNING_ONERM_PULL_UP');
  const currentWeekIndex = useSelector(getSelectedTrainingIndex);
  const thisWeekWeightAvg = useSelector((state: RootState) =>
    getSpecificWeightAvg(state, currentWeekIndex),
  );
  const lastWeekWeightAvg = useSelector((state: RootState) =>
    getSpecificWeightAvg(state, currentWeekIndex - 1),
  );
  const weightAvgRounded = thisWeekWeightAvg
    ? Math.round(thisWeekWeightAvg * 100) / 100
    : Math.round(lastWeekWeightAvg * 100) / 100;
  const [bw, setBw] = useState(
    weightAvgRounded ? weightAvgRounded.toString() : '80',
  );
  useEffect(() => {
    setOneRM(props.oneRMValue);
  }, [props.oneRMValue]);
  const handleNotification = (value: string) => {
    setShowNotification(t('PLANNING_RPE_TABLE_ALERT_COPY', {value: value}));
    setTimeout(() => setShowNotification(''), 1500);
  };

  const RPEButtons = () => {
    let i = 0;
    const result = [];
    result.push(
      <div style={styles.column} key={'row'}>
        <div style={styles.rowLabel}>{t('PLANNING_RPE_TABLE_RIR')}</div>
        {_.range(10).map((index) => (
          <div key={'row' + index} style={styles.rowLabel}>
            {index / 2}
          </div>
        ))}
      </div>,
    );
    result.push(
      <div style={styles.column} key={'column'}>
        <div style={styles.rowLabel}>{t('PLANNING_RPE_TABLE_RPE')}</div>
        {_.range(10).map((index) => (
          <div style={styles.rowLabel} key={'column' + index}>
            {10 - index / 2}
          </div>
        ))}
      </div>,
    );
    while (i < 11) {
      let tableIndex = i;
      result.push(
        <div style={styles.column} key={'result' + i}>
          <div style={styles.rowLabel}>{i + 1}</div>
          {_.range(10).map((index: number) => {
            let value = 0;

            if (isCalisthenics) {
              value = baseValuesCalisthenics[index][tableIndex];
            } else {
              if (index === 0) {
                value = baseValues[tableIndex];
                tableIndex += 1;
              } else if (index % 2 === 0) {
                value = baseValues[tableIndex];
                tableIndex += 1;
              } else {
                value =
                  baseValues[tableIndex] +
                  (baseValues[tableIndex - 1] - baseValues[tableIndex]) / 2;
              }
            }

            let finalValue;
            if (isCalisthenics) {
              finalValue =
                Math.floor(
                  ((oneRM + parseFloat(bw)) * value - parseFloat(bw)) * 10,
                ) / 10;
            } else {
              finalValue = Math.floor(oneRM * value * 10) / 10;
            }
            return (
              <Button
                key={i}
                onClick={() => {
                  navigator.clipboard.writeText(finalValue + '');
                  handleNotification(finalValue + '');
                }}
                style={styles.buttonStyle}
              >
                <div style={styles.valueLabel}>{finalValue}</div>
                <div style={styles.percentLabel}>
                  {Math.floor(value * 1000) / 10 + '%'}
                </div>
              </Button>
            );
          })}
        </div>,
      );
      i += 1;
    }
    return (
      <div style={styles.row} key={'resultKey'}>
        {result}
      </div>
    );
  };
  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => props.handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            textAlign="center"
            color={white}
          >
            {t('PLANNING_RPE_TABLE_TITLE', {exercise: props.exerciseName})}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h2"
            textAlign="center"
            color={white}
          >
            {t('PLANNING_RPE_TABLE_SUBTITLE')}
          </Typography>
          <div style={styles.rowLabel}>{t('PLANNING_RPE_TABLE_REPS')}</div>
          {RPEButtons()}

          <div style={styles.alertContainer}>
            {showNotification && (
              <Alert severity="success">{showNotification}</Alert>
            )}
          </div>
          <OneRMFormula
            bw={parseFloat(bw)}
            load={props.oneRMValue}
            oneRM={oneRM}
            changeOneRM={setOneRM}
            isCalisthenics={isCalisthenics}
            setBw={(number) => {
              setBw(number.toString());
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};

type Styles = {
  buttonStyle: CSSProperties;
  column: CSSProperties;
  row: CSSProperties;
  percentLabel: CSSProperties;
  valueLabel: CSSProperties;
  rowLabel: CSSProperties;
  columnLabel: CSSProperties;
  alertContainer: CSSProperties;
};

const styles: Styles = {
  buttonStyle: {
    borderRadius: 0,
    padding: 0,
    margin: 1,
    background: light_gray,
    display: 'flex',
    flexDirection: 'column',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  percentLabel: {
    ...sharedStyle.textStyle.regular_small,
  },
  valueLabel: {marginBottom: -8},
  rowLabel: {
    ...sharedStyle.textStyle.title2,
    height: 37.5,
    marginBottom: 1,
    marginTop: 1,
    marginRight: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnLabel: {
    ...sharedStyle.textStyle.title2,
    height: 37.5,
    width: 64,
    margin: 1,
    marginBottom: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    height: 50,
    marginTop: 16,
    display: 'flex',
    justifyContent: 'center',
  },
};
