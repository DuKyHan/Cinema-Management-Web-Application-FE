import { Profile } from './profile';

export enum NewsType {
  General = 'general',
  Film = 'film',
  Cinema = 'cinema',
}

export const newsTypes = Object.values(NewsType);

export enum NewsContentFormat {
  Plaintext = 'plaintext',
  Delta = 'delta',
}

export const newsContentFormats = Object.values(NewsContentFormat);

export enum NewsStatus {
  Pending = 'pending',
  Published = 'published',
  Rejected = 'rejected',
}

export const newsStatuses = Object.values(NewsStatus);

export class News {
  id: number;

  type: NewsType;

  authorId: number;

  author?: Profile;

  thumbnail: number;

  title: string;

  content: string;

  contentFormat: NewsContentFormat;

  views: number;

  popularity: number;

  // isPublished: boolean;
  status: NewsStatus;

  publishedAt: Date;

  updatedAt: Date;
}

export class CreateNewsInputDto {
  type: NewsType;

  title: string;

  content: string;

  contentFormat: NewsContentFormat;

  thumbnail?: number;

  isPublished?: boolean;

  filmId?: number;

  cinemaId?: number;
}

export class UpdateNewsInputDto {
  type: NewsType;

  title: string;

  content: string;

  contentFormat: NewsContentFormat;

  thumbnail?: number;

  isPublished?: boolean;

  activityId?: number;
}

export class UpdateNewsStatusInputDto {
  rejectionReason?: string;
}
