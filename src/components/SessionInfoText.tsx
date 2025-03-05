import {t} from 'i18n-js';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {getAthleteFirstName} from '../store/athleteSlice';
import {
  getSelectedTrainingEndTimeLastWeek,
  getSelectedTrainingEndTimeThisWeek,
  getSelectedTrainingRPELastWeek,
  getSelectedTrainingRPEThisWeek,
  getShowLastWeek,
  getTrainingStartTimeLastWeek,
  getTrainingStartTimeThisWeek,
} from '../store/trainingSlice';
import {sharedStyle} from '../styles/sharedStyles';

const SessionInfoText = () => {
  const athleteName = useSelector(getAthleteFirstName);
  const showLastWeek = useSelector(getShowLastWeek);

  const sessionRpeLastWeek = useSelector(getSelectedTrainingRPELastWeek);
  const sessionRpeThisWeek = useSelector(getSelectedTrainingRPEThisWeek);
  const sessionRpe = showLastWeek ? sessionRpeLastWeek : sessionRpeThisWeek;
  const sessionRpeFormatted =
    sessionRpe && sessionRpe !== '-1' && sessionRpe !== -1 ? sessionRpe : '-';

  const endTimeLastWeek = useSelector(getSelectedTrainingEndTimeLastWeek);
  const endTimeThisWeek = useSelector(getSelectedTrainingEndTimeThisWeek);

  const startTimeLastWeek = useSelector(getTrainingStartTimeLastWeek);
  const startTimeThisWeek = useSelector(getTrainingStartTimeThisWeek);

  const endTime = showLastWeek ? endTimeLastWeek : endTimeThisWeek;
  const startTime = showLastWeek ? startTimeLastWeek : startTimeThisWeek;
  const duration = moment(endTime).diff(moment(startTime));

  /* Check if strings undefined or empty. Note: trim() is used
   * to make sure that spaces aren't considered valid strings*/
  const timesValid = endTime.trim() && startTime.trim();

  const trainingEndTimeFormatted = timesValid
    ? moment(endTime).format('LT') + ','
    : '';
  const trainingStartTimeFormatted = timesValid
    ? moment(startTime).format('LT')
    : '';

  const durationFormatted = timesValid
    ? // We weren't able to format the duration with moment properly
      new Date(duration).toUTCString().match(/(\d\d:\d\d)/)[0] + 'h'
    : '-';
  const startDateFormatted = timesValid ? moment(startTime).format('ll') : '';

  const title = showLastWeek
    ? t('PLANNING_DAY_SESSION_TITLE_LAST')
    : t('PLANNING_DAY_SESSION_TITLE_THIS');

  const sRPEText = showLastWeek
    ? t('PLANNING_DAY_SESSION_RPE_LAST', {
        rpe: sessionRpeFormatted,
        name: athleteName,
      })
    : t('PLANNING_DAY_SESSION_RPE_THIS', {
        rpe: sessionRpeFormatted,
        name: athleteName,
      });

  const durationText = showLastWeek
    ? t('PLANNING_DAY_SESSION_DURATION', {
        duration: durationFormatted,
        training_start: trainingStartTimeFormatted,
        training_end: trainingEndTimeFormatted,
        training_date: startDateFormatted,
      })
    : t('PLANNING_DAY_SESSION_DURATION', {
        duration: durationFormatted,
        training_start: trainingStartTimeFormatted,
        training_end: trainingEndTimeFormatted,
        training_date: startDateFormatted,
      });

  return (
    <div>
      <div style={sharedStyle.textStyle.primary_white_capital}>{title}</div>
      <div style={sharedStyle.textStyle.regular}>{sRPEText}</div>
      <div style={sharedStyle.textStyle.regular}>{durationText}</div>
    </div>
  );
};

export default SessionInfoText;
