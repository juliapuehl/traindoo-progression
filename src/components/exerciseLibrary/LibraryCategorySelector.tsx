import {AppBar, createTheme, Tab, Tabs, ThemeProvider} from '@mui/material';
import {t} from 'i18n-js';
import {ChangeEvent, CSSProperties} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {primary_green, ultra_dark_gray, white} from '../../styles/colors';

const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const customTheme = createTheme({
  palette: {
    primary: {
      main: primary_green,
    },
  },
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
            width: 300,
          },
          '&.Mui-selected': {
            // color: primary_green,
          },
        },
      },
    },
  },
});

const LibraryCategorySelector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleChange = (_event: ChangeEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        return navigate('/library/exercises');
      case 1:
        return navigate('/library/dailyCheck');
      case 2:
        return navigate('/library/weeklyCheck');
      default:
        return navigate('/library/exercises');
    }
  };
  let selected = 0;
  switch (location.pathname) {
    case '/library/exercises':
      selected = 0;
      break;
    case '/library/dailyCheck':
      selected = 1;
      break;
    case '/library/weeklyCheck':
      selected = 2;
      break;
  }

  return (
    <ThemeProvider theme={customTheme}>
      <AppBar position="static" style={styles.container}>
        <Tabs value={selected} onChange={handleChange}>
          <Tab
            label={<div>{t('LIBRARY_EXERCISES_TITLE')}</div>}
            {...a11yProps(0)}
          />
          <Tab
            label={<div>{t('LIBRARY_DAILY_TITLE')}</div>}
            {...a11yProps(1)}
          />
          <Tab
            label={<div>{t('LIBRARY_WEEKLY_TITLE')}</div>}
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>
    </ThemeProvider>
  );
};

type Styles = {
  container: CSSProperties;
  tabContainer: CSSProperties;
};

const styles: Styles = {
  container: {},
  tabContainer: {alignSelf: 'center'},
};
export default LibraryCategorySelector;
