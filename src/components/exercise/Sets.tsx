import {PencilSquareIcon} from '@heroicons/react/24/outline';
import {range} from 'lodash';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useSelector} from 'react-redux';
import {twMerge} from 'tailwind-merge';
import {RootState} from '../../store/store';
import {
  getAmountSets,
  getExerciseTrainerNote,
  getExerciseUseRir,
} from '../../store/trainingSlice';
import {RoundedIconButton} from '../tailwind/buttons/RoundedIconButton';
import {AddSets} from './AddSets';
import {GridHeader} from './GridHeader';
import {Set} from './Set';

export const Sets = ({
  setShowNote,
  exerciseIndex,
}: {
  exerciseIndex: number;
  setShowNote: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedSet, setSelectedSet] = useState<number>(undefined);
  const trainerNote = useSelector((state: RootState) =>
    getExerciseTrainerNote(state, exerciseIndex),
  );
  const useRir = useSelector((state: RootState) =>
    getExerciseUseRir(state, exerciseIndex),
  );
  const amountSets = useSelector((state: RootState) =>
    getAmountSets(state, exerciseIndex),
  );
  const gridRef = useRef(null);

  const handleClick = useCallback((e: MouseEvent) => {
    if (gridRef.current && e.target && gridRef.current.contains(e.target))
      return;
    setSelectedSet(undefined);
  }, []);
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  return (
    <div
      className="inline-grid gap-2 -mt-8 self-start content-baseline [.break_&]:mt-0 w-full"
      style={{
        gridTemplateColumns:
          '2rem minmax(120px, 2fr) minmax(120px, 2fr) minmax(60px, 1fr) 1.5rem [note]',
      }}
      ref={gridRef}
    >
      <GridHeader
        titles={['SET', 'LOAD', 'REPS', useRir ? 'RIR' : 'RPE', '', '']}
      />

      {range(amountSets).map((setIndex) => (
        <Set
          key={`exercise#${exerciseIndex}-set#${setIndex}`}
          selectedSet={selectedSet}
          setSelectedSet={setSelectedSet}
          exerciseIndex={exerciseIndex}
          setIndex={setIndex}
        />
      ))}

      <AddSets
        exerciseIndex={exerciseIndex}
        onClick={() => setSelectedSet(undefined)}
      />

      {amountSets > 0 && (
        <RoundedIconButton
          className={twMerge(
            'bg-light_gray text-white hover:bg-gray-300 active:bg-gray-400',
            trainerNote
              ? 'bg-green-300 hover:bg-green-200 invisible [.break_&]:visible'
              : ' invisible [.break_&]:visible',
          )}
          icon={PencilSquareIcon}
          alt="Edit note"
          onClick={() => setShowNote((prev) => !prev)}
          style={{
            gridArea: 'note',
            gridRowStart: 2,
            gridRowEnd: amountSets + 2,
          }}
          size={amountSets > 1 ? 'md' : 'sm'}
        />
      )}
    </div>
  );
};
