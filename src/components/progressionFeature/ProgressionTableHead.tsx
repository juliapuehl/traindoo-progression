import {Avatar, Button, TableCell, TableRow, Typography} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {getAllTrainings} from '../../logic/firestore';
import {medium_gray, primary_green, white} from '../../styles/colors';
import {useTrackingSession} from './model/useTrackingSession';

type Props = {
  progressionData: any;
  onAcceptAllClicked: (acceptAllClicked) => void;
  avatarUrl: string;
  athleteName: string;
};

export const ProgressionTableHead = (props: Props) => {
  const [acceptAllBtnState, setAcceptAllBtnState] = useState<boolean>(false);
  const {registerUserActivity} = useTrackingSession();

  const allTrainings = useSelector(getAllTrainings);
  const getWeeksPerCycle = (trainings) => {
    const cycleWeeksArray = [];
    let week = 1;
    trainings.forEach((training, index) => {
      if (trainings[index + 1] !== undefined) {
        if (training.trainingCycle !== trainings[index + 1].trainingCycle) {
          cycleWeeksArray.push({
            cycle: training.trainingCycle,
            week: week,
          });
          week = 1;
        } else {
          week++;
        }
      } else {
        cycleWeeksArray.push({
          cycle: training.trainingCycle,
          week: week,
        });
      }
    });
    return cycleWeeksArray;
  };

  const absoluteToRelativeWeekNr = (weekNr) => {
    const weeksPerCycle = getWeeksPerCycle(allTrainings);
    let relWeekNr = weekNr;
    weeksPerCycle.pop();
    weeksPerCycle.forEach((cycleWeeksPair) => {
      relWeekNr = relWeekNr - cycleWeeksPair.week;
    });
    return relWeekNr;
  };

  const findAbsoluteWeekNr = () => {
    let index = 0;
    while (index < props.progressionData.length) {
      if (props.progressionData[index]?.weeks) {
        return props.progressionData[index]?.weeks[
          props.progressionData[index]?.weeks?.length - 1
        ];
      }
      index++;
    }
  };
  const absoluteWeekNr = findAbsoluteWeekNr();

  const relativeWeekNr = absoluteToRelativeWeekNr(absoluteWeekNr);
  const lastWeekHasData = allTrainings.length == absoluteWeekNr ? true : false;

  const handleAcceptAllBtn = async () => {
    registerUserActivity('accept all clicked', String(!acceptAllBtnState));
    props.onAcceptAllClicked(!acceptAllBtnState);
    setAcceptAllBtnState(!acceptAllBtnState);
  };

  return (
    <TableRow>
      <TableCell sx={{width: '20%', backgroundColor: medium_gray}}>
        <div style={styles.avatarDiv}>
          <Avatar src={props.avatarUrl} sx={styles.avatar} />
        </div>
        <div style={styles.avatarDiv}>
          <Typography style={{color: white}}>{props.athleteName}</Typography>
        </div>
      </TableCell>
      <TableCell align="center" sx={styles.mainCell}>
        <div style={styles.mainCellContent}>
          <Typography>{t('PROGRESSION_TABLE_LOAD_HEADER')}</Typography>
          {lastWeekHasData ? (
            <Typography>{t('PROGRESSION_TABLE_PREV_WEEK_HEADER')}</Typography>
          ) : (
            <Typography>
              {t('PROGRESSION_TABLE_WEEK_HEADER') +
                ' ' +
                String(relativeWeekNr)}
            </Typography>
          )}
        </div>
      </TableCell>
      <TableCell align="center" sx={{...styles.mainCell, width: '5%'}}>
        <div style={styles.mainCellContent}>
          <Typography>{t('PROGRESSION_TREND')}</Typography>
        </div>{' '}
      </TableCell>
      <TableCell align="center" sx={styles.mainCell}>
        <div style={styles.mainCellContent}>
          <Typography>{t('PROGRESSION_TABLE_LOAD_HEADER')}</Typography>
          <Typography>{t('PROGRESSION_TABLE_UP_WEEK_HEADER')}</Typography>
        </div>
      </TableCell>
      <TableCell align="center" sx={styles.mainCell}>
        <div style={styles.mainCellContent}>
          <Typography>{t('PROGRESSION_TABLE_REPS_HEADER')}</Typography>
          {lastWeekHasData ? (
            <Typography>{t('PROGRESSION_TABLE_PREV_WEEK_HEADER')}</Typography>
          ) : (
            <Typography>
              {t('PROGRESSION_TABLE_WEEK_HEADER') +
                ' ' +
                String(relativeWeekNr)}
            </Typography>
          )}
        </div>
      </TableCell>
      <TableCell align="center" sx={styles.mainCell}>
        <div style={styles.mainCellContent}>
          <Typography>{t('PROGRESSION_TABLE_RPE_HEADER')}</Typography>
          {lastWeekHasData ? (
            <Typography>{t('PROGRESSION_TABLE_PREV_WEEK_HEADER')}</Typography>
          ) : (
            <Typography>
              {t('PROGRESSION_TABLE_WEEK_HEADER') +
                ' ' +
                String(relativeWeekNr)}
            </Typography>
          )}
        </div>
      </TableCell>
      <TableCell align="center" sx={styles.cellTextLight}>
        {' '}
      </TableCell>
      <TableCell
        align="center"
        sx={{...styles.cellTextLight, verticalAlign: 'bottom'}}
      >
        {t('PROGRESSION_ACCEPT')}
      </TableCell>
      <TableCell
        sx={{...styles.cellTextLight, verticalAlign: 'bottom', width: '10%'}}
      >
        <Button style={styles.acceptAllBtn} onClick={handleAcceptAllBtn}>
          <Typography style={{lineHeight: '20px'}}>
            {t('PROGRESSION_ACCEPT_ALL')}
          </Typography>
        </Button>
      </TableCell>
    </TableRow>
  );
};

type Styles = {
  acceptAllBtn: CSSProperties;
  cellTextLight: CSSProperties;
  mainCell: CSSProperties;
  mainCellContent: CSSProperties;
  avatarDiv: CSSProperties;
  avatar: CSSProperties;
};

const styles: Styles = {
  acceptAllBtn: {
    maxWidth: '100px',
    minWidth: '100px',
    borderRadius: '0.5rem',
    color: white,
    background: primary_green,
    textTransform: 'none',
  },
  mainCell: {
    padding: 2,
    width: '15%',
    verticalAlign: 'bottom',
    backgroundColor: medium_gray,
  },
  mainCellContent: {
    fontWeight: 1000,
    color: white,
    display: 'inline-block',
    justifyContent: 'center',
  },
  cellTextLight: {
    padding: 1,
    fontWeight: 100,
    color: white,
    width: 2,
    backgroundColor: medium_gray,
    verticalAlign: 'bottom',
  },
  avatarDiv: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  avatar: {
    height: '70px',
    width: '70px',
  },
};
