import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {valueIsGiven} from '../../utils/helper';
import {Input} from '../tailwind/form/Input';
import {useEditAthletePermissionAlert} from '../useEditAthletePermissionAlert';

type Props = {
  value: string | number;
  onBlur: (_: string) => void;
};

export const AthleteSetHistoryItem = ({value, onBlur}: Props) => {
  const [edit, setEdit] = useState(false);
  const confirmEdit = () => {
    setEdit(true);
  };
  const {AlertModal, handleClickAlert} =
    useEditAthletePermissionAlert(confirmEdit);
  const [text, setText] = useState(
    valueIsGiven(value?.toString()) ? value : '',
  );
  useEffect(() => {
    setText(valueIsGiven(value?.toString()) ? value : '');
  }, [value]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [inputRef, edit]);
  const handleBlur = () => {
    setEdit(false);
    onBlur(String(text));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    let newValue = newText.replace(/(\r\n|\n|\r)/gm, '');
    const re = /^[.0-9]+$/;
    newValue = newValue.replace(',', '.');
    if (newText.length > 12) {
      setText(newText.substring(0, 12));
      return;
    }
    if (newValue[0] === '0' && newValue[1] !== undefined) {
      newValue = newValue.substring(1);
    }
    if (newValue[newValue.length - 1] === '%') {
      newValue = newValue.substring(newValue.length - 2);
    }
    if (newValue.slice(-1) === '.' && newValue.split('.').length > 2) {
      return;
    }
    if (parseFloat(newValue) <= 0) {
      newValue = '0';
    }
    if (newValue === '' || re.test(newValue)) {
      setText(newValue);
    }
  };
  return (
    <div>
      {edit ? (
        <div className="flex justify-center overflow-hidden">
          <Input
            className="input-style"
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            ref={inputRef}
          />
        </div>
      ) : (
        <div
          className="flex justify-center overflow-hidden text-white"
          onClick={handleClickAlert}
        >
          {text === '' ? '-' : text}
        </div>
      )}
      {AlertModal}
    </div>
  );
};
