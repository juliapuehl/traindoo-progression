import {
  BarChart,
  Chat,
  CollectionsBookmark,
  Favorite,
  FitnessCenter,
  Help,
  Menu as MenuIcon,
  Payment,
  People,
  Settings,
} from '@mui/icons-material/';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
} from '@mui/material/';
import {Theme} from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import {t} from 'i18n-js';
import {CSSProperties, ReactNode, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {useCurrentWidth} from 'react-socks';
import {
  getShowUpdateOverlay,
  getUser,
  getUserBusinessName,
} from '../../logic/firestore';
import {getCurrentAthleteId} from '../../store/athleteSlice';
import {getDrawerOpen, setDrawerOpen} from '../../store/navigationSlice';
import {RootState} from '../../store/store';
import {
  background_color_dark,
  dark_gray,
  primary_green,
  ultra_dark_gray,
  white,
} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {getUserHasUnreadMessages} from '../../traindoo_shared/selectors/chatSelectors';
import {ChatModal} from '../chat/ChatModal';
import {OnboardingOverlay} from '../OnboardingOverlay';
import {UpdateOverlay} from '../UpdateOverlay';

const drawerWidth = 240;
const drawerIconsWidth = 60;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: ultra_dark_gray,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      backgroundColor: dark_gray,
      color: white,
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: 60,
      backgroundColor: dark_gray,
      color: white,
    },
    drawerContainer: {
      overflow: 'hidden',
      flex: 1,
    },
    nested: {
      paddingLeft: 16,
    },
    content: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: 0,
      paddingTop: 64,
      width: '100%',
      height: '100%',
      background: background_color_dark,
      overflow: 'auto',
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: -drawerWidth,
    },
    icons: {
      color: white,
    },
    subIcons: {
      color: primary_green,
    },
    selectedItem: {
      backgroundColor: primary_green,
    },
    popupMenu: {
      color: white,
      '& .MuiMenu-paper': {
        backgroundColor: dark_gray,
      },
    },
    burger: {
      color: white,
    },
  }),
);

const ClippedDrawer = (props: {children: ReactNode}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const screenWidth = useCurrentWidth();
  const businessName = useSelector(getUserBusinessName);
  const drawerShow = useSelector(getDrawerOpen);
  const athleteId = useSelector(getCurrentAthleteId);
  const user = useSelector(getUser);
  const unreadMessage = useSelector((state: RootState) =>
    getUserHasUnreadMessages(state, user?.id),
  );
  const showUpdateOverlay = useSelector(getShowUpdateOverlay);

  //temporary flag to hide Chat Icon until fullscreen view is implemented
  const [openChatModal, setOpenChatModal] = useState(false);

  const [onboardingOverlayVisible, setOnboardingOverlayVisible] =
    useState(false);

  useEffect(() => {
    if (location.pathname !== '/home') {
      dispatch(setDrawerOpen(screenWidth < 2300 ? false : true));
    } else {
      dispatch(setDrawerOpen(true));
    }
  }, [dispatch, screenWidth]);

  const handleDrawerShow = () => {
    dispatch(setDrawerOpen(!drawerShow));
  };

  const openHelpVideos = () => {
    setOnboardingOverlayVisible(true);
  };

  const noAthleteSelected = athleteId ? false : true;
  const redirectCustomerPortal = () => {
    const env = process.env.REACT_APP_ENV;
    switch (env) {
      case 'development':
        // eslint-disable-next-line max-len
        window.location.href = `https://europe-west1-traindoo-io-dev.cloudfunctions.net/stripeCreateCustomerPortal?id=${user.trainer.stripe.stripeId}`;
        break;
      case 'staging':
        // eslint-disable-next-line max-len
        window.location.href = `https://europe-west1-traindoo-dev.cloudfunctions.net/stripeCreateCustomerPortal?id=${user.trainer.stripe.stripeId}`;
        break;
      case 'production':
        console.warn('Stripe for production not set up');
        window.location.href = `https://traindoo.io`;
        break;
      default:
        console.warn('No environment set');
        break;
    }
  };

  return (
    <div className={classes.root}>
      <ChatModal
        close={() => setOpenChatModal(false)}
        open={openChatModal}
        style={{
          ...styles.chatModal,
          ...{marginLeft: drawerShow ? drawerWidth : drawerIconsWidth},
        }}
      />
      <OnboardingOverlay
        open={onboardingOverlayVisible}
        close={() => setOnboardingOverlayVisible(false)}
      />
      <UpdateOverlay open={showUpdateOverlay} />

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="secondary"
            aria-label="menu"
            className={classes.burger}
            onClick={handleDrawerShow}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <div style={sharedStyle.textStyle.title1}>
            {businessName ? 'Traindoo x ' + businessName : 'Traindoo'}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerShow,
          [classes.drawerClose]: !drawerShow,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerShow,
            [classes.drawerClose]: !drawerShow,
          }),
        }}
        variant="permanent"
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <Link to="/home">
              <ListItem button>
                <Tooltip title={t('ATHLETES_DASHBOARD_MENU')}>
                  <ListItemIcon className={classes.icons}>
                    <People />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary={t('ATHLETES_DASHBOARD_MENU')} />
              </ListItem>
            </Link>
            <Tooltip
              title={noAthleteSelected ? t('NAVIGATION_NO_ATHLETE') : ''}
            >
              <Link to={noAthleteSelected ? '/home' : '/trainings'}>
                <ListItem button disabled={noAthleteSelected}>
                  <Tooltip title={t('TRAINING_TRAINING_MENU')}>
                    <ListItemIcon className={classes.icons}>
                      <FitnessCenter />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary={t('TRAINING_TRAINING_MENU')} />
                </ListItem>
              </Link>
            </Tooltip>
            <Tooltip
              title={noAthleteSelected ? t('NAVIGATION_NO_ATHLETE') : ''}
            >
              <Link to={noAthleteSelected ? '/home' : '/check-planning'}>
                <ListItem button disabled={noAthleteSelected}>
                  <Tooltip title={t('HEALTH_MENU')}>
                    <ListItemIcon className={classes.icons}>
                      <Favorite />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary={t('HEALTH_MENU')} />
                </ListItem>
              </Link>
            </Tooltip>
            <Tooltip
              title={noAthleteSelected ? t('NAVIGATION_NO_ATHLETE') : ''}
            >
              <Link to={noAthleteSelected ? '/home' : '/analytics'}>
                <ListItem button disabled={noAthleteSelected}>
                  <Tooltip title={t('ANALYTICS_MENU')}>
                    <ListItemIcon className={classes.icons}>
                      <BarChart />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary={t('ANALYTICS_MENU')} />
                </ListItem>
              </Link>
            </Tooltip>
            <Link to={'/library'}>
              <ListItem button>
                <Tooltip title={t('LIBRARY_DRAWER_TITLE')}>
                  <ListItemIcon className={classes.icons}>
                    <CollectionsBookmark />
                  </ListItemIcon>
                </Tooltip>

                <ListItemText primary={t('LIBRARY_DRAWER_TITLE')} />
              </ListItem>
            </Link>
          </List>
          <div style={styles.chatButtonInSidebar}>
            <ListItemButton onClick={() => setOpenChatModal(true)}>
              <Tooltip title={t('CHAT_ICON_LABEL')}>
                <ListItemIcon className={classes.icons}>
                  {unreadMessage ? (
                    <MarkUnreadChatAltIcon style={{color: primary_green}} />
                  ) : (
                    <Chat />
                  )}
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary={t('CHAT_ICON_LABEL')} />
            </ListItemButton>
          </div>
          <Divider />
          <List>
            <Link to="/settings">
              <ListItem button key="Settings">
                <Tooltip title={t('SETTINGS_MENU')}>
                  <ListItemIcon className={classes.icons}>
                    <Settings />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary={t('SETTINGS_MENU')} />
              </ListItem>
            </Link>

            {user?.trainer?.enablePayment === true &&
              user?.trainer?.paymentFlags?.subscriptionSetupCompleted ===
                true && (
                <ListItem
                  button
                  key="Customer Portal"
                  onClick={redirectCustomerPortal}
                >
                  <Tooltip title={t('BILLING_MENU')}>
                    <ListItemIcon className={classes.icons}>
                      <Payment />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary={t('BILLING_MENU')} />
                </ListItem>
              )}

            <ListItem button key="Help Videos" onClick={openHelpVideos}>
              <Tooltip title={t('HELP_VIDEOS_MENU')}>
                <ListItemIcon className={classes.icons}>
                  <Help />
                </ListItemIcon>
              </Tooltip>

              <ListItemText primary={t('HELP_VIDEOS_MENU')} />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

type Styles = {
  chatModal: CSSProperties;
  chatButtonInSidebar: CSSProperties;
};

const styles: Styles = {
  chatModal: {
    paddingTop: 70,
    paddingBottom: 5,
    paddingLeft: 5,
  },
  chatButtonInSidebar: {marginBottom: 5},
};

export default ClippedDrawer;
