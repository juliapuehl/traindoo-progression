import {TableCell, Typography} from '@mui/material';
import {CSSProperties, useState} from 'react';
import {light_gray, white} from '../../styles/colors';
import {useTrackingSession} from './model/useTrackingSession';

type Props = {
  accepted: boolean;
  progressionDataRow: any;
  modifiedRpe: (modifiedValue) => void;
  useRir: boolean;
};

export const ProgressionTableRpeCell = (props: Props) => {
  const {registerUserInput} = useTrackingSession();
  const [modifiedRpeAllSets, setModifiedRpeAllSets] = useState(
    props.progressionDataRow.rpe,
  );
  const useRir = props.useRir;
  modifiedRpeAllSets?.sort((setA, setB) => {
    return setA.set - setB.set;
  });

  const handleChange = (value: string, index: number) => {
    registerUserInput(
      'modified rpe on ' +
        props.progressionDataRow.day +
        ' for ' +
        props.progressionDataRow.exerciseName,
      JSON.stringify(modifiedRpeAllSets[index].rpe),
      JSON.stringify(value),
    );
    const newModifiedRpeAllSets = [...modifiedRpeAllSets];
    newModifiedRpeAllSets[index].rpe = value;
    setModifiedRpeAllSets(newModifiedRpeAllSets);
    props.modifiedRpe(newModifiedRpeAllSets);
  };

  return (
    <TableCell align="center" style={{verticalAlign: 'top'}}>
      {props.accepted
        ? modifiedRpeAllSets?.map((set, index) => {
            return (
              <div key={index} style={styles.dummyField}>
                <Typography key={index} color={white} padding={0.6}>
                  {set.rpe}
                </Typography>
              </div>
            );
          })
        : modifiedRpeAllSets?.map((set, index) => {
            return (
              <div key={index} style={styles.outerDiv}>
                <Typography
                  color={white}
                  paddingTop={1}
                  paddingRight={0.5}
                  fontSize={12}
                >
                  {useRir ? 'RIR' : 'RPE'}
                </Typography>
                <div style={{padding: 2}}>
                  <input
                    style={styles.inputField}
                    defaultValue={set.rpe}
                    value={set.rpe}
                    type="string"
                    onChange={(event) =>
                      handleChange(event.target.value, index)
                    }
                    id={'newReps'}
                  />
                </div>
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
    width: 50,
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
