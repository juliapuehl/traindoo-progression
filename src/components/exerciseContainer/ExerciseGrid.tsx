import {createTheme, ThemeProvider} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, ReactNode, SyntheticEvent, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {primary_green, ultra_light_gray} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import {WorkoutAthleteLastWeekSwitch} from '../WorkoutAthleteLastWeekSwitch';
import {useSplitViewGrid} from './hooks/useSplitViewGrid';

function a11yProps(index: number) {
  return {
    id: `tab-workout-${index}`,
    'aria-controls': `tabpanel-workout-${index}`,
  };
}

const theme = createTheme({
  palette: {
    primary: {
      main: primary_green,
    },
    secondary: {
      main: ultra_light_gray,
    },
    text: {
      primary: primary_green,
      secondary: ultra_light_gray,
    },
  },
});

export const ExerciseGrid = ({
  children,
}: {
  children: (tabIndex: number) => ReactNode;
}) => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleChange = (e: SyntheticEvent<Element, Event>, index: number) =>
    setTabIndex(index);

  const {gridRef, gutterRef} = useSplitViewGrid();
  return (
    <ThemeProvider theme={theme}>
      <div
        className="grid w-full min-w-0 min-h-0 grid-rows-1 grid-cols-[1fr_20px_1fr]"
        ref={gridRef}
      >
        <div style={{...sharedStyle.textStyle.title1, ...styles.headline}}>
          {t('PLANNING_EXERCISE_TITLE')}
        </div>
        <div
          className={twMerge(
            `relative z-20 row-start-1 col-start-2 col-end-3 cursor-col-resize 
            mx-1 hover:bg-opacity-5 hover:bg-gray-100 transition-colors`,
            `row-end-[100]`,
          )}
          ref={gutterRef}
        />
        <div
          className={twMerge(
            'relative z-10 row-start-1 col-start-2 col-end-3 cursor-e-resize mx-1',
            `row-end-[100]`,
          )}
          id={'Slider'}
        >
          <span className="absolute w-full h-full clip">
            <img
              className="sticky mt-2 top-[calc(50%_-_23px-0.5rem)] text-highlight-300"
              src={`${process.env.PUBLIC_URL}/drag.png`}
            />
            <img
              className="sticky mt-2 top-[calc(50%_-_15px-0.5rem)] text-highlight-300"
              src={`${process.env.PUBLIC_URL}/drag.png`}
            />
            <img
              className="sticky mt-2 top-[calc(50%_-_7px-0.5rem)] text-highlight-300"
              src={`${process.env.PUBLIC_URL}/drag.png`}
            />
          </span>
        </div>

        <div style={{...sharedStyle.textStyle.title1, ...styles.headline}}>
          <WorkoutAthleteLastWeekSwitch />
        </div>

        {children(tabIndex)}
      </div>
    </ThemeProvider>
  );
};

type Styles = {
  headline: CSSProperties;
};

const styles: Styles = {
  headline: {marginTop: 8, marginLeft: 32},
};
