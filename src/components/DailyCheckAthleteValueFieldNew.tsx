import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {dark_gray, light_gray, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

type Props = {
  athleteValue: string;
  trainerValue: string;
  defineDailyMarkos?: boolean;
  uploadValue: (value: string) => void;
};

const DailyCheckAthleteValueFieldNew = (props: Props) => {
  const [trainerValue, setValue] = useState(props.trainerValue);
  useEffect(() => {
    setValue(props.trainerValue);
  }, [props.trainerValue]);

  const [textOnClick, setTextOnClick] = useState('');
  const handleOnBlur = (value: string) => {
    if (textOnClick !== value) {
      props.uploadValue(value);
    }
  };
  return (
    <div style={styles.valueContainer}>
      <div style={styles.valueElement}>{props.athleteValue}</div>
      {props.defineDailyMarkos && (
        <textarea
          placeholder={t('PLANNING_HEALTH_PLACEHOLDER_GOAL')}
          style={{
            ...sharedStyle.textStyle.regular,
            ...styles.input,
            ...styles.inputEdit,
          }}
          value={trainerValue}
          onChange={(event) => setValue(event.target.value)}
          onFocus={(event) => {
            setTextOnClick(event.target.value);
          }}
          onBlur={(event) => {
            handleOnBlur(event.target.value);
          }}
        />
      )}
    </div>
  );
};

type Styles = {
  valueContainer: CSSProperties;
  inputEdit: CSSProperties;
  input: CSSProperties;
  valueElement: CSSProperties;
};

const styles: Styles = {
  valueElement: {
    color: white,
    textAlign: 'center',
  },
  valueContainer: {
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
    height: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  inputEdit: {
    backgroundColor: light_gray,
  },
};

export default DailyCheckAthleteValueFieldNew;
