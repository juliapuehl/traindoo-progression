import {SetSplitterType} from '../../traindoo_shared/types/Training';
import {LoadInput} from './LoadInput';
import {SetInput} from './SetInput';

export const SetInputContainer = ({
  rerender,
  valueKey,
  onClick = () => null,
  updateValue,
  onBlur,
  set,
  exerciseIndex,
  addSetMode,
  useRir,
  useOneRM,
}: {
  rerender?: boolean;
  valueKey: string;
  set?: SetSplitterType;
  onClick?: () => void;
  updateValue?: (key: string, value: any) => void;
  onBlur?: (key: string, value: any) => void;
  exerciseIndex?: number;
  addSetMode?: boolean;
  useRir?: boolean;
  useOneRM?: boolean;
}) => {
  // Update Value is used for adding sets
  const onChangeWithKey = (key: string, value: any) => {
    if (!updateValue) return;
    updateValue(key, value);
  };

  // onBlur is used for updating sets
  const onBlurWithKey = (path: string, value: any) => {
    if (!onBlur) return;
    onBlur(path, value);
  };
  return (
    <>
      {valueKey === 'load' ? (
        <LoadInput
          data={set}
          rerender={rerender}
          onClick={onClick}
          onChange={onChangeWithKey}
          onBlur={onBlurWithKey}
          exerciseIndex={exerciseIndex}
          addSetMode={addSetMode}
          useOneRM={useOneRM}
        />
      ) : (
        <SetInput
          rerender={rerender}
          onChange={onChangeWithKey}
          onClick={onClick}
          onBlur={onBlurWithKey}
          valueKey={valueKey}
          initialValue={set?.trainer?.[valueKey]}
          useRir={useRir}
        />
      )}
    </>
  );
};
