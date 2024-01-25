import { Box, CircularProgress } from '@mui/material';

export const Loading = props => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '300px',
      }}
    >
      <CircularProgress />
    </Box>
  );
};
