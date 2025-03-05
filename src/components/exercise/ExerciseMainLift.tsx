import {Select} from '../tailwind/form/Select';
import {useDebouncedState} from './hooks/useDebouncedState';
import {usePrimaryExerciseConnect} from './model/exercise/usePrimaryExerciseConnect';

export const ExerciseMainLift = ({exerciseIndex}: {exerciseIndex: number}) => {
  const {selectedPrimary, options, setPrimary, showSelect} =
    usePrimaryExerciseConnect(exerciseIndex);

  const [selected, setSelected] = useDebouncedState(
    selectedPrimary,
    setPrimary,
  );

  if (!showSelect) return null;

  return (
    <Select
      className="max-w-[180px] bg-light_gray border-medium_gray text-white"
      placeholder="Mainlift"
      options={options.map((opt) => opt.label)}
      value={options.find((opt) => opt.value === selected)?.label}
      onChange={(label) =>
        setSelected(options.find((opt) => label === opt.label).value)
      }
    />
  );
};
