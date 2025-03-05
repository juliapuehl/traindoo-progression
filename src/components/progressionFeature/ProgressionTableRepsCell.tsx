import {TableCell, Typography} from '@mui/material';
import {CSSProperties, useState} from 'react';
import {light_gray, white} from '../../styles/colors';
import {useTrackingSession} from './model/useTrackingSession';

type Props = {
  accepted: boolean;
  progressionDataRow: any;
  modifiedReps: (modifiedValue) => void;
};

export const ProgressionTableRepsCell = (props: Props) => {
  const {registerUserInput} = useTrackingSession();
  const [modifiedRepsAllSets, setModifiedRepsAllSets] = useState(
    props.progressionDataRow.reps,
  );
  modifiedRepsAllSets?.sort((setA, setB) => {
    return setA.set - setB.set;
  });

  const handleChange = (value: string, index: number) => {
    registerUserInput(
      'modified reps on ' +
        props.progressionDataRow.day +
        ' for ' +
        props.progressionDataRow.exerciseName,
      JSON.stringify(modifiedRepsAllSets[index].reps),
      JSON.stringify(value),
    );
    const newModifiedRepsAllSets = [...modifiedRepsAllSets];
    newModifiedRepsAllSets[index].reps = value;
    setModifiedRepsAllSets(newModifiedRepsAllSets);
    props.modifiedReps(newModifiedRepsAllSets);
  };

  return (
    <TableCell align="center" style={{verticalAlign: 'top'}}>
      {props.accepted
        ? modifiedRepsAllSets?.map((set, index) => {
            return (
              <div key={index} style={styles.dummyField}>
                <Typography key={index} color={white} padding={0.6}>
                  {set.reps}
                </Typography>
              </div>
            );
          })
        : modifiedRepsAllSets?.map((set, index) => {
            return (
              <div key={index} style={{padding: 2}}>
                <input
                  style={styles.inputField}
                  defaultValue={set.reps}
                  value={set.reps}
                  type="string"
                  onChange={(event) => handleChange(event.target.value, index)}
                  id={'newReps'}
                />
              </div>
            );
          })}
    </TableCell>
  );
};

type Styles = {
  inputField: CSSProperties;
  outerDiv: CSSProperties;
  innerDiv: CSSProperties;
  dummyField: CSSProperties;
};
const styles: Styles = {
  inputField: {
    textAlign: 'center',
    width: 100,
    height: 30,
    fontWeight: 300,
    fontSize: 14,
    color: white,
    borderRadius: '0.5rem',
    backgroundColor: light_gray,
  },
  outerDiv: {
    display: 'flex',
    justifyContent: 'center',
  },
  innerDiv: {
    display: 'flex',
    flexDirection: 'column',
  },
  dummyField: {
    height: 30,
    display: 'flex',
    justifyContent: 'center',
  },
};
