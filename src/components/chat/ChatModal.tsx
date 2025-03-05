import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {isEmpty} from 'lodash';
import {CSSProperties, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getSelectedAthlete} from '../../logic/firestore';
import {UserType} from '../../traindoo_shared/types/User';
import {ChatContactInfo} from './ChatContactInfo';
import {ChatOverview} from './ChatOverview';
import {ChatSingleContact} from './ChatSingleContact';

type Props = {
  close: () => void;
  open: boolean;
  style: CSSProperties;
};

export const ChatModal = (props: Props) => {
  const selectedAthlete = useSelector(getSelectedAthlete);

  const [currentChatContact, setCurrentChatContact] = useState<UserType>();
  const [showSingleContact, setShowSingleContact] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // change chat contact when currently active athlete changes
  useEffect(() => {
    if (!isEmpty(selectedAthlete)) {
      setCurrentChatContact(selectedAthlete);
      setShowSingleContact(true);
      setShowContactInfo(false);
    }
  }, [selectedAthlete]);

  useEffect(() => {
    if (props.open) {
      // always return to ChatOverview when in opening Chat in athlete dashboard
      const urlParts = window.location.href.toString().split('/');
      const goBackToChatOverview = urlParts[3].startsWith('home');
      if (goBackToChatOverview) {
        setShowSingleContact(false);
      }
    }
  }, [props.open]);

  const handleChatContactClicked = (athlete: UserType) => {
    setCurrentChatContact(athlete);
    setShowContactInfo(false);
    setShowSingleContact(true);
  };

  const handleClose = () => props.close();

  return (
    <Modal style={props.style} open={props.open} onClose={handleClose}>
      <Box sx={styles.chatModalBox}>
        {showSingleContact && !isEmpty(currentChatContact) ? (
          <div style={styles.insideBox}>
            <ChatSingleContact
              onClose={handleClose}
              onBackButtonClicked={() => {
                // always hide ChatContactInfo when closing ChatSingleContact
                setShowContactInfo(false);
                setShowSingleContact(false);
              }}
              // toggle showing ChatContactInfo when clicking on header
              onInfoButtonClicked={() => setShowContactInfo(!showContactInfo)}
              currentChatContact={currentChatContact}
              showContactInfo={showContactInfo}
            />
            {showContactInfo ? (
              <ChatContactInfo
                onClose={handleClose}
                open={showContactInfo}
                currentChatContact={currentChatContact}
              />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div style={styles.insideBox}>
            <ChatOverview
              onClose={handleClose}
              onContactClicked={handleChatContactClicked}
            />
          </div>
        )}
      </Box>
    </Modal>
  );
};

type Styles = {
  chatModalBox: CSSProperties;
  insideBox: CSSProperties;
};

const styles: Styles = {
  chatModalBox: {
    width: 'fit-content',
    height: '100%',
  },
  insideBox: {
    display: 'flex',
    flexDirection: 'row',
    border: '2px solid #ffffffcc',
    background: 'linear-gradient(#222222, #14171a)',
    borderRadius: 20,
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
};
