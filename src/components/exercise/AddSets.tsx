import {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {twMerge} from 'tailwind-merge';
import {RootState} from '../../store/store';
import {getExerciseUseRir} from '../../store/trainingSlice';
import {useTrackingSession} from '../progressionFeature/model/useTrackingSession';
import {TextButton} from '../tailwind/buttons/TextButton';
import {Input} from '../tailwind/form/Input';
import {useAddSetConnect} from './model/set/useAddSetConnect';
import {SetInputContainer} from './SetInputContainer';

export const AddSets = ({
  exerciseIndex,
  onClick,
}: {
  exerciseIndex: number;
  onClick: () => void;
}) => {
  const {registerUserActivity} = useTrackingSession();
  const [hasInput, setHasInput] = useState(false);

  const newSets = useRef({
    load: '',
    reps: '',
    rpe: '',
    percentOneRm: '',
    usePercentOneRm: false,
  });
  const [amountSets, setAmountSets] = useState<number>(1);
  const [rerender, setRerender] = useState(false);
  const useRir = useSelector((state: RootState) =>
    getExerciseUseRir(state, exerciseIndex),
  );
  const {addSets} = useAddSetConnect(exerciseIndex);
  const onValueChange = (path: string, value: any) => {
    newSets.current[path] = value;
    const tmp =
      newSets.current.load !== '' ||
      newSets.current.reps !== '' ||
      newSets.current.rpe !== '' ||
      newSets.current.percentOneRm !== '';
    setHasInput(tmp);
  };
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmpAmount =
      e.target.value === '' ? undefined : parseInt(e.target.value);
    if (tmpAmount === undefined || tmpAmount > 0) {
      setAmountSets(tmpAmount);
    } else if (tmpAmount <= 1) {
      setAmountSets(1);
    }
  };

  const handleAdd = async () => {
    registerUserActivity('added new set', '');
    setRerender(!rerender);
    setAmountSets(1);
    await addSets({amount: amountSets ?? 1, ...newSets.current});
    newSets.current = {
      load: '',
      reps: '',
      rpe: '',
      percentOneRm: '',
      usePercentOneRm: false,
    };
  };

  return (
    <>
      <Input
        className="appearance-none bg-light_gray text-white hover:text-black focus:text-black focus:bg-gray-200 hover:bg-gray-200"
        value={amountSets}
        type="number"
        onChange={handleAmount}
      />
      <SetInputContainer
        rerender={rerender}
        key={'load'}
        valueKey={'load'}
        updateValue={onValueChange}
        exerciseIndex={exerciseIndex}
        useOneRM={newSets?.current?.usePercentOneRm}
        addSetMode
        useRir={useRir}
      />
      <SetInputContainer
        rerender={rerender}
        key={'reps'}
        valueKey={'reps'}
        updateValue={onValueChange}
        addSetMode
        useRir={useRir}
      />
      <SetInputContainer
        rerender={rerender}
        key={'rpe'}
        valueKey={'rpe'}
        updateValue={onValueChange}
        addSetMode
        useRir={useRir}
      />
      <TextButton
        size="sm"
        text={'Add'}
        style={{gridColumnStart: 5, gridColumnEnd: 7}}
        className={twMerge(
          'bg-light_gray text-white',
          hasInput && 'bg-highlight',
        )}
        onClick={handleAdd}
      />
    </>
  );
};
