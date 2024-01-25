import { Typography } from '@mui/material';

export const TitleLine = (props: { title: string }) => {
  const { title } = props;
  return (
    <Typography
      textAlign={'center'}
      sx={{ borderBottom: 2, borderColor: 'dodgerblue', px: 6, my: 2 }}
    >
      {title}
    </Typography>
  );
};
