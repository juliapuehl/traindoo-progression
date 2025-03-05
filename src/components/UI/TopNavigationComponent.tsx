import {AppBar} from '@mui/material';
import {CSSProperties, useState} from 'react';
import {useSelector} from 'react-redux';
import {getSelectedAthlete} from '../../logic/firestore';
import {getCurrentAthleteOneRMTable} from '../../store/athleteSlice';
import {ultra_dark_gray} from '../../styles/colors';
import {trainerOneRMTableOptions} from '../../traindoo_shared/types/User';
import AthleteCard from '../AthleteCard';
import {AthleteSettingsPopover} from '../AthleteSettingsPopover';
import GeneralAthleteNote from '../GeneralAthleteNote';
import OneRMCard from '../OneRMCard';
import WeekdaySelector from '../WeekDaySelector';

const TopNavigationComponent = () => {
  const athlete = useSelector(getSelectedAthlete);
  const oneRMTable = useSelector(getCurrentAthleteOneRMTable);

  const [openAthleteSettings, setOpenAthleteSettings] = useState(false);
  return (
    <>
      <AppBar position="static">
        <div style={styles.container}>
          <WeekdaySelector />
          {oneRMTable !== trainerOneRMTableOptions.none && <OneRMCard />}
          <GeneralAthleteNote />
          {athlete && (
            <AthleteCard
              onClick={() => {
                setOpenAthleteSettings(true);
              }}
              athlete={athlete}
              athleteState={athlete?.athlete?.trainerInfo?.currentState}
            />
          )}
        </div>
      </AppBar>
      <AthleteSettingsPopover
        open={openAthleteSettings}
        handleClose={() => {
          setOpenAthleteSettings(false);
        }}
      />
    </>
  );
};

type Styles = {
  container: CSSProperties;
  button: CSSProperties;
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
};
export default TopNavigationComponent;
