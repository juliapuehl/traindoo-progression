import {DocumentDuplicateIcon, TrashIcon} from '@heroicons/react/24/outline';
import {t} from 'i18n-js';
import {ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';
import {MenuDivider} from '../menu/Menu';
import {IconButton} from '../tailwind/buttons/IconButton';
import {useAddExerciseConnect} from './model/exercise/useAddExerciseConnect';
import {useCopyExerciseConnect} from './model/exercise/useCopyExerciseConnect';
import {useDeleteExerciseConnect} from './model/exercise/useDeleteExerciseConnect';
import {useRirRpeConnect} from './model/useRirRpeConnect';

type Props = {
  Menu: (props: {children: ReactNode}) => JSX.Element;
  exerciseIndex: number;
  setShowNote: (_: boolean) => void;
  setShowGraph: (_: boolean) => void;
  showGraph: boolean;
};

export const ExerciseContextMenu = ({
  Menu,
  exerciseIndex,
  setShowNote,
  setShowGraph,
  showGraph,
}: Props) => {
  const {deleteExercise} = useDeleteExerciseConnect(exerciseIndex);
  const {useRir, switchRirRpe} = useRirRpeConnect(exerciseIndex);
  const addExercise = useAddExerciseConnect();
  const {copyExercise, exerciseIsCopied} =
    useCopyExerciseConnect(exerciseIndex);

  const buttonArray = [
    {name: t('EXERCISE_CONTEXT_NOTE'), onClick: () => setShowNote(true)},
    {
      name: t('EXERCISE_CONTEXT_RPE_SWITCH', {value: useRir ? 'RPE' : 'RIR'}),
      onClick: switchRirRpe,
    },
    {
      name: showGraph
        ? t('EXERCISE_CONTEXT_GRAPH_OFF')
        : t('EXERCISE_CONTEXT_GRAPH'),
      onClick: () => setShowGraph(!showGraph),
    },
    {
      name: t('EXERCISE_CONTEXT_ADD_ABOVE'),
      onClick: () => addExercise(exerciseIndex),
    },
    {
      name: t('EXERCISE_CONTEXT_ADD_BELOW'),
      onClick: () => addExercise(exerciseIndex + 1),
    },
  ];
  return (
    <Menu>
      <div className="p-2">
        <IconButton
          icon={TrashIcon}
          className="text-red-700"
          title="Delete"
          onClick={deleteExercise}
        />
        <IconButton
          icon={DocumentDuplicateIcon}
          title="Copy"
          onClick={copyExercise}
          className={twMerge(
            'text-light_gray',
            exerciseIsCopied && 'text-highlight',
          )}
          disabled={exerciseIsCopied}
        />
      </div>
      <MenuDivider />
      {buttonArray.map((element) => (
        <button
          key={'Button' + element.name}
          onClick={element.onClick}
          className="hover:bg-gray-100 p-2 text-left"
        >
          {element.name}
        </button>
      ))}
    </Menu>
  );
};
