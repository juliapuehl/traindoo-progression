import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {RootState} from '../../../../store/store';
import {
  getDayCopied,
  getDayCopiedExists,
  getSelectedDayIndex,
  getSelectedTrainingId,
  isDayCopied,
  resetCopyDay,
} from '../../../../store/trainingSlice';
import {insertCopiedDay} from '../../../../utils/editingTrainingHelper';

export const useDayPasteConnect = () => {
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const athleteId = useSelector(getCurrentAthleteId);
  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const dayCopiedExists = useSelector(getDayCopiedExists);
  const thisDayCopied = useSelector((state: RootState) =>
    isDayCopied(state, trainingId, dayIndex),
  );
  const dayCopied = useSelector(getDayCopied);
  const insertCopy = async () => {
    insertCopiedDay(trainingId, dayIndex, dayCopied, athleteId, firestore);
    dispatch(resetCopyDay());
  };

  return {
    showInsert: dayCopiedExists && !thisDayCopied,
    dayIsCopied: thisDayCopied,
    copyName: dayCopied?.name ?? dayCopied?.date,
    insertCopy,
  };
};
