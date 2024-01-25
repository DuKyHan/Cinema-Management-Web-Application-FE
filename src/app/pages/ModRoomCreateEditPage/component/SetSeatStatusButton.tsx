import { Box, ButtonBase, Typography } from '@mui/material';
import { BoxElement } from 'app/components/RoomElement/SeatElement';

export const SetSeatStatusButton = (props: {
  color: string;
  borderColor?: string;
  name: string;
  onClick?: () => void;
}) => {
  const { color, name, borderColor, onClick } = props;

  if (onClick == null) {
    return (
      <Box sx={{ mx: 2, display: 'flex' }}>
        <BoxElement color={color} borderColor={borderColor} />
        <Typography sx={{ ml: 1 }}>{name}</Typography>
      </Box>
    );
  }

  return (
    <ButtonBase onClick={onClick} sx={{ mx: 2, display: 'flex' }}>
      <BoxElement color={color} borderColor={borderColor} />
      <Typography sx={{ ml: 1 }}>{name}</Typography>
    </ButtonBase>
  );
};
