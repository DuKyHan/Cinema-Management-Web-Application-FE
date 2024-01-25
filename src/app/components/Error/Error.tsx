import { Box, Typography } from '@mui/material';

export const ErrorComponent = (props: { message?: string }) => {
  const { message } = props;
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
      <Typography variant="h5">
        {message ? message : 'Something went wrong'}
      </Typography>
    </Box>
  );
};
