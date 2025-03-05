import {Box, CircularProgress} from '@mui/material';

export const FullScreenLoading = () => {
  return (
    <Box sx={loadingStyle}>
      <CircularProgress color="primary" />
    </Box>
  );
};

const loadingStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};
