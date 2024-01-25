import { Box, Chip, Typography } from '@mui/material';
import { genresIcons } from 'utils/genres';
import { TitleLine } from './TitleLine';

export const Interests = (props: { genres: string[] }) => {
  const { genres } = props;

  return (
    <>
      <TitleLine title="Interests" />

      <Box
        sx={{
          display: 'flex',
          gap: 2,
        }}
      >
        {genres.length > 0 ? (
          genres.map((genre, index) => {
            const icon = genresIcons[genre];
            return (
              <Chip
                key={index}
                label={icon + ' ' + genre}
                variant="outlined"
              ></Chip>
            );
          })
        ) : (
          <Typography>No interested genre</Typography>
        )}
      </Box>
    </>
  );
};
