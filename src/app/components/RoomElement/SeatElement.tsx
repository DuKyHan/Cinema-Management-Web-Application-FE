import { Box } from '@mui/material';
import { Seat, SeatStatus } from 'types/seat';
import { BOX_SIZE_PX } from './RoomElement';

export const BoxElement = (props: {
  color?: string;
  borderColor?: string;
  name?: string;
}) => {
  const { color, borderColor, name } = props;

  return (
    <Box
      sx={{
        width: BOX_SIZE_PX,
        height: BOX_SIZE_PX,
        backgroundColor: color,
        border: `1px solid ${borderColor ?? 'black'}`,
        borderRadius: '4px',
        textAlign: 'center',
      }}
    >
      {name}
    </Box>
  );
};

export const EmptyBoxElement = (props: { color?: string }) => {
  const { color } = props;

  return (
    <Box
      sx={{
        width: BOX_SIZE_PX,
        height: BOX_SIZE_PX,
        backgroundColor: color,
      }}
    />
  );
};

export const SeatElement = (props: { seat?: Seat }) => {
  const { seat } = props;

  if (seat == null || seat.status === SeatStatus.Empty) {
    return <EmptyBoxElement />;
  }

  const backgroundColor: string | undefined =
    seat.status === SeatStatus.Available ? undefined : 'gray';

  return <BoxElement color={backgroundColor} />;
};
