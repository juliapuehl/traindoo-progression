import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {useCurrentWidth} from 'react-socks';
import {
  getCurrentAthleteId,
  getCurrentAthleteTrainerNote,
} from '../store/athleteSlice';
import {dark_gray, ultra_light_gray} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {editAthleteTrainerNote} from '../utils/editingAthleteHelper';
import TrainingNote from './TrainingNote';

const GeneralAthleteNote = () => {
  const athleteUserId = useSelector(getCurrentAthleteId);
  const firestore = useFirestore();
  const note = useSelector(getCurrentAthleteTrainerNote);
  const screenWidth = useCurrentWidth();

  const handleChangeNote = (text: string) => {
    if (text !== undefined) {
      editAthleteTrainerNote(text, athleteUserId, firestore);
    }
  };

  // I didnt get the width to scale responsive. This is a workaround
  const maxWidth =
    screenWidth < 2500
      ? {maxWidth: (360 / (2500 / screenWidth)) % 360}
      : {maxWidth: 360};

  return (
    <div style={{...styles.container, ...maxWidth}}>
      <span style={sharedStyle.textStyle.primary_white_capital}>
        {t('PLANNING_GENERAL_NOTE_TITLE')}
      </span>
      <TrainingNote
        text={note}
        uploadValue={handleChangeNote}
        style={{...styles.trainerNote}}
        description={t('PLANNING_GENERAL_NOTE_DESCRIPTION')}
      />
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  trainerNote: CSSProperties;
};

const styles: Styles = {
  container: {
    borderRadius: 8,
    padding: 8,
    color: ultra_light_gray,
    backgroundColor: dark_gray,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  trainerNote: {},
};

export default GeneralAthleteNote;
