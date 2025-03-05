import {Box, List} from '@mui/material';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import {CSSProperties, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  ReduxFirestoreQuerySetting,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import {getUserId, messageAthleteQuery} from '../../logic/firestore';
import {
  canMsgBeAddedToMsgsArray,
  compareFcnMessageDate,
  getChatQuery,
  getChatQueryUnseenMsgs,
  setMsgsToSeenInFirestore,
} from '../../traindoo_shared/functions/chatFunctions';
import {
  mostRecentChatMsgQuery,
  specificChatQuery,
} from '../../traindoo_shared/selectors/chatQueries';

import {getMostRecentChatMsg} from '../../traindoo_shared/selectors/chatSelectors';
import {Message} from '../../traindoo_shared/types/ChatTypes';
import {ChatMessage, MessageContentType} from './ChatMessage';
import {ChatUnreadMessagesMarker} from './ChatUnreadMessagesMarker';

type Props = {
  athleteId: string;
  sentMsgTriggeredByUser: boolean;
  setSentMsgTriggeredByUser: (boolean) => void;
  chatId?: string;
};

export const ChatMessagesList = (props: Props) => {
  const {athleteId, chatId} = props;

  /* SELECTORS */

  const userId = useSelector(getUserId);
  const mostRecentMsg: Message = useSelector(getMostRecentChatMsg);

  /* FIRESTORE MISC */

  const firestoreSubscriptions = [messageAthleteQuery(athleteId)];
  if (chatId) {
    firestoreSubscriptions.push(
      mostRecentChatMsgQuery(chatId) as ReduxFirestoreQuerySetting,
    );
  }
  useFirestoreConnect(firestoreSubscriptions);

  /* CONSTANTS */

  const numberOfMsgsInFetchInitial = 30;
  const numberOfMsgsInFetchMore = numberOfMsgsInFetchInitial;

  /* STATES */

  const [messages, setMessages] = useState<Message[]>([]);
  const timestampOldestMsg = useRef<string>(moment().toString());

  /* REFS FOR SCROLLING */

  const scrollBottomRef = useRef(null);
  const lastSeenMsgRef = useRef(null);

  /* FLAGS */

  const moreMsgsAvailable = useRef<boolean>(true);
  const initialMsgsFetched = useRef<boolean>(false);

  const firestore = useFirestore();
  const query = chatId ? getChatQuery(firestore, chatId) : undefined;

  /* USE EFFECT HOOKS */
  useEffect(() => {
    fetchInitialMsgs();
    // ChatId is needed for first message in chat
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    if (
      mostRecentMsg &&
      initialMsgsFetched.current &&
      canMsgBeAddedToMsgsArray(messages, mostRecentMsg)
    ) {
      const newMsg: Message = {
        ...mostRecentMsg,
        unseen: mostRecentMsg.unseen.filter((id) => id !== userId),
      };
      addToMsgs([newMsg]);

      // scroll to bottom of chat when new message is added (mostRecentMsg is at bottom)
      scrollToBottom(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostRecentMsg]);

  useEffect(() => {
    if (messages?.length > 0 && chatId) {
      const newestMessage = messages[messages.length - 1];
      const newObject = {
        contentText: newestMessage?.contentText,
        sentAt: newestMessage?.sentAt,
        contentType: newestMessage?.contentType,
        messageId: newestMessage.messageId,
        notReceived: newestMessage.notReceived.filter((id) => id !== userId),
        unseen: newestMessage.unseen.filter((id) => id !== userId),
      };

      firestore.update(specificChatQuery(chatId), {
        ['lastMessage']: newObject,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (props.sentMsgTriggeredByUser) {
      // set all msgs to seen when user interacts with Chat by sending msg
      // messages.forEach((msg) => (msg.seen = true));

      props.setSentMsgTriggeredByUser(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sentMsgTriggeredByUser]);

  /* UTILITY FCNS */

  const addToMsgs = (newMessages: Message[]) => {
    setMessages(sortMsgsByDate([...newMessages, ...messages]));
  };

  const sortMsgsByDate = (unsortedMessages: Message[]): Message[] => {
    // reverse() is needed because app's FlatList is inverted whereas web's List isn't
    return unsortedMessages
      ? cloneDeep(unsortedMessages).sort(compareFcnMessageDate).reverse()
      : ([] as Message[]);
  };

  const scrollToOldestSeenMsg = (smooth: boolean) => {
    if (lastSeenMsgRef.current) {
      // timeout is needed to wait for the messages to be added
      setTimeout(() => {
        lastSeenMsgRef.current.scrollIntoView(
          smooth ? {behavior: 'smooth'} : {},
        );
      }, 100);
    } else {
      // simply scroll to bottom when there are no unseen msgs
      scrollToBottom(smooth);
    }
  };

  const scrollToBottom = (smooth: boolean) => {
    setTimeout(() => {
      scrollBottomRef?.current?.scrollIntoView(
        smooth ? {behavior: 'smooth'} : {},
      );
    }, 100);
  };

  const fetchInitialMsgs = async () => {
    if (!query) {
      return;
    }
    // This query loads all messages unseen messages
    const queryUnseen = getChatQueryUnseenMsgs(firestore, chatId, userId);
    let messageData = await queryUnseen.get();

    /* If previous query doesn't yield at least the desired number of initial msgs,
     * run another query to make sure that the desired number is loaded. */
    if (messageData.docs.length < numberOfMsgsInFetchInitial) {
      messageData = await query.limit(numberOfMsgsInFetchInitial).get();
    }
    const messageDocs = messageData.docs;

    const msgsToBeAdded: Message[] = [];
    messageDocs?.forEach((docSnapshot: any) => {
      const msg: Message = docSnapshot.data();
      if (canMsgBeAddedToMsgsArray(messages, msg)) {
        msgsToBeAdded.push(msg);
      }
    });
    addToMsgs(msgsToBeAdded);

    // first scroll to oldest unseen msgs...
    scrollToOldestSeenMsg(false);

    // ... and then set all msgs which were just loaded to seen
    setMsgsToSeenInFirestore(firestore, messageDocs, userId);

    // finally set flags to enable/disable loadMoreMsgs()
    moreMsgsAvailable.current =
      messageDocs?.length >= numberOfMsgsInFetchInitial;

    // enable mostRecentMsg's useEffect
    initialMsgsFetched.current = true;
  };

  const fetchMoreMsgs = async () => {
    if (moreMsgsAvailable.current && query) {
      const messageData = await query
        .startAfter(timestampOldestMsg.current)
        .limit(numberOfMsgsInFetchMore)
        .get();

      const msgsToBeAdded: Message[] = [];
      // docSnapshot is actually of type firebase.firestore.QueryDocumentSnapshot
      messageData.docs?.forEach((docSnapshot: any) => {
        const msg: Message = docSnapshot.data();
        if (canMsgBeAddedToMsgsArray(messages, msg)) {
          msgsToBeAdded.push(msg);
        }
      });
      addToMsgs(msgsToBeAdded);
      setMsgsToSeenInFirestore(firestore, messageData.docs, userId);

      moreMsgsAvailable.current =
        messageData.docs?.length === numberOfMsgsInFetchMore;
    }
  };

  const onScrollFunction = async () => {
    if (document?.getElementById('ScrollBox')?.scrollTop === 0) {
      const oldScrollHeight =
        document?.getElementById('ScrollBox')?.scrollHeight;
      await fetchMoreMsgs();
      // Scroll down after loading new messages
      const newScrollHeight =
        document?.getElementById('ScrollBox')?.scrollHeight;
      const newScrollTop = newScrollHeight - oldScrollHeight;
      document.getElementById('ScrollBox').scrollTop = newScrollTop;
    }
  };

  const oldestMessage: Message = messages[0];
  if (oldestMessage) {
    timestampOldestMsg.current = oldestMessage.sentAt;
  }

  // start at bottom of msgs list (most recent message) & find oldest unseen msg
  let oldestUnreadMsgIndex = messages.length - 1;
  let unreadMsgsCounter = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (
      messages[i].sentBy !== userId &&
      messages[i]?.unseen?.includes(userId)
    ) {
      oldestUnreadMsgIndex = i;
      unreadMsgsCounter++;
    }
  }

  const msgsListItems = messages?.map((message, index) => {
    const showUnreadMsgsMarker =
      unreadMsgsCounter > 0 && index === oldestUnreadMsgIndex;

    return (
      <div key={message.messageId}>
        {showUnreadMsgsMarker ? (
          <ChatUnreadMessagesMarker
            lastSeenMsgRef={lastSeenMsgRef}
            numberOfUnreadMessages={unreadMsgsCounter}
          />
        ) : null}
        <ListItem
          style={
            message.sentBy === userId
              ? {display: 'flex', justifyContent: 'flex-end'}
              : {marginLeft: '0'}
          }
        >
          <ChatMessage
            contentText={message.contentText}
            contentMedia={message.contentAsset?.url}
            sentAt={message.sentAt}
            sentBy={message.sentBy}
            type={MessageContentType.textOnly}
          />
        </ListItem>
      </div>
    );
  });

  return (
    <Box id={'ScrollBox'} onScroll={onScrollFunction} style={styles.scrollBox}>
      <Grid container spacing={4} alignItems="center">
        <Grid xs={12} item>
          <List>{msgsListItems}</List>
          <ListItem ref={scrollBottomRef}></ListItem>
        </Grid>
      </Grid>
    </Box>
  );
};

type Styles = {
  scrollBox: CSSProperties;
};

const styles: Styles = {
  scrollBox: {
    flex: 1,
    overflow: 'auto',
    scrollbarWidth: 'none',
  },
};
