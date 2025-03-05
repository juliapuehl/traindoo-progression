import {t} from 'i18n-js';
import {ChangeEvent, useEffect, useState} from 'react';
import {valueIsGiven} from '../../utils/helper';
import {Input} from '../tailwind/form/Input';

type Props = {
  initialValue?: any;
  rerender?: boolean;
  onChange: (key: string, value: any) => void;
  onClick?: () => void;
  onBlur?: (key: string, value: any) => void;
  valueKey: string;
  useRir?: boolean;
};

export const SetInput = ({
  rerender,
  initialValue,
  onChange,
  onClick,
  onBlur,
  valueKey,
  useRir,
}: Props) => {
  const [value, setValue] = useState(
    valueIsGiven(initialValue) ? initialValue : '',
  );
  useEffect(() => {
    setValue(valueIsGiven(initialValue) ? initialValue : '');
  }, [initialValue, rerender]);

  const handleBlur = () => {
    if (onBlur) {
      onBlur(valueKey, value);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(valueKey, e.target.value);
    }
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      onClick={onClick}
      onBlur={handleBlur}
      className="bg-light_gray text-white hover:text-black focus:text-black focus:bg-gray-200 hover:bg-gray-200 "
      placeholder={
        valueKey === 'reps'
          ? t('PLANNING_ATHLETE_HEADLINE_REPS')
          : useRir
          ? t('PLANNING_ATHLETE_HEADLINE_RIR')
          : t('PLANNING_ATHLETE_HEADLINE_RPE')
      }
    />
  );
};
