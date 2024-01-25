import { Cinema } from './cinema';

export class Film {
  id: number;
  name: string;
  description: string;
  AgeRestricted?: string;
  duration: number;
  TrailerLink: string;
  cinemaId: number;
  thumbnailId: number;
  genreNames?: string[];
  actors?: string[];
}

export class FilmPremiere extends Film {
  firstPremiere: Date;
  premieres: Date[];
}

export class ExtendedFilmPremiere extends Film {
  firstPremiere: Date;
  premieres: {
    id: number;
    premiere: Date;
    cinemaId: number;
    cinemaFilmId: number;
  }[];
  cinemas: Cinema[];
}
