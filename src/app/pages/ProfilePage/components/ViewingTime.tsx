import { Box, Typography } from '@mui/material';
import { ViewedGenreTimes } from 'types/profile';
import { EGenre } from 'utils/genres';
import { TitleLine } from './TitleLine';
import { ViewingTimeLine } from './ViewingTimeLine';

export const ViewingTime = (props: {
  viewedGenreTimes: ViewedGenreTimes[];
}) => {
  const viewedGenreTimes = [...props.viewedGenreTimes].sort((a, b) => {
    return b.duration - a.duration;
  });

  return (
    <Box sx={{ my: 6 }}>
      <TitleLine title="Viewing time" />
      {viewedGenreTimes.length === 0 ? (
        <Typography textAlign={'center'}>No viewing time</Typography>
      ) : null}
      {viewedGenreTimes.map((view, index) => {
        return (
          <ViewingTimeLine
            key={index}
            genre={view.genre.name as EGenre}
            minutes={view.duration}
          />
        );
      })}
    </Box>
  );
};
