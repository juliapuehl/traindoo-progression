import {isEqual} from 'lodash';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {specificTrainingDataQuery} from '../../../logic/firestore';

import {getCurrentAthleteId} from '../../../store/athleteSlice';
import {RootState} from '../../../store/store';
import {
  getSelectedDayIndex,
  getSelectedTrainingId,
  getSpecificExerciseSupersetId,
  getSupersetMeta,
} from '../../../store/trainingSlice';
import {dayIndicesArray} from '../../../traindoo_shared/types/Training';

export const useSupersetNameConnect = (exerciseIndex: number) => {
  const firestore = useFirestore();
  const athleteUserId = useSelector(getCurrentAthleteId);

  const supersetId = useSelector((state: RootState) =>
    getSpecificExerciseSupersetId(state, exerciseIndex),
  );
  const supersetMeta = useSelector(getSupersetMeta, isEqual);
  const supersetName = supersetMeta[supersetId]?.name;

  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);

  const save = (value: string) => {
    firestore.update(specificTrainingDataQuery(athleteUserId, trainingId), {
      ['trainingDays.' +
      dayIndicesArray[dayIndex] +
      '.supersetMeta.' +
      supersetId +
      '.name']: value,
    });
  };

  return {
    value: supersetName,
    save,
  };
};
