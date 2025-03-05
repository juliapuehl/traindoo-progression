import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {dark_gray, light_gray, primary_green} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

type Props = {
  value: string;
  name: string;
  uploadValue: (value: string) => void;
  noInput?: boolean;
  greenBorder?: boolean;
};

const DailyCheckPlanningCatComponentNew = (props: Props) => {
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    if (value !== props.value) {
      setValue(props.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  const [edit, setEdit] = useState(false);
  const [textOnClick, setTextOnClick] = useState('');
  const handleOnBlur = (newValue: string) => {
    if (textOnClick !== newValue) {
      props.uploadValue(newValue);
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
          value={value}
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
    // Needed for firefox dont use display: 'flex' -> else height 100% not working
    display: 'inline-table',
    minWidth: 80,
    paddingRight: 8,
    paddingLeft: 8,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
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

export default DailyCheckPlanningCatComponentNew;
