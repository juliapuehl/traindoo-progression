import {Tooltip} from '@mui/material';
import {CSSProperties, useEffect, useState} from 'react';
import {light_gray, ultra_dark_gray} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

type Props = {
  text: string;
  edit?: boolean;
  uploadValue: (_: string) => void;
  style?: CSSProperties;
  placeholder?: string;
  description?: string;
};

const TrainingNote = (props: Props) => {
  const [inputValue, setInputValue] = useState(props.text);
  useEffect(() => {
    setInputValue(props.text);
  }, [props.text]);
  const [edit, setEdit] = useState(false);
  const [textOnClick, setTextOnClick] = useState('');
  const handleOnBlur = (value: string) => {
    if (textOnClick !== value) {
      props.uploadValue(value);
    }
  };
  return (
    <Tooltip
      title={props.description ? props.description : ''}
      placement="bottom"
    >
      <textarea
        placeholder={props.placeholder}
        style={
          edit
            ? {...styles.input, ...styles.inputEdit, ...props.style}
            : {...styles.input, ...props.style}
        }
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onFocus={(event) => {
          setTextOnClick(event.target.value);
          setEdit(true);
        }}
        onBlur={(event) => {
          handleOnBlur(event.target.value);
          setEdit(false);
        }}
      />
    </Tooltip>
  );
};

type Styles = {
  input: CSSProperties;
  inputEdit: CSSProperties;
};

const styles: Styles = {
  input: {
    ...sharedStyle.textStyle.secondary_white_capital,
    flexGrow: 1,
    padding: 8,
    backgroundColor: light_gray,
    borderRadius: 8,
    outline: 'none',
    resize: 'none',
  },
  inputEdit: {
    backgroundColor: light_gray,
    borderWidth: 2,
    borderColor: ultra_dark_gray,
  },
};

export default TrainingNote;
