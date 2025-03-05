import {FiberManualRecord} from '@mui/icons-material';
import {
  Avatar,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import moment from 'moment';
import {CSSProperties} from 'react';
import {light_gray, primary_green} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';

export type ChatOverviewContact = {
  lastMessageText: string;
  sentAt: string;
  seen: boolean;
  firstName: string;
  lastName: string;
  profilePicture: string;
  id: string;
};

type Props = {
  onContactClicked: () => void;
  index: number;
  contact: ChatOverviewContact;
};

export const ChatOverviewContactsListItem = (props: Props) => {
  const lastMessageDate = props.contact.sentAt
    ? moment(props.contact.sentAt).isSame(moment(), 'day')
      ? moment(props.contact.sentAt).format('LT')
      : moment(props.contact.sentAt).format('L')
    : '';
  return (
    <ListItem
      onClick={() => props.onContactClicked()}
      style={{cursor: 'pointer'}}
    >
      <Grid container>
        <Grid xs={2} item>
          <ListItemAvatar>
            <Avatar src={props.contact.profilePicture} />
          </ListItemAvatar>
        </Grid>
        <Grid xs={8} item>
          <ListItemText
            style={sharedStyle.textStyle.regular}
            primary={`${props.contact.firstName} ${props.contact.lastName}`}
            secondary={
              <Typography
                style={{
                  ...styles.gray,
                  ...styles.contentText,
                }}
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                }}
                component={'span'}
              >
                {props.contact?.lastMessageText}
              </Typography>
            }
          />
        </Grid>
        <Grid
          xs={2}
          item
          display="flex"
          flexDirection={'column'}
          justifyContent={'baseline '}
          alignItems={'baseline'}
        >
          <ListItemText style={styles.gray} primary={lastMessageDate} />
          {!props.contact.seen ? (
            <FiberManualRecord style={styles.seenIcon} />
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </ListItem>
  );
};

type Styles = {
  gray: CSSProperties;
  contentText: CSSProperties;
  seenIcon: CSSProperties;
};

const styles: Styles = {
  gray: {
    color: light_gray,
  },
  contentText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seenIcon: {
    color: primary_green,
  },
};
