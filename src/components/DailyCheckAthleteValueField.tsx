import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';

import {dark_gray, light_gray, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {CategoryTypes} from '../traindoo_shared/types/Training';
import {useCalculateLengthFrontend} from '../traindoo_shared/units/useCalculateLengthFrontend';
import {useCalculateLoadFrontend} from '../traindoo_shared/units/useCalculateLoadFrontend';
import {handleValues} from '../utils/helper';

type Props = {
  index: number;
  questionKey: string;
  checkKey: string;
  athleteValue: string;
  trainerValue: string;
  defineDailyMarkos?: boolean;
  uploadValue: (value: string) => void;
};

const DailyCheckAthleteValueField = (props: Props) => {
  const calculateWeightFrontend = useCalculateLoadFrontend();
  const calculateLengthFrontend = useCalculateLengthFrontend();
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
  let athleteValue;
  if (props.questionKey === 'weight') {
    athleteValue = calculateWeightFrontend(props.athleteValue);
  } else if (props.questionKey === 'waistSize') {
    athleteValue = calculateLengthFrontend(props.athleteValue);
  } else {
    if (!isNaN(parseFloat(props.athleteValue))) {
      athleteValue = String(
        Math.floor(parseFloat(props.athleteValue) * 100) / 100,
      );
    } else {
      athleteValue = props.athleteValue;
    }
  }

  return (
    <div style={styles.valueContainer}>
      <div
        style={styles.valueElement}
        key={'value' + props.index + props.questionKey}
      >
        {handleValues(athleteValue)}
      </div>
      {props.defineDailyMarkos && props.checkKey === CategoryTypes.nutrition && (
        <textarea
          placeholder={t('PLANNING_HEALTH_PLACEHOLDER_GOAL')}
          style={{
            ...sharedStyle.textStyle.regular,
            ...styles.input,
            ...styles.inputEdit,
          }}
          value={handleValues(trainerValue, true)}
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
    width: 120,
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

export default DailyCheckAthleteValueField;
