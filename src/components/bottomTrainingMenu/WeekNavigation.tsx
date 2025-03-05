import {Button, createTheme, Tab, Tabs, ThemeProvider} from '@mui/material';
import {t} from 'i18n-js';
import React, {ChangeEvent, CSSProperties, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {useCurrentWidth} from 'react-socks';
import {
  getCurrentCycleTrainingsLength,
  getCycleTemplateNames,
  getStartDateLastPlan,
} from '../../logic/firestore';
import {getAthleteTotalCycle} from '../../store/athleteSlice';
import {getDrawerOpen, setSelectedLibrary} from '../../store/navigationSlice';
import {
  getSelectedCycleIndex,
  getSelectedTrainingIndex,
  setSelectedTrainingIndex,
} from '../../store/trainingSlice';
import {
  primary_green,
  ultra_dark_gray,
  ultra_light_gray,
  white,
} from '../../styles/colors';
import CycleMenu from '../CycleMenu';
import {InsertCycleTemplateModal} from '../InsertCycleTemplateModal';
import NewCycleMenu from '../NewCycleMenu';
import {NewCycleTemplateModal} from '../NewCycleTemplateModal';
import WeekSelectionMenu from '../WeekSelectionMenu';
import {NewWeekMenu} from './NewWeekMenu';

const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const customTheme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: ultra_dark_gray,
        },
        indicator: {
          backgroundColor: primary_green,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.MuiTab-root': {
            color: white,
            opacity: 1,
            minWidth: 70,
            width: 70,
          },
          '&.Mui-selected': {
            color: primary_green,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-root': {
            color: ultra_light_gray,
            opacity: 1,
            minWidth: '16ch',
            width: 70,
          },
        },
      },
    },
  },
});

export type Props = {
  hideWeekSelection?: boolean;
  hideViewSelection?: boolean;
  checkPlanningScreen?: boolean;
};

export const WeekNavigation = (props: Props) => {
  const selectedTrainingIndex = useSelector(getSelectedTrainingIndex);
  const amountTrainings = useSelector(getCurrentCycleTrainingsLength);
  const lastWeekStartDate = useSelector(getStartDateLastPlan);
  const selectedCycle = useSelector(getSelectedCycleIndex);
  const athleteTotalCycle = useSelector(getAthleteTotalCycle);
  const drawerShow = useSelector(getDrawerOpen);
  const cycleTemplateNames = useSelector(getCycleTemplateNames);
  const screenWidth = useCurrentWidth();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [openNewTemplate, setOpenNewTemplate] = useState(false);
  const [openInsertTemplate, setOpenInsertTemplate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElCycleMenu, setAnchorElCycleMenu] = useState(null);
  const [anchorElNewCycleMenu, setAnchorElNewCycleMenu] = useState(null);
  const [anchorElWeekSelectionMenu, setAnchorElWeekSelectionMenu] =
    React.useState(null);
  const openMenu = Boolean(anchorEl);
  const cycleMenuOpen = Boolean(anchorElCycleMenu);
  const weekSelectionMenuOpen = Boolean(anchorElWeekSelectionMenu);
  const newCycleMenuOpen = Boolean(anchorElNewCycleMenu);

  const handleClick = (event) => {
    const data = {
      noTrainingWeekCreatedYet: lastWeekStartDate === undefined,
    };
    Intercom('trackEvent', 'New-Week-Button-Clicked', data);

    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openCycleMenu = (event) => {
    setAnchorElCycleMenu(event.currentTarget);
  };
  const closeCycleMenu = () => {
    setAnchorElCycleMenu(null);
  };
  const openNewCycleMenu = (event) => {
    setAnchorElNewCycleMenu(event.currentTarget);
  };
  const closeNewCycleMenu = () => {
    setAnchorElNewCycleMenu(null);
  };
  const openWeekSelectionMenu = (event) => {
    setAnchorElWeekSelectionMenu(event.currentTarget);
  };
  const closeWeekSelectionMenu = () => {
    setAnchorElWeekSelectionMenu(null);
  };
  const changeView = () => {
    //FIXME: react router
    if (
      location.pathname === '/week-overview' ||
      location.pathname === '/cycle-overview'
    ) {
      navigate('/trainings');
    } else {
      navigate('/week-overview');
    }
  };

  const openCheckEditor = () => {
    dispatch(setSelectedLibrary(1));
    navigate('/library/dailyCheck');
  };

  const generateWeeks = () => {
    const shownTrainings = screenWidth / amountTrainings >= 126;

    if (shownTrainings) {
      const returnArray = [];
      for (let index = 1; index < amountTrainings + 1; index++) {
        returnArray.push(
          <Tab
            key={'week' + index}
            label={
              <div style={styles.tabStyle}>
                {t('PLANNING_NAVIGATION_BUTTON_WEEK', {index: index})}
              </div>
            }
            {...a11yProps(index - 1)}
          />,
        );
      }
      return (
        <Tabs value={selectedTrainingIndex} onChange={handleChange}>
          {returnArray}
        </Tabs>
      );
    } else {
      return (
        <div>
          <Button onClick={openWeekSelectionMenu}>
            {t('PLANNING_NAVIGATION_BUTTON_WEEK_SELECTOR', {
              selected_week: selectedTrainingIndex + 1,
              total_weeks: amountTrainings,
            })}
          </Button>
          <WeekSelectionMenu
            anchorEl={anchorElWeekSelectionMenu}
            open={weekSelectionMenuOpen}
            handleClose={closeWeekSelectionMenu}
          />
        </div>
      );
    }
  };
  const handleChange = (_: ChangeEvent, newValue: number) => {
    dispatch(setSelectedTrainingIndex(newValue));
  };

  //FIXME: react router
  const viewButtonText =
    location.pathname === '/week-overview' ||
    location.pathname === '/cycle-overview'
      ? t('PLANNING_NAVIGATION_BUTTON_DAYVIEW')
      : t('PLANNING_NAVIGATION_BUTTON_OVERVIEW');
  const drawerMargin = drawerShow ? {marginLeft: 270} : {marginLeft: 70};
  return (
    <ThemeProvider theme={customTheme}>
      <div style={styles.container}>
        {!props.hideViewSelection ? (
          <div style={{...styles.leftContainer, ...drawerMargin}}>
            <Button onClick={changeView}>{viewButtonText}</Button>
          </div>
        ) : (
          <div style={styles.leftContainer} />
        )}
        {props.checkPlanningScreen && (
          <div style={{...styles.leftContainer, ...drawerMargin}}>
            <Button onClick={openCheckEditor}>{'Check Editor'}</Button>
          </div>
        )}
        {!props.hideWeekSelection && (
          <div style={styles.middleContainer}>
            {generateWeeks()}
            {athleteTotalCycle === selectedCycle && (
              <Button onClick={handleClick}>
                {t('PLANNING_NAVIGATION_BUTTON_NEW_WEEK')}
              </Button>
            )}
            <NewWeekMenu
              anchorEl={anchorEl}
              open={openMenu}
              handleClose={handleClose}
            />
          </div>
        )}

        <div style={styles.rightContainer}>
          <Button onClick={openCycleMenu}>
            {t('PLANNING_NAVIGATION_BUTTON_CYCLE', {
              selected_cycle: selectedCycle,
              total_cycles: athleteTotalCycle,
            })}
          </Button>
          <CycleMenu
            anchorEl={anchorElCycleMenu}
            open={cycleMenuOpen}
            handleClose={closeCycleMenu}
          />
          <Button onClick={openNewCycleMenu}>
            {t('PLANNING_NAVIGATION_BUTTON_NEW_CYCLE')}
          </Button>
          <NewCycleMenu
            anchorEl={anchorElNewCycleMenu}
            open={newCycleMenuOpen}
            handleClose={closeNewCycleMenu}
            setOpenNewTemplate={setOpenNewTemplate}
            setOpenInsertTemplate={setOpenInsertTemplate}
          />
          <NewCycleTemplateModal
            open={openNewTemplate}
            handleClose={() => {
              setOpenNewTemplate(false);
            }}
            cycleTemplateNames={cycleTemplateNames}
          />
          <InsertCycleTemplateModal
            open={openInsertTemplate}
            handleClose={() => {
              setOpenInsertTemplate(false);
            }}
            confirm={undefined}
            copyWeek={false}
            startDayArray={[]}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

type Style = {
  container: CSSProperties;
  leftContainer: CSSProperties;
  middleContainer: CSSProperties;
  rightContainer: CSSProperties;
  tabStyle: CSSProperties;
};

const styles: Style = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 70,
  },
  middleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  tabStyle: {width: '9ch'},
};
