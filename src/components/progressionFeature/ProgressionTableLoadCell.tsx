import {TableCell, Typography} from '@mui/material';
import {CSSProperties, useState} from 'react';
import {white} from '../../styles/colors';
import {useCalculateLoadBackend} from '../../traindoo_shared/units/useCalculateLoadBackend';
import {useCalculateLoadFrontend} from '../../traindoo_shared/units/useCalculateLoadFrontend';
import {useTrackingSession} from './model/useTrackingSession';
import {ProgressionTableLoadSet} from './ProgressionTableLoadSet';

type Props = {
  accepted: boolean;
  progressionDataRow: any;
  modifiedLoad: (modifiedLoad) => void;
};

export const ProgressionTableLoadCell = (props: Props) => {
  const {registerUserInput} = useTrackingSession();
  const calculateLoadFrontend = useCalculateLoadFrontend();
  const calculateLoadBackend = useCalculateLoadBackend();
  const [modifiedLoadAllSets, setModifiedLoadAllSets] = useState(
    props.progressionDataRow.newLoad,
  );
  modifiedLoadAllSets?.sort((setA, setB) => {
    return setA.set - setB.set;
  });
  const [noLoadChange, setNoLoadChange] = useState(false);

  const handleChange = (value: string, index: number) => {
    const newValue = calculateLoadBackend(value);
    registerUserInput(
      'modified load on ' +
        props.progressionDataRow.day +
        ' for ' +
        props.progressionDataRow.exerciseName,
      JSON.stringify(modifiedLoadAllSets[index].load),
      JSON.stringify(newValue),
    );
    const newModifiedLoadAllSets = [...modifiedLoadAllSets];
    newModifiedLoadAllSets[index].load = newValue;
    setModifiedLoadAllSets(newModifiedLoadAllSets);
    props.modifiedLoad(newModifiedLoadAllSets);
  };

  const handleNoLoadChangeClicked = (load) => {
    setModifiedLoadAllSets(load);
    setNoLoadChange(!noLoadChange);
    props.modifiedLoad(load);
  };

  return (
    <TableCell align="center" style={{verticalAlign: 'top'}}>
      {props.accepted ? (
        modifiedLoadAllSets?.map((set, index) => {
          return (
            <div key={index} style={styles.dummyField}>
              <Typography color={white} padding={0.6}>
                {calculateLoadFrontend(set.load)}
              </Typography>
            </div>
          );
        })
      ) : (
        <>
          {modifiedLoadAllSets?.map((set, index) => {
            return (
              <ProgressionTableLoadSet
                key={'loadSet ' + index}
                load={set.load}
                handleChange={handleChange}
                index={index}
              />
            );
          })}
        </>
      )}
    </TableCell>
  );
};

type Styles = {
  dummyField: CSSProperties;
};

const styles: Styles = {
  dummyField: {
    height: 30,
    display: 'flex',
    justifyContent: 'center',
  },
};
