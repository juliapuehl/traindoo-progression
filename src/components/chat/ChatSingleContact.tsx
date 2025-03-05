import {Box} from '@mui/material';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  getMessageAthleteLastLoginString,
  getUserId,
} from '../../logic/firestore';
import {RootState} from '../../store/store';
import {getChatId} from '../../traindoo_shared/selectors/chatSelectors';
import {UserType} from '../../traindoo_shared/types/User';
import {ChatHeader} from './ChatHeader';
import {ChatInput} from './ChatInput';
import {ChatMessagesList} from './ChatMessagesList';

type Props = {
  onClose: () => void;
  onBackButtonClicked: () => void;
  onInfoButtonClicked: () => void;
  currentChatContact: UserType;
  showContactInfo: boolean;
};

export const ChatSingleContact = (props: Props) => {
  const {id, firstName, lastName} = props.currentChatContact;
  const athleteId = id;
  const profilePicUrl = props.currentChatContact?.athlete?.profilePicture;
  const userId = useSelector(getUserId);
  /* SELECTORS */

  const lastLogin = useSelector(getMessageAthleteLastLoginString);
  const chatId = useSelector((state: RootState) =>
    getChatId(state, athleteId, userId),
  );

  /* STATES */

  const [sentMsgTriggeredByUser, setSentMsgTriggeredByUser] = useState(false);

  const handleNewMsgSent = () => {
    setSentMsgTriggeredByUser(true);
  };
  return (
    <Box sx={styles.chatBox}>
      <ChatHeader
        onClose={props.onClose}
        onBackButtonClick={props.onBackButtonClicked}
        onInfoButtonClick={props.onInfoButtonClicked}
        profilePic={profilePicUrl}
        name={firstName + ' ' + lastName}
        lastLogin={lastLogin}
        showContactInfo={props.showContactInfo}
      />
      <ChatMessagesList
        athleteId={athleteId}
        sentMsgTriggeredByUser={sentMsgTriggeredByUser}
        setSentMsgTriggeredByUser={setSentMsgTriggeredByUser}
        chatId={chatId}
      />
      <ChatInput
        athleteId={athleteId}
        newMsgSent={handleNewMsgSent}
        chatId={chatId}
      />
    </Box>
  );
};

type Styles = {
  chatBox: CSSProperties;
};

const styles: Styles = {
  chatBox: {
    width: 420,
    height: '100%',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },
};
