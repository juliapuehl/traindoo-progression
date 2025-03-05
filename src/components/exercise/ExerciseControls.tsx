import {
  ArrowDownIcon,
  ArrowUpIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {IconButton} from '../tailwind/buttons/IconButton';
import {useMoveExerciseConnect} from './model/exercise/useMoveExerciseConnect';

export const ExerciseControls = ({
  index,
  onMenuTrigger,
}: {
  index: number;
  onMenuTrigger: (event: any) => void;
}) => {
  const {moveExerciseDown, moveExerciseUp, exercisesAmount} =
    useMoveExerciseConnect(index);
  return (
    <div className="flex flex-col justify-between">
      {index > 0 ? (
        <IconButton icon={ArrowUpIcon} onClick={moveExerciseUp} />
      ) : (
        <div className="h-4"></div>
      )}
      <IconButton onClick={onMenuTrigger} icon={EllipsisHorizontalIcon} />
      {index + 1 < exercisesAmount ? (
        <IconButton icon={ArrowDownIcon} onClick={moveExerciseDown} />
      ) : (
        <div className="h-4"></div>
      )}
    </div>
  );
};
