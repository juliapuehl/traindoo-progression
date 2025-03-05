import makeStyles from '@mui/styles/makeStyles';
import {CSSProperties} from 'react';
import {primary_green, white} from '../styles/colors';

type Props = {
  title: string;
  onClick: () => void;
  style?: CSSProperties;
};

const useStyles = makeStyles({
  root: {
    background: 'grey',
    overflow: 'hidden',
    padding: 16,
    '&:hover': {
      color: white,
      backgroundColor: primary_green,
      cursor: 'pointer',
    },
  },
});

export const SearchBarEntry = (props: Props) => {
  const classes = useStyles();

  return (
    <div onClick={() => props.onClick()} className={classes.root}>
      {props.title}
    </div>
  );
};
