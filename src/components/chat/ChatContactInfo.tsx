import {Close} from '@mui/icons-material';
import {Divider, Grid, IconButton, Typography} from '@mui/material';
import Box from '@mui/system/Box';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {light_gray} from '../../styles/colors';
import {UserType} from '../../traindoo_shared/types/User';
import AvatarImg from '../Avatar';

type Props = {
  onClose: () => void;
  open: boolean;
  currentChatContact: UserType;
};

export const ChatContactInfo = (props: Props) => {
  return (
    <Box sx={styles.infoBox}>
      <Box display="flex" justifyContent="right">
        <IconButton onClick={props.onClose}>
          <Close style={styles.white} />
        </IconButton>
      </Box>
      <div style={styles.infoElement}>
        <AvatarImg
          large={true}
          src={props.currentChatContact.athlete.profilePicture}
        />
      </div>
      <div style={styles.infoElement}>
        <Typography variant="h5" paddingBottom={2} paddingTop={2} color="white">
          {props.currentChatContact.firstName +
            ' ' +
            props.currentChatContact.lastName}
        </Typography>
      </div>
      <Divider />
      <Grid container alignItems="center" paddingLeft={3} paddingTop={1}>
        <Grid item xs={12}>
          <Typography variant="overline" color="white">
            {t('CHAT_BDAY')}
          </Typography>
        </Grid>
        <Grid item xs={12} paddingBottom={2}>
          <Typography color="white">
            {props.currentChatContact?.birthDate
              ? moment(props.currentChatContact?.birthDate).format('LL')
              : '-'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="overline" color="white">
            {t('CHAT_NEXT_COMP')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color="white">
            {props.currentChatContact?.athlete.competitionDate
              ? moment(
                  props.currentChatContact?.athlete.competitionDate,
                ).format('LL')
              : '-'}
          </Typography>
        </Grid>
      </Grid>
      <Grid container padding={2}>
        {/* <Chip label="example" style={styles.white}></Chip> */}
      </Grid>
    </Box>
  );
};

type Styles = {
  infoBox: CSSProperties;
  infoHeader: CSSProperties;
  infoElement: CSSProperties;
  white: CSSProperties;
};

const styles: Styles = {
  infoBox: {
    borderLeft: '2px  solid #000',
    width: 250,
    background: light_gray,
    position: 'relative',
  },
  infoHeader: {
    alignItems: 'center',
    height: 80,
  },
  infoElement: {
    display: 'flex',
    justifyContent: 'center',
  },
  white: {
    color: 'white',
  },
};
