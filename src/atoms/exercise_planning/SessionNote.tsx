import {useSelector} from 'react-redux';
import {DailyCheckRemarkIcon} from '../../components/DailyCheckRemarkIcon';
import {getSelectedTrainingNoteThisWeek} from '../../store/trainingSlice';

export const SessionNote = () => {
  const sessionNoteThisWeek = useSelector(getSelectedTrainingNoteThisWeek);
  const sessionNote = sessionNoteThisWeek;
  return (
    <DailyCheckRemarkIcon active={Boolean(sessionNote)} text={sessionNote} />
  );
};
