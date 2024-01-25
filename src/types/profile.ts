import { Gender } from './gender';
import { Genre } from './genre';
import { Location } from './location';
import { PaginationQueryDto } from './query';

export class ViewedGenreTimes {
  genre: Genre;
  duration: number;
}

export class Profile {
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatarId?: number | null;
  gender?: Gender | null;
  dateOfBirth?: Date | null;
  address?: string | null;
  phoneNumber?: string | null;
  location?: Location | null;
  interestedGenres?: Genre[] | null;
  viewedGenreTimes?: ViewedGenreTimes[] | null;
}

export class UpdateProfileInputDto {
  username?: string | null;

  phoneNumber?: string | null;

  firstName?: string | null;

  lastName?: string | null;

  dateOfBirth?: Date | null;

  gender?: Gender | null;

  bio?: string | null;

  location?: Location | null;

  avatarId?: number | null;

  interestedGenres?: number[] | null;
}

export enum GetProfileInclude {
  INTERESTED_GENRES = 'interested-genres',
  VIEWED_GENRE_TIMES = 'viewed-genre-times',
}

export const getProfileIncludes = Object.values(GetProfileInclude);

export enum GetProfileSelect {
  Id = 'id',
  Email = 'email',
  Username = 'username',
  FullName = 'full-name',
  PhoneNumber = 'phone-number',
  DateOfBirth = 'date-of-birth',
  Gender = 'gender',
  Bio = 'bio',
  Avatar = 'avatar',
  Location = 'location',
}

export const getProfileBasicSelect = [
  GetProfileSelect.Id,
  GetProfileSelect.Email,
  GetProfileSelect.Username,
  GetProfileSelect.FullName,
  GetProfileSelect.Avatar,
];

export class GetProfileQueryDto extends PaginationQueryDto {
  includes?: GetProfileInclude[];

  select?: GetProfileSelect[];
}

export class GetProfilesQueryDto extends GetProfileQueryDto {
  ids?: number[];

  excludeId?: number[];

  search?: string;
}
