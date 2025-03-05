import QueryStatsIcon from '@mui/icons-material/QueryStats';
import {Checkbox, TableCell, TableRow, Typography} from '@mui/material';
import {cloneDeep} from 'lodash';
import {CSSProperties, Fragment, useEffect, useState} from 'react';

import {primary_green, white} from '../../styles/colors';
import {useCalculateLoadFrontend} from '../../traindoo_shared/units/useCalculateLoadFrontend';
import IconWithTooltip from '../IconWithTooltip';
import {ProgressionTrendLabel} from '../ProgressionTrendLabel';
import {WorkoutGraphComponent} from '../WorkoutGraphComponent';
import {useTrackingSession} from './model/useTrackingSession';
import {ProgressionTableLoadCell} from './ProgressionTableLoadCell';
import {ProgressionTableRepsCell} from './ProgressionTableRepsCell';
import {ProgressionTableRpeCell} from './ProgressionTableRpeCell';

type Props = {
  acceptAllBtnClicked: boolean;
  index: number;
  progressionDataRow: any;
  changeProgressionData: (newData: any) => void;
  setAccepted: () => void;
  accepted: boolean;
};

export const ProgressionTableValueRow = (props: Props) => {
  const accepted = props.accepted;
  const calculateLoadFrontend = useCalculateLoadFrontend();
  const [showGraph, setShowGraph] = useState(false);
  const oldLoad = props.progressionDataRow.oldLoad;
  oldLoad?.sort((setA, setB) => {
    return setA.set - setB.set;
  });
  const [progressionDataRow, setProgressionDataRow] = useState(
    props.progressionDataRow,
  );
  const newLoad = progressionDataRow.newLoad;
  const [newReps, setNewReps] = useState(props.progressionDataRow.reps);
  const [newRpe, setNewRpe] = useState(props.progressionDataRow.rpe);
  const {registerUserActivity} = useTrackingSession();

  const handleCheckboxClicked = () => {
    props.setAccepted();
    const newData = cloneDeep(props.progressionDataRow);
    registerUserActivity(
      newData.day + ' ' + newData.exerciseName + ' accept clicked',
      String(!accepted),
    );
    newData['newLoad'] = newLoad;
    newData['reps'] = newReps;
    newData['rpe'] = newRpe;
    props.changeProgressionData(newData);
  };

  useEffect(() => {
    if (props.acceptAllBtnClicked === true) {
      const newData = cloneDeep(props.progressionDataRow);
      newData['newLoad'] = newLoad;
      newData['reps'] = newReps;
      newData['rpe'] = newRpe;
      props.changeProgressionData(newData);
    }
  }, [props.acceptAllBtnClicked]);

  const handleSetNewLoad = (load) => {
    const newProgressionDataRow = {...props.progressionDataRow, newLoad: load};
    setProgressionDataRow(newProgressionDataRow);
  };

  return (
    <TableRow
      key={props.index}
      sx={{
        '&:last-child td, &:last-child th': {border: 0},
        height: 80,
      }}
    >
      {showGraph ? (
        <TableCell
          component="th"
          scope="row"
          sx={styles.firstCol}
          style={{verticalAlign: 'top'}}
          colSpan={7}
        >
          <WorkoutGraphComponent
            exerciseName={props.progressionDataRow.exerciseName}
            setShowGraph={() => setShowGraph(false)}
            exerciseIndex={0}
          />
        </TableCell>
      ) : (
        <Fragment>
          <TableCell
            component="th"
            scope="row"
            sx={styles.firstCol}
            style={{verticalAlign: 'top'}}
          >
            {props.progressionDataRow.exerciseName}
          </TableCell>
          <TableCell align="center" style={{verticalAlign: 'top'}}>
            {oldLoad?.map((set, index) => {
              return (
                <div key={index} style={styles.dummyField}>
                  <Typography color={white} align="center" padding={0.6}>
                    {calculateLoadFrontend(set.load)}
                  </Typography>
                </div>
              );
            })}
          </TableCell>
          <TableCell align="center">
            <ProgressionTrendLabel
              trend={props.progressionDataRow.loadChange}
            />
          </TableCell>
          <ProgressionTableLoadCell
            accepted={accepted}
            progressionDataRow={props.progressionDataRow}
            modifiedLoad={(load) => handleSetNewLoad(load)}
          />
          <ProgressionTableRepsCell
            accepted={accepted}
            progressionDataRow={props.progressionDataRow}
            modifiedReps={setNewReps}
          />
          <ProgressionTableRpeCell
            accepted={accepted}
            progressionDataRow={props.progressionDataRow}
            modifiedRpe={setNewRpe}
            useRir={props.progressionDataRow.useRir}
          />
          <TableCell align="center">
            <IconWithTooltip
              style={styles.icon}
              muiIcon={QueryStatsIcon}
              onClick={() => setShowGraph(true)}
            />
          </TableCell>
          <TableCell align="center">
            <Checkbox
              checked={accepted}
              onChange={(e) => handleCheckboxClicked()}
              sx={{
                ...styles.icon,
                '&.Mui-checked': {
                  color: primary_green,
                },
              }}
            />
          </TableCell>
        </Fragment>
      )}
    </TableRow>
  );
};

type Styles = {
  firstCol: CSSProperties;
  icon: CSSProperties;
  dummyField: CSSProperties;
};

const styles: Styles = {
  firstCol: {
    color: white,
    fontWeight: 800,
    fontSize: 16,
    maxWidth: 50,
    paddingLeft: 5,
  },
  icon: {
    color: white,
    fontSize: 'large',
  },
  dummyField: {
    height: 30,
  },
};
