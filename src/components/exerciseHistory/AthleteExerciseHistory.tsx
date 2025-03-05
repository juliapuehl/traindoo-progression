import {ArrowLeftIcon, ArrowRightIcon} from '@heroicons/react/24/outline';
import moment from 'moment';
import {twMerge} from 'tailwind-merge';
import {dark_gray} from '../../styles/colors';
import {ExerciseColor} from '../exercise/ExerciseColor';
import {GridHeader} from '../exercise/GridHeader';
import {Card} from '../tailwind/Card';
import {LoadingSpinner} from '../tailwind/LoadingSpinner';
import {IconButton} from '../tailwind/buttons/IconButton';
import {AthleteSetsHistory} from './AthleteSetsHistory';
import {useExerciseHistoryOptionsConnect} from './model/useExerciseHistoryOptionsConnect';

export const AthleteExerciseHistory = ({
  exerciseIndex,
}: {
  exerciseIndex: number;
}) => {
  const {
    exercise,
    exercisePaths,
    loading,
    navigateLeft,
    navigateRight,
    existsAfter,
    existsBefore,
  } = useExerciseHistoryOptionsConnect(exerciseIndex);

  const date = moment(exercisePaths?.date).format('L');

  if (!exercisePaths)
    return (
      <div className="flex items-center justify-center text-gray-700 mt-10">
        No history data available.
      </div>
    );

  return (
    <Card
      className={twMerge('mt-10 relative', loading && 'animate-pulse')}
      style={{background: dark_gray}}
      key={'history#' + exerciseIndex + exercise?.name}
    >
      <ExerciseColor color="neutral" />
      {loading && (
        <div className="flex justify-center items-center w-full h-full absolute top-0 left-0">
          <LoadingSpinner />
        </div>
      )}
      <div
        className="inline-grid gap-2 -mt-8 self-start content-baseline [.break_&]:mt-0 w-full"
        style={{
          gridTemplateColumns:
            '2rem minmax(120px, 2fr) minmax(120px, 2fr) minmax(60px, 1fr) minmax(60px, 1fr) minmax(120px, 4fr)  ',
        }}
      >
        <GridHeader
          titles={[
            'SET',
            'LOAD',
            'REPS',
            exercise?.useRir ? 'RIR' : 'RPE',
            '1RM',
          ]}
        />
        {!loading && (
          <div className="flex -mt-1 pb-[0.125rem] items-end gap-1 justify-self-center justify-space-between">
            {existsBefore && (
              <IconButton
                icon={ArrowLeftIcon}
                onClick={navigateLeft}
                size="sm"
                className={twMerge(
                  'text-gray-400 hover:bg-gray-700',
                  existsBefore === undefined && 'animate-pulse',
                )}
              />
            )}
            <div className="text-gray-100">{date}</div>
            {existsAfter && (
              <IconButton
                icon={ArrowRightIcon}
                onClick={navigateRight}
                size="sm"
                className={twMerge(
                  'text-gray-400 hover:bg-gray-700 -mt-1',
                  existsAfter === undefined && 'animate-pulse',
                )}
              />
            )}
          </div>
        )}
        <AthleteSetsHistory
          keyIndex={exerciseIndex}
          exercisePaths={exercisePaths}
          exercise={exercise}
          loading={loading}
        />
      </div>
    </Card>
  );
};
