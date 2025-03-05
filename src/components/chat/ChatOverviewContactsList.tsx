import {CircularProgress, List} from '@mui/material';
import {CSSProperties} from 'react';
import {useGetChatData} from '../../hooks/useGetChatData';

import {UserType} from '../../traindoo_shared/types/User';
import {ChatOverviewContactsListItem} from './ChatOverviewContactsListItem';

type Props = {
  onContactClicked: (athlete: UserType) => void;
  searchBarInput: string;
};

export const ChatOverviewContactsList = (props: Props) => {
  /* SELECTORS */
  const {chatContacts, athletesFilteredBySearchInput} = useGetChatData(
    props.searchBarInput,
  );

  const handleContactClicked = (contactId: string) => {
    /* Need to use id to look up athlete, since chatContacts is sorted by sentAt
     * timestamp and athletesFilteredBySearchInput is still unsorted. */
    const selectedAthlete: UserType = athletesFilteredBySearchInput.find(
      (athlete) => {
        return athlete.id === contactId;
      },
    );

    if (selectedAthlete) {
      // return first match (there should, of course, only be a single match)
      props.onContactClicked(selectedAthlete);
    }
  };
  return (
    <>
      {chatContacts !== undefined ? (
        <List>
          {chatContacts?.map((contact, index) => (
            <ChatOverviewContactsListItem
              onContactClicked={() => handleContactClicked(contact.id)}
              key={index}
              index={index}
              contact={contact}
            />
          ))}
        </List>
      ) : (
        <div style={styles.loadingStyle}>
          <CircularProgress color="info" />
        </div>
      )}
    </>
  );
};

type Styles = {
  loadingStyle: CSSProperties;
};

const styles: Styles = {
  loadingStyle: {
    width: '100%',
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
  },
};
