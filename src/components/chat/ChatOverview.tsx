import {Box} from '@mui/material';
import {CSSProperties, useState} from 'react';
import {UserType} from '../../traindoo_shared/types/User';
import {ChatOverviewContactsList} from './ChatOverviewContactsList';
import {ChatOverviewSearchBar} from './ChatOverviewSearchBar';

type Props = {
  onClose: () => void;
  onContactClicked: (athlete: UserType) => void;
};

export const ChatOverview = (props: Props) => {
  const [searchBarInput, setSearchBarInput] = useState('');

  return (
    <Box sx={styles.chatBox}>
      <ChatOverviewSearchBar
        onClose={props.onClose}
        searchBarInput={searchBarInput}
        setSearchBarInput={setSearchBarInput}
      />
      <div style={styles.scrollView}>
        <ChatOverviewContactsList
          onContactClicked={props.onContactClicked}
          searchBarInput={searchBarInput}
        />
      </div>
    </Box>
  );
};

type Styles = {
  chatBox: CSSProperties;
  scrollView: CSSProperties;
};

const styles: Styles = {
  chatBox: {
    width: 420,
    height: '100%',
    backgroundColor: 'linear-gradient(#222222, #14171a)',
    padding: 0,
  },
  scrollView: {
    height: '100%',
    overflow: 'auto',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 100,
  },
};
