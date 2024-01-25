import { Stack } from '@mui/material';
import { TicketRoomElement } from 'app/components/RoomElement/TicketRoomElement';
import { useState } from 'react';
import { CinemaFilm } from 'types/cinema-film';
import { CinemaFilmPremiere } from 'types/cinema-film-premiere';
import { SeatData } from '..';
import { FilmInfo } from './FilmInfo';

export const SeatSelector = (props: {
  cinemaFilm: CinemaFilm;
  cinemaFilmPremiere: CinemaFilmPremiere;
  purchasedSeats: number[];
  setSelectedSeat: (seatData: SeatData) => void;
  selectedSeat: SeatData | null;
}) => {
  const {
    cinemaFilm,
    cinemaFilmPremiere,
    purchasedSeats,
    selectedSeat,
    setSelectedSeat,
  } = props;

  const [internalSelectedSeat, internalSetSelectedSeat] =
    useState<SeatData | null>(selectedSeat);

  return (
    <Stack direction={'row'} gap={6} justifyContent="center" mt={6}>
      <TicketRoomElement
        room={cinemaFilm.room!}
        cinemaFilmSeats={cinemaFilm.cinemaFilmSeats!}
        purchasedSeats={purchasedSeats}
        defaultSelectedSeat={selectedSeat?.seat ?? null}
        onSeatSelected={(seat, cinemaFilmSeat) => {
          internalSetSelectedSeat({ seat, cinemaFilmSeat });
          setSelectedSeat({ seat, cinemaFilmSeat });
        }}
      />
      <FilmInfo
        cinemaFilm={cinemaFilm}
        cinemaFilmPremiere={cinemaFilmPremiere}
        seat={internalSelectedSeat}
        showMap={true}
      />
    </Stack>
  );
};
