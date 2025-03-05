import {Button} from '@mui/material';
import Modal from '@mui/material/Modal';
import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  getUserId,
  getWebUpdateMessageArray,
  usersDataQuery,
} from '../logic/firestore';
import {new_green, sidebar_color_dark, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

type Props = {
  open: boolean;
};

export const UpdateOverlay = (props: Props) => {
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const updateMessageArray = useSelector(getWebUpdateMessageArray);
  const handleClick = () => {
    firestore
      .update(usersDataQuery(userId), {
        ['webApp.lastUpdateDate']: moment().utc().toISOString(),
      })
      .then(() => window.location.reload());
  };
  const changesList = updateMessageArray.map((change, index) => (
    <li key={'Change' + index}>{change}</li>
  ));
  return (
    <Modal open={props.open} sx={styles.modal}>
      <div style={styles.container}>
        <div style={styles.headerText}>{t('UPDATE_OVERLAY_TITLE')}</div>
        <div style={{...sharedStyle.textStyle.title1}}>{changesList}</div>
        <Button style={styles.nextButton} onClick={handleClick}>
          <div style={sharedStyle.textStyle.title1}>
            {t('UPDATE_OVERLAY_BUTTON')}
          </div>
        </Button>
      </div>
    </Modal>
  );
};

type Styles = {
  modal: CSSProperties;
  container: CSSProperties;
  headerText: CSSProperties;
  nextButton: CSSProperties;
  nextButtonText: CSSProperties;
};

const styles: Styles = {
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 400,
    minHeight: 700,
    padding: 50,
    background: sidebar_color_dark,
    borderRadius: 24,
  },
  nextButton: {
    width: 160,
    height: 50,
    backgroundColor: new_green,
    fontSize: 14,
    borderRadius: 25,
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 34,
    color: white,
  },
  nextButtonText: {
    color: white,
  },
};
