import Slider from '@mui/material/Slider';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import {CSSProperties, useEffect, useState} from 'react';
import {light_gray, red, white} from '../styles/colors';

type Props = {
  title: string;
  values: string[];
};

const theme = createTheme({
  palette: {
    primary: {main: white},
  },
});

const useStyles = makeStyles({
  root: {
    '&.MuiSlider-track': {
      color: red,
    },
  },
  mark: {
    '&.MuiSlider-mark': {
      color: light_gray,
      width: 16,
      height: 16,
      borderRadius: 16,
      marginLeft: -8,
    },
  },
});

export const SliderPreview = (props: Props) => {
  const classes = useStyles();
  const initialValue = Math.floor(props.values.length / 2);

  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (event: Event, newValue: number) => {
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={theme}>
      <>
        <div style={styles.subtitle}>{props.title}</div>
        <div style={styles.slider}>
          <Slider
            classes={{root: classes.root, mark: classes.mark}}
            value={value}
            onChange={handleChange}
            step={1}
            marks
            min={0}
            max={props.values.length - 1}
            track={false}
          />
        </div>
        <div style={styles.valueContainer}>
          <div style={{...styles.subtitle}}>{props.values[0]}</div>

          <div style={{...styles.subtitle}}>
            {props.values[props.values.length - 1]}
          </div>
        </div>
      </>
    </ThemeProvider>
  );
};

type Styles = {
  container: CSSProperties;
  outerContainer: CSSProperties;
  title: CSSProperties;
  valueContainer: CSSProperties;
  slider: CSSProperties;
  subtitle: CSSProperties;
};

const styles: Styles = {
  container: {
    background: 'linear-gradient(#2D3636, #323839)',
    width: 400,
    borderRadius: 8,
    marginTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  outerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
  },
  subtitle: {
    marginBottom: 15,
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.87)',
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slider: {
    marginLeft: 10,
    marginRight: 10,
  },
};
