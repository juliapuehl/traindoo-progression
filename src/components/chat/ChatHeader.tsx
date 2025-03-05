import {Close} from '@mui/icons-material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import Avatar from '../Avatar';

type Props = {
  onClose: () => void;
  onBackButtonClick: () => void;
  onInfoButtonClick: () => void;
  profilePic: string;
  name: string;
  lastLogin: string;
  showContactInfo: boolean;
};

export const ChatHeader = (props: Props) => {
  return (
    <Grid container sx={styles.header}>
      <Grid
        xs={1}
        item
        container
        alignItems="center"
        paddingLeft={2}
        onClick={props.onBackButtonClick}
      >
        <ArrowBackIos sx={styles.icon} />
      </Grid>
      <Grid
        xs={2.2}
        item
        container
        alignItems="center"
        onClick={props.onInfoButtonClick}
      >
        <Avatar src={props.profilePic} />
      </Grid>
      <Grid
        xs={7.8}
        item
        container
        alignItems="center"
        onClick={props.onInfoButtonClick}
      >
        <div>
          <Typography paddingLeft={1} variant="h5" color="white">
            {props.name}
          </Typography>
          <Typography paddingLeft={1} variant="subtitle2" color="white">
            {t('CHAT_LAST_ONLINE') + ' ' + props.lastLogin}
          </Typography>
        </div>
      </Grid>
      <Grid item container justifyContent="right" alignItems="start" xs={1}>
        <IconButton onClick={props.onClose}>
          {props.showContactInfo ? <></> : <Close style={styles.icon} />}
        </IconButton>
      </Grid>
    </Grid>
  );
};

type Styles = {
  header: CSSProperties;
  icon: CSSProperties;
};

const styles: Styles = {
  header: {
    backgroundColor: 'black',
    height: 80,
    alignItems: 'center',
    cursor: 'pointer',
  },
  icon: {
    color: 'white',
    marginRight: 10,
  },
};
