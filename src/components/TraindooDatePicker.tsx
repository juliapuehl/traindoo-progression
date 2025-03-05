import '@mui/lab';
import {FormControl, TextField} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {DesktopDatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {de} from 'date-fns/esm/locale';
import moment from 'moment';
import {CSSProperties, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getUserDateFormat} from '../logic/firestore';
import {primary_green, white} from '../styles/colors';

type Props = {
  style?: CSSProperties;
  handleChange: (value: string) => void;
  value?: string;
  headline: string;
  maxDate?: Date;
  minDate?: Date;
};

const useStyles = makeStyles({
  input: {
    color: white,
    height: '40px',
    '&.Mui-focused': {
      color: primary_green,
      borderColor: primary_green,
    },
    '&.Mui-focused fieldset': {
      borderColor: primary_green,
    },
  },
  inputLabel: {
    color: white,
    height: '40px',
    marginTop: 0,
    '&.Mui-focused': {
      color: primary_green,
      borderColor: primary_green,
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

const TraindooDatePicker = (props: Props) => {
  const classes = useStyles();
  const [uploadValue, setUploadValue] = useState(false);
  const [date, setDate] = useState<string>();
  const format = useSelector(getUserDateFormat);
  const handleChange = (event: any) => {
    if (event === null) {
      setDate('');
    } else {
      setDate(moment(event).startOf('day').toISOString());
    }
  };

  useEffect(() => {
    if (uploadValue && date !== undefined) {
      setUploadValue(false);
      if (moment(date).isValid() || date === '') {
        props.handleChange(date);
      }
    }
  }, [date, props, uploadValue]);

  return (
    <FormControl
      fullWidth
      style={{...styles.form, ...props.style}}
      margin="dense"
    >
      {/* TODO: fix locale for international market */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <DesktopDatePicker
          // disableCloseOnSelect={true}
          label={props.headline}
          inputFormat={format === 'us' ? 'MM/dd/yyyy' : 'dd.MM.yyyy'}
          mask="__.__.____"
          value={props.value}
          maxDate={props.maxDate}
          minDate={props.minDate}
          onChange={handleChange}
          onClose={() => setUploadValue(true)}
          InputProps={{
            classes: {root: classes.input},
          }}
          renderInput={(params) => (
            <TextField
              onBlur={() => setUploadValue(true)}
              error={false}
              InputLabelProps={{
                className: classes.inputLabel,
              }}
              sx={{
                svg: {color: white},
                input: {color: white},
                label: {color: white},
              }}
              {...params}
            />
          )}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

type Styles = {
  form: CSSProperties;
  label: CSSProperties;
  select: CSSProperties;
};

const styles: Styles = {
  form: {
    marginBottom: 32,
  },
  label: {
    color: white,
  },
  select: {
    color: white,
    alignItems: 'flex-end',
    height: 40,
  },
};
export default TraindooDatePicker;
