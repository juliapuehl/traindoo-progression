import {
  Addchart,
  AddPhotoAlternate,
  PlaylistAdd,
  PostAdd,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import {t} from 'i18n-js';
import moment from 'moment';
import React, {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  getDailyElementsLength,
  getUserId,
  webSettingsLayoutQuery,
} from '../logic/firestore';
import {dark_gray, primary_green, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import IconWithTooltip from './IconWithTooltip';

const DashboardAddButton = () => {
  const {innerWidth, innerHeight} = window;

  const firestore = useFirestore();
  // eslint-disable-next-line no-undef
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const elementArrayLength = useSelector(getDailyElementsLength);
  const userId = useSelector(getUserId);
  // eslint-disable-next-line no-undef
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const path = 'dailyCheckLayout.elements.';
  const elementKey = 'element' + moment().unix();
  const standardElement = {
    minH: 4,
    minW: 4,
    elementKey: elementKey,
    index: elementArrayLength + 1,
    timeFrame: 'GRAPHS_SELECTOR_ALL_TIME',
    startDate: '',
    endDate: '',
  };

  const addGraph = () => {
    setAnchorEl(null);
    firestore.update(webSettingsLayoutQuery(userId), {
      [path + elementKey]: {
        ...standardElement,
        checkKeys: [],
        type: 'graph',
      },
    });
  };
  const addTable = () => {
    setAnchorEl(null);
    firestore.update(webSettingsLayoutQuery(userId), {
      [path + elementKey]: {
        ...standardElement,
        checkKeys: [],
        type: 'table',
      },
    });
  };
  const addTextTextMode = () => {
    setAnchorEl(null);
    firestore.update(webSettingsLayoutQuery(userId), {
      [path + elementKey]: {
        ...standardElement,
        type: 'text',
      },
    });
  };
  const addTextCardMode = () => {
    setAnchorEl(null);
    firestore.update(webSettingsLayoutQuery(userId), {
      [path + elementKey]: {
        ...standardElement,
        cardMode: true,
        type: 'text',
      },
    });
  };
  const addMedia = () => {
    setAnchorEl(null);
    firestore.update(webSettingsLayoutQuery(userId), {
      [path + elementKey]: {
        ...standardElement,
        checkKeys: [],
        type: 'media',
      },
    });
  };

  const intercomTarget = 'dashboard-add-button';
  return (
    <div data-intercom-target={intercomTarget} className={intercomTarget}>
      <IconWithTooltip
        style={styles.icons}
        eventClick={handleClick}
        muiIcon={AddIcon}
        description={t('DASHBOARD_ELEMENT_ADD')}
        placement={'left'}
      />

      <Popover
        id={id}
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: innerHeight - 20 - 48 - 20 - 48,
          left: innerWidth - 20,
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClose={handleClose}
      >
        <div style={styles.popover}>
          <div style={styles.selection}>
            <IconWithTooltip
              muiIcon={Addchart}
              style={styles.icon}
              onClick={() => addGraph()}
            />
            <button
              onClick={() => {
                addGraph();
              }}
              style={styles.buttonText}
            >
              <div style={styles.buttonContent}>
                {t('DASHBOARD_ELEMENT_ADD_GRAPH')}
              </div>
            </button>
          </div>

          <div style={styles.selection}>
            <IconWithTooltip
              muiIcon={PlaylistAdd}
              style={styles.icon}
              onClick={() => addTable()}
            />
            <button
              onClick={() => {
                addTable();
              }}
              style={styles.buttonText}
            >
              <div style={styles.buttonContent}>
                {t('DASHBOARD_ELEMENT_ADD_TABLE')}
              </div>
            </button>
          </div>

          <div style={styles.selection}>
            <IconWithTooltip
              muiIcon={PostAdd}
              style={styles.icon}
              onClick={() => addTextTextMode()}
            />
            <button
              onClick={() => {
                addTextTextMode();
              }}
              style={styles.buttonText}
            >
              <div style={styles.buttonContent}>
                {t('DASHBOARD_ELEMENT_ADD_TEXT_TEXT')}
              </div>
            </button>
          </div>

          <div style={styles.selection}>
            <IconWithTooltip
              muiIcon={PostAdd}
              style={styles.icon}
              onClick={() => addTextCardMode()}
            />
            <button
              onClick={() => {
                addTextCardMode();
              }}
              style={styles.buttonText}
            >
              <div style={styles.buttonContent}>
                {t('DASHBOARD_ELEMENT_ADD_TEXT_CARD')}
              </div>
            </button>
          </div>

          <div style={styles.selection}>
            <IconWithTooltip
              muiIcon={AddPhotoAlternate}
              style={styles.icon}
              onClick={() => addMedia()}
            />
            <button
              onClick={() => {
                addMedia();
              }}
              style={styles.buttonText}
            >
              <div style={styles.buttonContent}>
                {t('DASHBOARD_ELEMENT_ADD_PHOTO')}
              </div>
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

type Styles = {
  icons: CSSProperties;
  icon: CSSProperties;
  popover: CSSProperties;
  button: CSSProperties;
  selection: CSSProperties;
  buttonText: CSSProperties;
  buttonContent: CSSProperties;
};

const styles: Styles = {
  icons: {
    color: white,
    height: 48,
    width: 48,
    background: primary_green,
    boxShadow: '0px 0px 8px ' + primary_green,
  },
  icon: {marginLeft: 10, color: white},
  popover: {
    color: dark_gray,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    backgroundColor: dark_gray,
    minWidth: 200,
  },
  button: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  selection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    width: '100%',
    backgroundColor: dark_gray,
    borderStyle: 'none',
  },
  buttonContent: {
    ...sharedStyle.textStyle.secondary_white_capital,
    textAlign: 'left',
    margin: 10,
  },
};

export default DashboardAddButton;
