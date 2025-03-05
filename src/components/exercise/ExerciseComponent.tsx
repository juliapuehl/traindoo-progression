import {ClipboardIcon, LinkIcon, PlusIcon} from '@heroicons/react/24/outline';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {twMerge} from 'tailwind-merge';
import {useHandleSupersetIcon} from '../../hooks/useHandleSupersetIcon';
import {RootState} from '../../store/store';
import {getAmountSets} from '../../store/trainingSlice';
import {dark_gray} from '../../styles/colors';
import {generateUppercaseAlphabet} from '../../utils/helper';
import {PositionWithinSuperset} from '../../utils/SupersetFrameStyling';
import {useContextMenu} from '../menu/useContextMenu';
import {NoteTextField} from '../NoteTextField';
import {useTrackingSession} from '../progressionFeature/model/useTrackingSession';
import {IconButton} from '../tailwind/buttons/IconButton';
import {Card} from '../tailwind/Card';
import {WorkoutGraphComponent} from '../WorkoutGraphComponent';
import {ExerciseColor} from './ExerciseColor';
import {ExerciseContextMenu} from './ExerciseContextMenu';
import {ExerciseControls} from './ExerciseControls';
import {ExerciseTitle} from './ExerciseTitle';
import {useResizeObserver} from './hooks/useResizeObserver';
import {useAddExerciseConnect} from './model/exercise/useAddExerciseConnect';
import {usePasteExerciseConnect} from './model/exercise/usePasteExerciseConnect';
import {NoteEditor} from './NoteEditor';
import {Sets} from './Sets';

export type SupersetProps = {
  supersetIndex: number;
  indexWithinSuperset: number;
  positionWithinSuperset: PositionWithinSuperset;
  supersetId: string;
};

export type ExerciseComponentProps = {
  exerciseIndex: number;
} & SupersetProps;

// 1.5 for input heigt + 0.5 for input padding - subract one input padding
export const heightFormular = (count) =>
  (count > 2 ? count + 1 : 3) * (1.5 + 0.5) - 0.5;

export const alphabet = generateUppercaseAlphabet();

export const ExerciseComponent = ({
  exerciseIndex,
  ...props
}: ExerciseComponentProps) => {
  const {registerUserActivity} = useTrackingSession();
  const {ref: containerRef} = useResizeObserver({
    break: 860,
  });

  const minHeight = heightFormular(0) + 1; //min height of grid + padding (2 * 0.5rem);
  const amountSets = useSelector((state: RootState) =>
    getAmountSets(state, exerciseIndex),
  );
  const [showNote, setShowNote] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const {Menu, onTrigger} = useContextMenu();

  const addExercise = useAddExerciseConnect();
  const {pasteExercise, showInsertIcon} =
    usePasteExerciseConnect(exerciseIndex);
  const {supersetHandler} = useHandleSupersetIcon(exerciseIndex);

  const handlePaste = () => {
    pasteExercise('lastExercise');
  };

  return (
    <>
      <ExerciseContextMenu
        Menu={Menu}
        exerciseIndex={exerciseIndex}
        setShowNote={setShowNote}
        setShowGraph={setShowGraph}
        showGraph={showGraph}
      />
      <div
        className="inline-flex flex-col w-full"
        ref={containerRef}
        id="exercise-grid"
      >
        <div>
          <IconButton
            icon={PlusIcon}
            size="sm"
            className="text-highlight hover:text-highlight hover:bg-gray-700 my-2 ml-10"
            onClick={() => {
              registerUserActivity('added exercise', '');
              addExercise(exerciseIndex);
            }}
          />
          {showInsertIcon && (
            <IconButton
              icon={ClipboardIcon}
              size="sm"
              className="text-highlight hover:text-highlight hover:bg-gray-700 my-2 ml-2"
              onClick={handlePaste}
            />
          )}
          {exerciseIndex !== 0 && (
            <IconButton
              icon={LinkIcon}
              size="sm"
              className={twMerge(
                'text-white hover:bg-gray-700 my-2 ml-2',
                (props.positionWithinSuperset === 'middleExercise' ||
                  props.positionWithinSuperset === 'lastExercise') &&
                  (props.supersetIndex % 2 == 0
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-cyan-400 hover:text-cyan-300'),
              )}
              onClick={supersetHandler}
            />
          )}
        </div>
        <div>
          <Card
            onContextMenu={onTrigger}
            style={{minHeight: minHeight + 'rem', background: dark_gray}}
          >
            <ExerciseColor
              color={
                (props.positionWithinSuperset !== 'notInSuperset' &&
                  (props.supersetIndex % 2 == 0 ? 'primary' : 'secondary')) ||
                undefined
              }
            >
              {alphabet[props.supersetIndex]}
              {props.indexWithinSuperset + 1}
            </ExerciseColor>
            <div className="flex items-stretch gap-2 w-full">
              {showGraph ? (
                <WorkoutGraphComponent
                  exerciseIndex={exerciseIndex}
                  setShowGraph={() => setShowGraph(false)}
                />
              ) : (
                <>
                  <div className="flex gap-2 w-full items-center [.break_&]:flex-wrap">
                    <div className="w-full max-w-[260px] min-w-[120px] [.break_&]:max-w-full">
                      <ExerciseTitle exerciseIndex={exerciseIndex} />
                    </div>
                    {showNote ? (
                      <NoteEditor
                        onClose={() => setShowNote(false)}
                        height={heightFormular(amountSets) + 'rem'}
                        exerciseIndex={exerciseIndex}
                      />
                    ) : (
                      <Sets
                        exerciseIndex={exerciseIndex}
                        setShowNote={setShowNote}
                      />
                    )}
                    {!showNote && (
                      <NoteTextField
                        // height={heightFormular(amountSets) + 'rem'}
                        exerciseIndex={exerciseIndex}
                      />
                    )}
                  </div>

                  <ExerciseControls
                    index={exerciseIndex}
                    onMenuTrigger={onTrigger}
                  />
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
