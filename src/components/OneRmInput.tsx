import FunctionsIcon from '@mui/icons-material/Functions';
import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {light_gray, ultra_dark_gray} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import IconWithTooltip from './IconWithTooltip';
import {RPETableModal} from './RPETableModal';

type Props = {
  value?: number | string;
  label?: string;
  hideLabel?: boolean;
  uploadValue: (_: any) => void;
};

const OneRmInput = (props: Props) => {
  const [inputValue, setInputValue] = useState(
    props.value ? props.value.toString() : '0',
  );
  const [edit, setEdit] = useState(false);
  const [textOnClick, setTextOnClick] = useState('');
  const [openRPETable, setOpenRPETable] = useState(false);
  useEffect(() => {
    if (!props.value && inputValue) {
      setInputValue(props.value ? props.value.toString() : '0');
    } else {
      if (props.value.toString() !== inputValue) {
        setInputValue(props.value ? props.value.toString() : '0');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);
  const handleOnBlur = (value: string) => {
    if (textOnClick !== value) {
      props.uploadValue(value);
    }
  };
  const setInput = (text) => {
    const newText = text.replace(',', '.');
    if (
      newText.slice(-1) === '.' &&
      !isNaN(newText.slice(-2, -2)) &&
      !inputValue.includes('.')
    ) {
      setInputValue(newText);
      return;
    }
    if (newText === '') {
      setInputValue('0');
      return;
    }
    if (newText.length > 6) {
      return;
    }
    const float = parseFloat(newText);
    if (!isNaN(float)) {
      setInputValue(float.toString());
    }
  };

  return (
    <div style={styles.container}>
      {!props.hideLabel && <div style={styles.leftSide}>{props.label}</div>}
      <div style={styles.rightSide}>
        <IconWithTooltip
          muiIcon={FunctionsIcon}
          style={styles.icon}
          onClick={() => setOpenRPETable(true)}
          description={t('PLANNING_ONERM_RPE_ICON')}
        />
        <textarea
          wrap="off"
          style={
            edit ? {...styles.input, ...styles.inputEdit} : {...styles.input}
          }
          value={inputValue}
          onChange={(event) => setInput(event.target.value)}
          onFocus={(event) => {
            setTextOnClick(event.target.value);
            setEdit(true);
          }}
          onBlur={(event) => {
            handleOnBlur(event.target.value);
            setEdit(false);
          }}
        />
      </div>

      <RPETableModal
        handleClose={() => setOpenRPETable(false)}
        open={openRPETable}
        oneRMValue={parseFloat(inputValue)}
        exerciseName={props.label}
      />
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  input: CSSProperties;
  inputEdit: CSSProperties;
  leftSide: CSSProperties;
  rightSide: CSSProperties;
  icon: CSSProperties;
};

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  input: {
    ...sharedStyle.textStyle.secondary_white_capital,
    height: 22,
    width: 50,
    backgroundColor: light_gray,
    outline: 'none',
    resize: 'none',
    overflow: 'hidden',
  },
  inputEdit: {
    backgroundColor: light_gray,
    borderWidth: 2,
    borderColor: ultra_dark_gray,
  },
  leftSide: {flexDirection: 'row', alignItems: 'center', flex: 1},
  rightSide: {
    marginLeft: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {padding: 0},
};

export default OneRmInput;
