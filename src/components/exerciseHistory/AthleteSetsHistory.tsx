import {ExerciseType} from '../../traindoo_shared/types/Training';
import {AthleteSetHistoryLine} from './AthleteSetHistoryLine';
import {ExerciseHistoryContainer} from './model/useExerciseHistoryOptionsConnect';

type Props = {
  loading: boolean;
  keyIndex: number;
  exercisePaths?: ExerciseHistoryContainer;
  exercise?: ExerciseType;
};
export const AthleteSetsHistory = ({
  keyIndex,
  loading,
  exercisePaths,
  exercise,
}: Props) => {
  if (!loading && exercise?.sets) {
    return (
      <>
        {Object.values(exercise?.sets)
          .sort((a, b) => a.index - b.index)
          .map((set, index) => (
            <AthleteSetHistoryLine
              set={set}
              useRir={exercise.useRir}
              key={index + keyIndex}
              exercisePaths={exercisePaths}
            />
          ))}
      </>
    );
  } else {
    return <></>;
  }
};
