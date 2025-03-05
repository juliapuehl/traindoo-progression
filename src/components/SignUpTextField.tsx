import {CheckBox} from '@mui/icons-material';
import {FormControlLabel, styled, TextField} from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';
import {light_gray, primary_green, red, white} from '../styles/colors';

export const SignUpTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: primary_green,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: primary_green,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: light_gray,
    },
    '&:hover fieldset': {
      borderColor: light_gray,
    },
    '&.Mui-focused fieldset': {
      borderColor: primary_green,
    },
    '& input': {
      color: white,
    },
    '& input label': {
      color: light_gray,
    },
  },
  '& .MuiInputLabel-root': {
    color: white,
  },
  '& .MuiFormHelperText-root': {
    color: white,
    minWidth: 300,
  },
  '& .MuiSelect-select': {
    color: white,
  },
  '& .MuiSvgIcon-root': {
    color: light_gray,
  },
  '&:invalid:': {
    borderColor: red,
  },
});

export const SignUpPhoneNumber = styled(MuiPhoneNumber)({
  '& label.Mui-focused': {
    color: primary_green,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: primary_green,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: light_gray,
    },
    '&:hover fieldset': {
      borderColor: light_gray,
    },
    '&.Mui-focused fieldset': {
      borderColor: primary_green,
    },
    '& input': {
      color: white,
    },
    '& input label': {
      color: light_gray,
    },
  },
  '& .MuiInputLabel-root': {
    color: white,
  },
  '& .MuiPhoneNumber-flagButton': {
    maxWidth: 10,
  },
});

export const SignUpCheckbox = styled(CheckBox)({
  '& .MuiSvgIcon-root': {
    color: white,
  },
});

export const SignUpFormControlLabel = styled(FormControlLabel)({
  '& .MuiFormControlLabel-label': {
    color: white,
  },
});
