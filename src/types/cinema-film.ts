import { Cinema } from './cinema';
import { CinemaFilmPremiere } from './cinema-film-premiere';
import {
  CinemaFilmSeat,
  CreateCinemaFilmSeatWithCinemaFilmDto
} from './cinema-film-seat';
import { Film } from './film';
import { PaginationQueryDto } from './query';
import { Room } from './room';

export class CinemaFilm {
  id: number;

  cinemaId: number;

  filmId: number;

  roomId: number;

  premieres: CinemaFilmPremiere[];

  film?: Film;

  cinema?: Cinema;

  room?: Room;

  cinemaFilmSeats?: CinemaFilmSeat[];

  purchasedSeats?: number[];
}

export class ExtendedCinemaFilm extends CinemaFilm {
  cinemaName?: string;

  filmName?: string;

  roomName?: string;
}

export enum CinemaFilmInclude {
  Film = 'film',
  Cinema = 'cinema',
  Room = 'room',
  RoomSeats = 'room-seats',
  CinemaFilmSeats = 'cinema-film-seats',
  PurchasedSeats = 'purchased-seats',
}

export const cinemaFilmIncludes = Object.values(CinemaFilmInclude);

export class GetCinemaFilmsQueryDto extends PaginationQueryDto {
  includes?: CinemaFilmInclude[];

  search?: string;
}

export class CreateCinemaFilmDto {
  filmId: number;

  roomId: number;

  premieres: Date[];

  seats?: CreateCinemaFilmSeatWithCinemaFilmDto[];
}

export class UpdateCinemaFilmDto {
  premieres?: Date[];

  seats?: CreateCinemaFilmSeatWithCinemaFilmDto[];
}
