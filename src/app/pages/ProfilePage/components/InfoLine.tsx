import { Box, Typography } from '@mui/material';

export const InfoLine = (props: { title: string; value?: string | null }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        my: 1,
      }}
    >
      <Typography sx={{ mr: 12 }}>{props.title}</Typography>
      <Typography>{props.value ?? 'Unknown'}</Typography>
    </Box>
  );
};
