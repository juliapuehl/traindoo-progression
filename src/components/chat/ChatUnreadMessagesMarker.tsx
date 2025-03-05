import {ListItem, Typography} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, MutableRefObject} from 'react';
import {dark_gray, white} from '../../styles/colors';

type Props = {
  lastSeenMsgRef: MutableRefObject<any>;
  numberOfUnreadMessages: number;
};

export const ChatUnreadMessagesMarker = (props: Props) => {
  const text =
    props.numberOfUnreadMessages > 1
      ? t('CHAT_UNREAD_MESSAGES', {
          number_messages: props.numberOfUnreadMessages,
        })
      : t('CHAT_UNREAD_MESSAGE', {
          number_messages: props.numberOfUnreadMessages,
        });

  return (
    <ListItem ref={props.lastSeenMsgRef} style={styles.listItem}>
      <Typography variant="body1" color={white}>
        {text}
      </Typography>
    </ListItem>
  );
};

type Styles = {
  listItem: CSSProperties;
};

const styles: Styles = {
  listItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    height: 30,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: dark_gray,
  },
};
