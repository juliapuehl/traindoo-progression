import {Add} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {CSSProperties, useState} from 'react';
import {primary_green, white} from '../styles/colors';
import {LibraryAddExerciseModal} from './exerciseLibrary/LibraryAddExerciseModal';

type Props = {
  title: string;
  style?: CSSProperties;
  onCreate: (newName: string) => void;
  intercomTarget?: string;
};

const useStyles = makeStyles({
  root: {
    background: 'grey',
    overflow: 'hidden',
    '&:hover': {
      color: white,
      backgroundColor: primary_green,
      cursor: 'pointer',
    },
  },
});

export const SearchBarAddButton = (props: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const classes = useStyles();

  return (
    <>
      <div
        onClick={() => setOpenModal(!openModal)}
        className={classes.root + ' ' + props.intercomTarget}
        data-intercom-target={props.intercomTarget}
        style={{...props.style, ...styles.container}}
      >
        <div>{props.title}</div>
        <Add />
      </div>
      <LibraryAddExerciseModal
        handleClose={() => {
          setOpenModal(false);
        }}
        onCreate={(newName: string) => props.onCreate(newName)}
        open={openModal}
      />
    </>
  );
};

type Style = {
  container: CSSProperties;
};

const styles: Style = {
  container: {
    display: 'flex',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};
