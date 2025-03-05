import {createTheme} from '@mui/material/styles';
import {primary_green, white} from '../styles/colors';

declare module '@mui/material/styles' {
  interface Theme {
    traindoo: {
      highlight: string;
      standard: string;
      error: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    traindoo?: {
      highlight?: string;
      standard?: string;
      error?: string;
    };
  }
}

export const sharedTheme = createTheme({
  traindoo: {
    highlight: primary_green,
    standard: white,
    error: '#FF0000',
  },
  palette: {
    primary: {main: primary_green},
    secondary: {main: white},
    error: {main: '#FF0000'},
  },
});
