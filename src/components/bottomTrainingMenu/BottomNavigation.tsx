import BottomNavigation from '@mui/material/BottomNavigation';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import {CSSProperties, useRef} from 'react';
import {ultra_dark_gray} from '../../styles/colors';
import {WeekNavigation} from './WeekNavigation';

type Props = {
  hideWeekSelection?: boolean;
  hideViewSelection?: boolean;
  checkPlanningScreen?: boolean;
};

export default function FixedBottomNavigation(props: Props) {
  const ref = useRef<HTMLDivElement>(null);

  Intercom('update', {
    vertical_padding: 76,
  });

  return (
    <Box sx={{pb: 0}} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        elevation={3}
      >
        <BottomNavigation showLabels style={styles.bottomNavigator}>
          <WeekNavigation
            hideWeekSelection={props.hideWeekSelection}
            hideViewSelection={props.hideViewSelection}
            checkPlanningScreen={props.checkPlanningScreen}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

type Style = {
  bottomNavigator: CSSProperties;
};

const styles: Style = {
  bottomNavigator: {backgroundColor: ultra_dark_gray, justifyContent: 'center'},
};
