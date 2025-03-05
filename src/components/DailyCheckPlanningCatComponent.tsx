import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {dark_gray, light_gray, primary_green} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {handleValues} from '../utils/helper';

type Props = {
  value: string;
  name: string;
  uploadValue?: (value: string) => void;
  noInput?: boolean;
  greenBorder?: boolean;
};

const DailyCheckPlanningCatComponent = (props: Props) => {
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const [edit, setEdit] = useState(false);

  const [textOnClick, setTextOnClick] = useState('');
  const handleOnBlur = (newValue: string) => {
    if (textOnClick !== newValue) {
      props.uploadValue && props.uploadValue(newValue);
    }
  };
  const borderStyle = props.greenBorder
    ? {borderRight: `3px solid ${primary_green}`}
    : {borderRight: '1px solid white'};
  return (
    <div style={{...styles.container, ...borderStyle}}>
      <div
        style={{
          ...sharedStyle.textStyle.primary_white_capital,
          ...styles.name,
        }}
      >
        {props.name}
      </div>
      {!props.noInput && (
        <textarea
          placeholder={t('PLANNING_HEALTH_PLACEHOLDER_GOAL')}
          style={
            edit
              ? {
                  ...sharedStyle.textStyle.regular,
                  ...styles.input,
                  ...styles.inputEdit,
                }
              : {...sharedStyle.textStyle.regular, ...styles.input}
          }
          value={handleValues(value, true)}
          onChange={(event) => setValue(event.target.value)}
          onFocus={(event) => {
            setTextOnClick(event.target.value);
            setEdit(true);
          }}
          onBlur={(event) => {
            handleOnBlur(event.target.value);
            setEdit(false);
          }}
        />
      )}
      {props.noInput && (
        <div
          style={{
            ...sharedStyle.textStyle.regular,
            ...styles.name,
            ...styles.noInput,
          }}
        >
          {'-'}
        </div>
      )}
    </div>
  );
};

type Styles = {
  container: CSSProperties;
  inputEdit: CSSProperties;
  input: CSSProperties;
  name: CSSProperties;
  noInput: CSSProperties;
};

const styles: Styles = {
  container: {
    width: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: dark_gray,
    border: 'none',
    borderRadius: 8,
    width: 80,
    outline: 'none',
    resize: 'none',
    lineHeight: 1,
    paddingTop: 8,
    height: 30,
    textAlign: 'center',
  },
  inputEdit: {
    backgroundColor: light_gray,
  },
  name: {
    textAlign: 'center',
  },
  noInput: {
    paddingTop: 4,
    height: 30,
  },
};

export default DailyCheckPlanningCatComponent;
