import {Typography} from '@mui/material';
import {CSSProperties} from 'react';
import {ColorResult, HuePicker} from 'react-color';
import {white} from '../../styles/colors';

type Props = {
  title: string;
  color: string;
  setColor: (newValue: string) => void;
};

export const TraindooColorPicker = (props: Props) => {
  return (
    <div style={styles.colorPickerContainer}>
      <div style={styles.textContainer}>
        <Typography textAlign="center" color={white}>
          {props.title}
        </Typography>
        <div style={{...{backgroundColor: props.color}, ...styles.circle}} />
      </div>
      <div style={styles.colorPicker}>
        <HuePicker
          color={props.color}
          onChange={(newColor: ColorResult) => props.setColor(newColor.hex)}
        />
      </div>
    </div>
  );
};

type Styles = {
  colorPickerContainer: CSSProperties;
  textContainer: CSSProperties;
  circle: CSSProperties;
  colorPicker: CSSProperties;
};

const styles: Styles = {
  colorPickerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    marginLeft: 10,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  colorPicker: {
    padding: 15,
  },
};
