import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {RootState} from '../../../../store/store';
import {
  getSelectedTrainingId,
  getWeekCopied,
  isWeekCopied,
  resetCopyWeek,
  showInsertWeek,
} from '../../../../store/trainingSlice';
import {insertCopiedWeek} from '../../../../utils/editingTrainingHelper';

export const useWeekPasteConnect = () => {
  const [pasteLoading, setPasteLoading] = useState(false);
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);
  const trainingId = useSelector(getSelectedTrainingId);
  const copiedWeek = useSelector(getWeekCopied);
  const dispatch = useDispatch();
  const showInsert = useSelector((state: RootState) =>
    showInsertWeek(state, trainingId),
  );
  const weekCopied = useSelector((state: RootState) =>
    isWeekCopied(state, trainingId),
  );

  const pasteWeek = async () => {
    setPasteLoading(true);
    try {
      await insertCopiedWeek(trainingId, copiedWeek, athleteUserId, firestore);
      dispatch(resetCopyWeek());
    } catch (error) {
      console.error(error);
    } finally {
      setPasteLoading(false);
    }
  };

  return {
    pasteLoading,
    showInsert,
    weekCopied,
    copyName: copiedWeek?.name ?? copiedWeek?.startDate,
    pasteWeek,
  };
};
