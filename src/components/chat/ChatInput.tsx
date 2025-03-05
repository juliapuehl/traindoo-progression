import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import {t} from 'i18n-js';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {v4 as uuidv4} from 'uuid';
import {getUserId} from '../../logic/firestore';
import {uploadMsgToFirestore} from '../../traindoo_shared/functions/chatFunctions';

type Props = {
  athleteId: string;
  newMsgSent: () => void;
  chatId?: string;
};

export const ChatInput = (props: Props) => {
  const userId = useSelector(getUserId);
  const firestore = useFirestore();
  const {chatId, athleteId, newMsgSent} = props;

  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = async (message: string) => {
    const newMessageId = uuidv4();
    // If no chatId is passed, create a new chat
    uploadMsgToFirestore(
      message,
      userId,
      userId,
      [userId, athleteId],
      newMessageId,
      chatId,
      'private',
      firestore,
    );
    newMsgSent();
  };

  const isMsgInputEmpty = (msg: string) => {
    const trimmedInput = msg.trim();
    return !trimmedInput;
  };

  const handleEnter = (event: any, msg: string) => {
    if (event.key === 'Enter' && !isMsgInputEmpty(msg)) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <Grid style={styles.footer} container alignItems="center">
      <Grid xs={10} item>
        <input
          style={styles.messageInput}
          onChange={(event) => setInputMessage(event.target.value)}
          onKeyDown={(e) => {
            handleEnter(e, inputMessage);
          }}
          value={inputMessage}
          placeholder={t('CHAT_TYPE_MESSAGE')}
        />
      </Grid>
      <Grid xs={2} item>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            sendMessage(inputMessage);
            setInputMessage('');
          }}
          aria-label="send"
          disabled={isMsgInputEmpty(inputMessage) ? true : false}
        >
          <SendIcon
            sx={
              isMsgInputEmpty(inputMessage) ? styles.iconGray : styles.iconWhite
            }
          />
        </IconButton>
      </Grid>
    </Grid>
  );
};

type Styles = {
  messageInput: CSSProperties;
  iconWhite: CSSProperties;
  iconGray: CSSProperties;
  footer: CSSProperties;
};

const styles: Styles = {
  messageInput: {
    width: '100%',
    height: 40,
    padding: 10,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: '#323232',
    fontSize: 16,
    color: 'white',
  },
  iconWhite: {
    color: 'white',
  },
  iconGray: {
    color: 'gray',
  },
  footer: {
    width: '100%',
    paddingLeft: 20,
    alignItems: 'bottom',
    backgroundColor: 'black',
  },
};
