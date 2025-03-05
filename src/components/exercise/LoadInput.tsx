import {ArrowPathIcon} from '@heroicons/react/24/outline';
import {t} from 'i18n-js';
import {useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {SetSplitterType} from '../../traindoo_shared/types/Training';
//TODO: TANGO DOWN sulo whiskey alpha 3 altes raussuchen und wieder einbauen
// import {
//   setMetric,
//   SetValueType,
//   SET_LOAD_TYPE,
// } from '../../traindoo_shared/types/Training/TrainingExercise';
import {Input} from '../tailwind/form/Input';
import {useLoadType} from './model/useLoadType';

export type LoadInputProps = {
  data?: SetSplitterType;
  onClick?: () => void;
  onChange?: (key: string, value: any) => void;
  onBlur?: (key: string, value: any) => void;
  rerender?: boolean;
  exerciseIndex: number;
  addSetMode?: boolean;
  useOneRM?: boolean;
};

export const LoadInput = ({
  rerender,
  data,
  onClick,
  onChange,
  onBlur,
  exerciseIndex,
  addSetMode,
  useOneRM,
}: LoadInputProps) => {
  //const metricInfo = setMetric?.load;
  const [focused, setFocused] = useState(false);
  const {
    primaryValue,
    secondaryValue,
    loadType,
    switchLoadType,
    placeholder,
    handleChange,
    handleBlur,
  } = useLoadType(
    rerender,
    data?.index,
    exerciseIndex,
    data?.trainer,
    onChange,
    onBlur,
    addSetMode,
    useOneRM,
  );
  const showClacValueCondition = loadType === 'cycle' && secondaryValue;

  const handleBlurHelper = () => {
    setFocused(false);
    if (!onBlur) return;
    handleBlur();
  };
  return (
    <div className="inline-flex items-center h-6" onClick={onClick}>
      {showClacValueCondition && (
        <div className="bg-light_gray border-r border-medium_gray rounded-l-lg px-2 text-white whitespace-nowrap	overflow-hidden flex-1">
          {secondaryValue}
        </div>
      )}
      <Input
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        value={
          loadType !== 'load' && primaryValue && !focused
            ? primaryValue + '%'
            : primaryValue
        }
        onBlur={handleBlurHelper}
        className={twMerge(
          'flex-1 bg-light_gray text-white hover:text-black focus:text-black focus:bg-gray-200 hover:bg-gray-200',
          showClacValueCondition ? `rounded-none` : 'rounded-r-none',
        )}
        onChange={(e) => handleChange(e.target.value)}
      />
      <button
        type="button"
        className={
          'bg-light_gray hover:bg-gray-200 hover:shadow-inner active:bg-gray-300 rounded-r-lg focus:ring-2 focus:outline-none focus:ring-blue-300 text-center inline-flex items-center p-2 h-6'
        }
        onClick={switchLoadType}
        title={t('EXERCISE_LOAD_TYPE_SWITCH')}
      >
        <ArrowPathIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
