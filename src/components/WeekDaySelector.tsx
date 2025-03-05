import {createTheme, Tab, Tabs, ThemeProvider} from '@mui/material';
import moment from 'moment';
import {ChangeEvent, CSSProperties} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUserLang} from '../logic/firestore';
import {
  getDateFirstDay,
  getNoTrainings,
  getSelectedDayIndex,
  setSelectedDayIndex,
} from '../store/trainingSlice';
import {
  light_green,
  primary_green,
  ultra_dark_gray,
  white,
} from '../styles/colors';

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
            // color: primary_green,
          },
        },
      },
    },
  },
});

const WeekdaySelector = () => {
  const dispatch = useDispatch();
  const handleChange = (event: ChangeEvent, newValue: number) => {
    dispatch(setSelectedDayIndex(newValue));
  };
  const dayIndex = useSelector(getSelectedDayIndex);
  let startDate = useSelector(getDateFirstDay);

  const noTrainings = useSelector(getNoTrainings);

  const userLang = useSelector(getUserLang);

  const generateDays = () => {
    startDate = moment(startDate).utc();
    const viewArray = [];
    for (let index = 0; index < 7; index++) {
      const day = startDate;
      const dayWeekday = moment(day);
      dayWeekday.locale(userLang);
      const firstLine = dayWeekday.format('dd');
      const secondLine = day.format('l');
      const style = noTrainings[index] ? {} : styles.noTraining;
      viewArray.push(
        <Tab
          key={'weekday' + index}
          label={
            <div style={style}>
              <div>{firstLine}</div>
              <div>{secondLine}</div>
            </div>
          }
          {...a11yProps(index)}
        />,
      );
      startDate.add(1, 'day');
    }
    return viewArray;
  };

  return (
    <ThemeProvider theme={customTheme}>
      <div style={styles.container}>
        <div style={styles.tabContainer}>
          <Tabs value={dayIndex} onChange={handleChange}>
            {generateDays()}
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};

type Styles = {
  button: CSSProperties;
  noTraining: CSSProperties;
  container: CSSProperties;
  tabContainer: CSSProperties;
};

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: ultra_dark_gray,
    padding: '8px',
  },
  button: {
    width: 220,
  },
  noTraining: {
    color: light_green,
  },
  tabContainer: {alignSelf: 'center'},
};
export default WeekdaySelector;
