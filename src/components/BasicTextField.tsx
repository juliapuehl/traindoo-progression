import {Visibility, VisibilityOff} from '@mui/icons-material';
import {IconButton, InputAdornment, styled, Tooltip} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import React, {CSSProperties, useState} from 'react';
import {primary_green, sidebar_color_dark, white} from '../styles/colors';

const theme = createTheme({
  palette: {
    primary: {main: primary_green},
  },
});

const useStyles = makeStyles({
  input: {
    color: white,
    height: '40px',
  },
  inputLabel: {
    color: white,
    height: '40px',
    marginTop: 0,
    '&.Mui-focused': {
      color: primary_green,
    },
    '&.Mui-focused fieldset': {
      borderColor: primary_green,
    },
    '&.MuiFormHelperText-root': {
      marginTop: 0,
      height: 0,
    },
    '&.Mui-disabled': {
      color: white,
    },
    '&.shrink': {
      marginTop: '-13px',
    },
  },
});

// Ansonsten kann man leider den disabled Text nicht stylen
const CustomTextField = styled(TextField)({
  input: {
    '&.Mui-disabled': {
      WebkitTextFillColor: 'rgba(255,255,255, 0.6)',
    },
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px ' + sidebar_color_dark + ' inset',
      WebkitTextFillColor: white,
    },
  },
});

type Props = {
  label: string;
  value?: string;
  onChange?: (_: string) => void;
  autoComplete?: string;
  onBlur?: () => void;
  password?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  error?: boolean;
  errorText?: string;
  autoFocus?: boolean;
  tooltip?: string;
  intercomTarget?: string;
};

const BasicTextField = (props: Props) => {
  const classes = useStyles();
  const [showText, setShowText] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Tooltip title={props.tooltip ?? ''} placement="bottom-start" arrow>
        <CustomTextField
          autoFocus={props.autoFocus}
          disabled={props.disabled}
          value={props.value}
          type={props.password && !showText ? 'password' : 'text'}
          fullWidth
          autoComplete={props.autoComplete}
          label={props.label}
          variant="filled"
          helperText={props.errorText}
          error={props.error}
          data-intercom-target={props.intercomTarget}
          InputProps={{
            // Used for intercom targeting
            className: props.intercomTarget,
            classes: {root: classes.input},
            endAdornment: props.password && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowText(!showText)}
                  style={styles.eyeIcon}
                >
                  {showText ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            className: classes.inputLabel,
            classes: {
              shrink: 'shrink',
            },
          }}
          size={'small'}
          style={{...styles.main, ...props.style}}
          onChange={(event: React.ChangeEvent<{value: string}>) => {
            props.onChange(event.target.value as string);
          }}
          onBlur={() => {
            if (props.onBlur) {
              props.onBlur();
            }
          }}
        />
      </Tooltip>
    </ThemeProvider>
  );
};

type Styles = {
  main: CSSProperties;
  eyeIcon: CSSProperties;
};

const styles: Styles = {
  main: {marginBottom: 32},
  eyeIcon: {
    color: white,
  },
};

export default BasicTextField;
