import { CreateSeatWithRoomInputDto, SeatStatus } from 'types/seat';
import { BoxElement, EmptyBoxElement } from './SeatElement';

export const SelectableSeatElement = (props: {
  seat?: CreateSeatWithRoomInputDto;
  selected?: boolean;
  selectedColor?: string;
  availableColor?: string;
  purchased?: boolean;
}) => {
  const { seat, selected, selectedColor, availableColor, purchased } = props;

  if (seat == null || seat.status === SeatStatus.Empty) {
    return <EmptyBoxElement color={selected ? 'green' : undefined} />;
  }

  let backgroundColor: string | undefined = undefined;

  if (purchased) {
    backgroundColor = 'red';
  } else if (selected) {
    backgroundColor = selectedColor ?? 'green';
  } else {
    if (seat.status === SeatStatus.Available) {
      backgroundColor = availableColor ?? undefined;
    } else {
      backgroundColor = 'gray';
    }
  }

  return <BoxElement color={backgroundColor} />;
};
