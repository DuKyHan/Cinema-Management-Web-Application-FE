import { Profile } from 'types/profile';

export const getProfileDisplayName = (profile: Profile) => {
  if (!profile) {
    return null;
  }
  const { firstName, lastName } = profile;
  if (!firstName && !lastName) {
    return null;
  }
  return `${firstName} ${lastName}`;
};

export const getProfileDisplayNameOrDefault = (
  profile: Profile | null | undefined,
  def: any,
) => {
  if (!profile) {
    return def;
  }
  const { firstName, lastName } = profile;
  if (!firstName && !lastName) {
    return def;
  }
  return `${firstName} ${lastName}`;
};
