import {Close} from '@mui/icons-material';
import {Grid, IconButton, Input} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {white} from '../../styles/colors';

type Props = {
  onClose: () => void;
  searchBarInput: string;
  setSearchBarInput: (value: string) => void;
};

export const ChatOverviewSearchBar = (props: Props) => {
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    props.setSearchBarInput(event.target.value);
  };

  return (
    <Grid container sx={styles.header}>
      <Grid xs={10} item>
        <div style={styles.searchContainer}>
          <Input
            style={styles.searchInput}
            value={props.searchBarInput}
            placeholder={t('CHAT_SEARCH')}
            disableUnderline
            onChange={handleSearchInputChange}
          />
        </div>
      </Grid>
      <Grid xs={2} item container justifyContent="right" alignItems="start">
        <IconButton onClick={props.onClose}>
          <Close style={styles.closeIcon} />
        </IconButton>
      </Grid>
    </Grid>
  );
};

type Styles = {
  header: CSSProperties;
  scrollView: CSSProperties;
  searchContainer: CSSProperties;
  searchInput: CSSProperties;
  closeIcon: CSSProperties;
};

const styles: Styles = {
  header: {
    backgroundColor: 'black',
    height: 80,
    alignItems: 'center',
  },
  scrollView: {
    maxHeight: 600,
    overflow: 'auto',
    padding: 10,
    paddingBottom: 10,
    flexDirection: 'column',
  },
  searchContainer: {
    backgroundColor: '#232323',
    height: 40,
    width: '100%',
    marginLeft: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
  },
  searchInput: {
    height: '100%',
    width: '100%',
    color: white,
  },
  closeIcon: {
    color: 'white',
    margin: 10,
  },
};
