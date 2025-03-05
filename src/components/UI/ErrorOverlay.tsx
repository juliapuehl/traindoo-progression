import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import {
  Box,
  createTheme,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import {t} from 'i18n-js';
import {useState} from 'react';
import {medium_gray, primary_green, white} from '../../styles/colors';
import {sharedStyle} from '../../styles/sharedStyles';
import ButtonCustom from '../Button';

const theme = createTheme({
  palette: {
    primary: {main: primary_green},
  },
});

export const ErrorOverlay = ({
  userId = '',
  eventId,
  resetError,
}: {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError(): void;
  userId?: string;
}) => {
  const handleSubmit = async () => {
    if (errorDesc && eventId) {
      const dsn =
        'https://5c5ade9c37304545a175f3dfe54af7df@o1299768.ingest.sentry.io/4504275276201984';
      const result = await fetch(
        'https://sentry.io/api/0/projects/traindoo/react/user-feedback/',
        {
          method: 'POST',
          headers: {
            Authorization: `DSN ${dsn}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comments: errorDesc,
            event_id: eventId,
            email: 'anonymous@anon.com',
            name: 'Anonymous ' + userId,
          }),
        },
      );

      const data = await result.json();
      console.log('Sent user Feedback to Sentry', data);
    }
    resetError();
  };

  const [errorDesc, setErrorDesc] = useState<string>();

  return (
    <Box sx={{maxWidth: '800px', margin: 'auto', padding: {xs: 2, sm: 5}}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <SentimentVeryDissatisfiedIcon sx={{fontSize: '5em', color: white}} />
        <Typography style={sharedStyle.textStyle.title1}>
          {t('ERROR_TITLE')}
        </Typography>
      </Box>
      <Typography style={sharedStyle.textStyle.regular}>
        {t('ERROR_SUBTITLE')}
      </Typography>
      <Box
        sx={{
          borderRadius: 3,
          backgroundColor: medium_gray,
          padding: 2,
          marginTop: 2,
          marginBottom: 1,
        }}
      >
        <Typography style={sharedStyle.textStyle.title2}>
          {t('ERROR_CARD_TITLE')}
        </Typography>
        <Typography
          style={sharedStyle.textStyle.regular}
          sx={{marginBottom: 2}}
        >
          {t('ERROR_CARD_SUBTITLE')}
        </Typography>
        <ThemeProvider theme={theme}>
          <TextField
            sx={{
              textarea: {color: 'white'},
            }}
            hiddenLabel
            fullWidth
            multiline
            rows={4}
            onChange={(e) => setErrorDesc(e.target.value)}
            variant="filled"
          />
        </ThemeProvider>
      </Box>
      <ButtonCustom text={t('ERROR_CTA')} onClick={handleSubmit} />
    </Box>
  );
};
