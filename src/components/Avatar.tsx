import Avatar from '@mui/material/Avatar';
import {Theme} from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

type Props = {
  large?: boolean;
  src: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    large: {
      width: 100,
      height: 100,
    },
    small: {
      width: 64,
      height: 64,
    },
  }),
);

const AvatarImg = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar
        alt="Remy Sharp"
        src={props.src}
        className={props.large ? classes.large : classes.small}
      />
    </div>
  );
};

export default AvatarImg;
