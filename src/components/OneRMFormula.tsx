import {Tooltip, Typography} from '@mui/material';
import {t} from 'i18n-js';
import {CSSProperties, useEffect, useState} from 'react';
import {dark_gray, white} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';

type Props = {
  changeOneRM: (oneRM: number) => void;
  bw?: number;
  load?: number;
  oneRM?: number;
  isCalisthenics: boolean;
  setBw?: (bw: number) => void;
};

export const OneRMFormula = (props: Props) => {
  const bw = props.bw;
  const [load, setLoad] = useState(props.load ? props.load.toString() : '0');
  const [reps, setReps] = useState(1);
  const [rpe, setRpe] = useState(10);
  const [percentBW, setPercentBW] = useState(50);
  const [valueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    // Type strange
    const repsFloat = parseFloat(reps.toString());
    const rpeFloat = parseFloat(rpe.toString());
    if (!valueChanged && props.isCalisthenics) {
      const c = 0.033 * (repsFloat + 10 - rpeFloat);
      const b = bw * (percentBW / 100);
      const r = props.oneRM ? props.oneRM : 0;
      const result = Math.floor(((c * b - r) / (-c - 1)) * 10) / 10;
      setLoad(result.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueChanged, props.oneRM]);

  const decPercentBW = percentBW / 100;

  const handleChangeValue = (id: string, value: string) => {
    const handleInt = (
      valueInt: string,
      setValue: (_: any) => void,
      max?: number,
    ) => {
      if (!valueInt || valueInt === '') {
        setValue(0);
        return;
      }
      const re = /^[0-9]+$/;
      if (re.test(valueInt)) {
        const returnValue = parseInt(valueInt, 10);
        if (max && returnValue > max) {
          setValue(max);
          return;
        } else {
          if (valueInt.length > 1 && valueInt[0] === '0') {
            setValue(valueInt.slice(1));
            return;
          }
          setValue(valueInt);
          return;
        }
      }
      setValue(0);
    };
    const handleFloat = (
      valueFloat: string,
      setValue: (_: any) => void,
      max?: number,
    ) => {
      let newValue = valueFloat.toString();
      if (!valueFloat || valueFloat === '') {
        setValue(0);
        return;
      }
      const re = /^[.,0-9]+$/;
      newValue = newValue.replace(',', '.');

      if (newValue.slice(0) === '.') {
        newValue = '0' + newValue;
      }
      if (newValue.split('.').length - 1 > 1) {
        return;
      }
      if (
        newValue[0] === '0' &&
        newValue[1] !== '.' &&
        newValue[1] !== undefined
      ) {
        newValue = newValue.substring(1);
      }

      if (re.test(newValue)) {
        if (parseFloat(newValue) > max) {
          setValue(max);
          return;
        }
        setValue(newValue);
      }
      return;
    };

    switch (id) {
      case 'percentBW':
        handleFloat(value, setPercentBW, 100);
        break;
      case 'reps':
        handleInt(value, setReps);
        break;
      case 'RPE':
        handleInt(value, setRpe, 10);
        break;
      case 'BW':
        handleFloat(value, props.setBw);
        break;
      case 'load':
        handleFloat(value, setLoad);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (valueChanged) {
      const loadFloat = parseFloat(load);
      const bwFloat = parseFloat(bw.toString());
      // Type strange
      const repsFloat = parseFloat(reps.toString());
      const rpeFloat = parseFloat(rpe.toString());
      let oneRM = 0;
      if (props.isCalisthenics) {
        oneRM =
          0.033 *
            (repsFloat + 10 - rpeFloat) *
            (loadFloat + decPercentBW * bwFloat) +
          (loadFloat + decPercentBW * bwFloat) -
          decPercentBW * bwFloat;
      } else {
        oneRM = 0.033 * (repsFloat + 10 - rpeFloat) * loadFloat + loadFloat;
      }
      props.changeOneRM(Math.round(oneRM * 10) / 10);
    }
  }, [
    bw,
    decPercentBW,
    load,
    percentBW,
    props,
    props.changeOneRM,
    reps,
    rpe,
    valueChanged,
  ]);
  const inputWithHeadline = (
    text: string,
    value: number | string,
    setValue: (_: any) => void,
    tooltip?: string,
  ) => {
    return (
      <div style={styles.element}>
        <div style={styles.headlineElement}>{text}</div>
        <div style={styles.setItemStyle}>
          {!tooltip && (
            <input
              placeholder={text}
              style={{
                ...styles.styleInput,
              }}
              value={value}
              onChange={(event) => {
                setValueChanged(true);
                setValue(event.target.value);
              }}
            />
          )}
          {tooltip && (
            <Tooltip title={tooltip}>
              <input
                placeholder={text}
                style={{
                  ...styles.styleInput,
                }}
                value={value}
                onChange={(event) => {
                  setValueChanged(true);
                  setValue(event.target.value);
                }}
              />
            </Tooltip>
          )}
        </div>
      </div>
    );
  };
  const powerliftingFormula = '(REPS + 10 - RPE) * 0.033 * LOAD + LOAD  = 1RM';
  const calisthenicsFormula =
    '(REPS + 10 - RPE) * 0.033 * (LOAD + %BW * BW) + (LOAD + %BW * BW) - %BW * BW = 1RM';
  const powerliftingFormulaValue =
    '(' +
    reps +
    ' + 10 - ' +
    rpe +
    ') * 0.033 * ' +
    load +
    ' + ' +
    load +
    ' = ' +
    props.oneRM;
  const calisthenicsFormulaValue =
    '(' +
    reps +
    ' + 10 - ' +
    rpe +
    ') * ' +
    '(' +
    load +
    ' + ' +
    decPercentBW +
    ' * ' +
    bw +
    ') * 0.033' +
    ' + ' +
    '(' +
    load +
    ' + ' +
    decPercentBW +
    ' * ' +
    bw +
    ')' +
    ' - ' +
    decPercentBW +
    ' * ' +
    bw +
    ' = ' +
    props.oneRM;
  return (
    <div>
      <Typography
        id="modal-modal-title"
        variant="subtitle2"
        component="h2"
        textAlign="center"
        color={white}
      >
        {t('PLANNING_RPE_TABLE_FORMULA_HEADLINE')}
      </Typography>
      <div style={styles.container}>
        {inputWithHeadline(
          t('PLANNING_SET_INPUT_PLACEHOLDER_LOAD'),
          load,
          (value: string) => handleChangeValue('load', value),
        )}
        {inputWithHeadline(
          t('PLANNING_SET_INPUT_PLACEHOLDER_REPS'),
          reps,
          (value: string) => handleChangeValue('reps', value),
        )}
        {inputWithHeadline(
          t('PLANNING_SET_INPUT_PLACEHOLDER_RPE'),
          rpe,
          (value: string) => handleChangeValue('RPE', value),
        )}
        {props.isCalisthenics &&
          inputWithHeadline(
            t('PLANNING_RPE_TABLE_BW'),
            bw,
            (value: string) => handleChangeValue('BW', value),
            t('PLANNING_RPE_TABLE_BW_DESCRIPTION'),
          )}
        {props.isCalisthenics &&
          inputWithHeadline(
            t('PLANNING_RPE_TABLE_PERCENT_BW'),
            percentBW,
            (value: string) => handleChangeValue('percentBW', value),
            t('PLANNING_RPE_TABLE_PERCENT_BW_DESCRIPTION'),
          )}
      </div>
      <div style={styles.formula}>
        {props.isCalisthenics ? calisthenicsFormula : powerliftingFormula}˚
      </div>
      <div style={styles.formulaValues}>
        {props.isCalisthenics
          ? calisthenicsFormulaValue
          : powerliftingFormulaValue}
      </div>
    </div>
  );
};

type Styles = {
  setItemStyle: CSSProperties;
  styleInput: CSSProperties;
  headlineElement: CSSProperties;
  element: CSSProperties;
  container: CSSProperties;
  formula: CSSProperties;
  formulaValues: CSSProperties;
};

const styles: Styles = {
  formula: {
    marginTop: 8,
    ...sharedStyle.textStyle.regular_small,
    textAlign: 'center',
  },
  formulaValues: {
    marginTop: 8,
    ...sharedStyle.textStyle.regular_small,
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },

  element: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  headlineElement: {
    ...sharedStyle.textStyle.regular_small,
    width: 60,
    display: 'flex',
    justifyContent: 'center',
  },
  setItemStyle: {
    ...sharedStyle.textStyle.regular_small,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 64,
    width: 80,
    height: 24,
    paddingRight: 4,
    paddingLeft: 4,
  },
  styleInput: {
    width: 72,
    backgroundColor: dark_gray,
    textAlign: 'center',
    wordWrap: 'break-word',
  },
};
