import { CinemaBrand } from './cinema-brand';
import { Location } from './location';
import { PaginationQueryDto } from './query';

export enum CinemaStatus {
  Pending = 'pending',
  Cancelled = 'cancelled',
  Verified = 'verified',
  Rejected = 'rejected',
}

export const cinemaStatuses = Object.values(CinemaStatus);

export class Cinema {
  id: number;

  name: string;

  description: string;

  status: CinemaStatus;

  verifierComment?: string;

  isDisabled: boolean;

  disabledComment?: string;

  location: Location;

  cinemaBrand?: CinemaBrand;
}

export class ChangeCinemaStatusDto {
  comment?: string;
}

export class CinemaQueryDto extends PaginationQueryDto {
  search?: string;

  status?: CinemaStatus;

  ownerId?: number;
}

export class CreateCinemaDto {
  name: string;

  description: string;

  location?: Location;
}

export class UpdateCinemaDto {
  name?: string;

  description?: string;

  location?: Location;
}
