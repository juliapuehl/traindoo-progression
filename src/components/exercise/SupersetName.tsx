import {useEffect, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {InlineTextArea} from '../tailwind/form/InlineTextArea';
import {SupersetNameContainer} from './SupersetNameContainer';
import {useSupersetNameConnect} from './model/useSupersetNameConnect';

export const SupersetName = ({
  exerciseIndex,
  supersetIndex,
  disabled = false,
}: {
  exerciseIndex: number;
  supersetIndex: number;
  disabled?: boolean;
}) => {
  const {value: initialValue, save} = useSupersetNameConnect(exerciseIndex);

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleOnBlur = () => {
    save(value);
  };
  return (
    <SupersetNameContainer supersetIndex={supersetIndex}>
      <InlineTextArea
        onBlur={handleOnBlur}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={twMerge(
          'text-lg font-bold ml-1 w-full input-style',
          disabled && 'text-gray-900',
        )}
        disabled={disabled}
      />
    </SupersetNameContainer>
  );
};
