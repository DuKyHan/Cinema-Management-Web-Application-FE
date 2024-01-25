import { Box, Chip, Typography } from '@mui/material';
import { EGenre, genresIcons } from 'utils/genres';

export const ViewingTimeLine = (props: { genre: EGenre; minutes: number }) => {
  const { genre, minutes } = props;
  const icon = genresIcons[props.genre];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        my: 1,
      }}
    >
      <Chip label={icon + ' ' + genre} variant="outlined" sx={{ mr: 3 }}></Chip>
      <Typography>{(minutes / 60).toFixed(1)} hours</Typography>
    </Box>
  );
};
