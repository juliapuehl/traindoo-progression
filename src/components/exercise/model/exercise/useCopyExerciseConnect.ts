import {cloneDeep} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../../../store/store';
import {
  getSpecificExercise,
  isExerciseCopied,
  setCopyExercise,
} from '../../../../store/trainingSlice';

export const useCopyExerciseConnect = (exerciseIndex: number) => {
  const dispatch = useDispatch();

  const exercise = useSelector((state: RootState) =>
    getSpecificExercise(state, exerciseIndex),
  );
  const exerciseIsCopied = useSelector((state: RootState) =>
    isExerciseCopied(state, exerciseIndex),
  );

  const copyExercise = () => {
    const newExercise = cloneDeep(exercise);
    delete newExercise.supersetId;
    dispatch(
      setCopyExercise({
        exercise: newExercise,
        exerciseIndex: exerciseIndex,
      }),
    );
  };

  return {
    copyExercise,
    exerciseIsCopied: exerciseIsCopied,
  };
};
