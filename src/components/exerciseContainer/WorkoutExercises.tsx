import {PlusIcon} from '@heroicons/react/20/solid';
import {ClipboardIcon} from '@heroicons/react/24/outline';
import {isEqual} from 'lodash';
import React, {Fragment, ReactNode, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {getAmountExercises, getSupersetMeta} from '../../store/trainingSlice';
import {SupersetMeta} from '../../traindoo_shared/types/Training';
import {getExercisePositionWithinSuperset} from '../../utils/SupersetFrameStyling';
import {
  ExerciseComponent,
  ExerciseComponentProps,
} from '../exercise/ExerciseComponent';
import {useAddExerciseConnect} from '../exercise/model/exercise/useAddExerciseConnect';
import {usePasteExerciseConnect} from '../exercise/model/exercise/usePasteExerciseConnect';
import {SupersetName} from '../exercise/SupersetName';
import {useTrackingSession} from '../progressionFeature/model/useTrackingSession';
import {IconButton} from '../tailwind/buttons/IconButton';

type GroupedBySuperset = {
  [id: string | number]: {
    exerciseIndicesArray: number[];
    supersetPosition: number;
    supersetId: string;
  };
};

export const groupExercisesBySuperset = (
  exercisesAmount: number,
  supersetMeta: SupersetMeta,
) => {
  if (!exercisesAmount || exercisesAmount === 0) return undefined;

  const exercisesGroupedBySuperset: GroupedBySuperset = {};
  Array(exercisesAmount)
    .fill(0)
    .forEach((_, exerciseIndex) => {
      // const supersetId = exercise.supersetId;
      const supersetId = supersetMeta
        ? Object.values(supersetMeta).find((meta) =>
            meta?.exerciseIndices?.includes(exerciseIndex),
          )?.id
        : undefined;

      const exerciseIsInSuperset = supersetId !== undefined;
      const supersetIndicesArray = exercisesGroupedBySuperset[supersetId]
        ?.exerciseIndicesArray
        ? exercisesGroupedBySuperset[supersetId].exerciseIndicesArray
        : [];
      supersetIndicesArray.push(exerciseIndex);
      exercisesGroupedBySuperset[
        exerciseIsInSuperset ? supersetId : exerciseIndex
      ] = {
        exerciseIndicesArray: supersetIndicesArray,
        supersetPosition: exerciseIndex,
        supersetId: supersetId,
      };
    });

  return exercisesGroupedBySuperset
    ? Object.values(exercisesGroupedBySuperset).sort(
        (a, b) => a.supersetPosition - b.supersetPosition,
      )
    : undefined;
};

export const WorkoutExercises = ({
  match,
  customConstructor = false,
  exerciseConstructor,
  supersetConstructor,
  showAddIcon,
}: {
  match?: {
    exerciseMatch: (exerciseIndex: number) => ReactNode;
    supersetNameMatch: (exerciseIndex: number) => ReactNode;
  };
  customConstructor?: boolean;
  showAddIcon?: boolean;
  exerciseConstructor?: (props: ExerciseComponentProps) => JSX.Element;
  supersetConstructor?: (props: {
    supersetIndex: number;
    exerciseIndex: number;
  }) => JSX.Element;
}) => {
  const exercisesAmount = useSelector(getAmountExercises);
  const supersetMeta = useSelector(getSupersetMeta, isEqual);
  const addExercise = useAddExerciseConnect();
  const {pasteExercise, showInsertIcon} = usePasteExerciseConnect(0);
  const handlePasteExercise = () => {
    pasteExercise('notInSuperset');
  };
  const supersets = useMemo(
    () => groupExercisesBySuperset(exercisesAmount, supersetMeta),
    [exercisesAmount, supersetMeta],
  );

  const ExerciseConstructor = customConstructor
    ? exerciseConstructor
    : ExerciseComponent;

  const SupersetConstructor = customConstructor
    ? supersetConstructor
    : SupersetName;

  const ContainerComponent = (props: any) =>
    React.createElement(match ? Fragment : 'div', props, ...props.children);

  const {registerUserActivity} = useTrackingSession();
  const result = supersets?.flatMap((superset, supersetIndex) =>
    superset.exerciseIndicesArray.flatMap(
      (exerciseIndex, indexWithinSuperset) => {
        const positionWithinSuperset = getExercisePositionWithinSuperset(
          indexWithinSuperset,
          superset.exerciseIndicesArray.length,
        );
        return (
          <Fragment key={'exercise' + supersetIndex + indexWithinSuperset}>
            {positionWithinSuperset === 'firstExercise' && (
              <>
                <SupersetConstructor
                  exerciseIndex={exerciseIndex}
                  supersetIndex={supersetIndex}
                />
                {match && match.supersetNameMatch(exerciseIndex)}
              </>
            )}

            <ExerciseConstructor
              exerciseIndex={exerciseIndex}
              supersetIndex={supersetIndex}
              supersetId={superset.supersetId}
              indexWithinSuperset={indexWithinSuperset}
              positionWithinSuperset={positionWithinSuperset}
            />
            {match && match.exerciseMatch(exerciseIndex)}
          </Fragment>
        );
      },
    ),
  );
  return (
    <ContainerComponent>
      {result}
      {showAddIcon && (
        <>
          <div>
            <div className="flex-row">
              <IconButton
                className="text-green-500"
                size="lg"
                onClick={() => {
                  registerUserActivity('added exercise', '');
                  addExercise(undefined);
                }}
                icon={PlusIcon}
              />
              {showInsertIcon && (
                <IconButton
                  className="text-green-500"
                  size="lg"
                  onClick={handlePasteExercise}
                  icon={ClipboardIcon}
                />
              )}
            </div>
          </div>
        </>
      )}
    </ContainerComponent>
  );
};

// WorkoutExercises.whyDidYouRender = true;
