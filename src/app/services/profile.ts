import { GetProfileQueryDto, UpdateProfileInputDto } from 'types/profile';
import { authAxiosInstance } from 'utils/axios';

export const getMyProfile = (query?: GetProfileQueryDto) => {
  return authAxiosInstance.get('/profiles/me', {
    params: { ...query, includes: query?.includes?.join(',') },
  });
};

export const updateProfile = async (
  profile?: UpdateProfileInputDto | null,
  avatar?: File | null,
) => {
  // Upload avatar from local URL
  const formData = new FormData();
  let avatarId = profile?.avatarId;
  if (avatar) {
    formData.append('file', avatar, avatar.name);
    const resFile = await authAxiosInstance.post('/files/upload', formData);
    avatarId = resFile.data.data.id;
  }
  return authAxiosInstance.put('/profiles/me', { ...profile, avatarId });
};
