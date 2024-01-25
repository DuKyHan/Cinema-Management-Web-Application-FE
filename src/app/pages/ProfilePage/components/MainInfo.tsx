import { Typography } from '@mui/material';
import Image from 'mui-image';
import { Profile } from 'types/profile';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { getProfileDisplayNameOrDefault } from 'utils/profile';

export const MainInfo = (props: { profile: Profile; email: string }) => {
  const { profile, email } = props;

  return (
    <>
      <Image
        src={getImageUrlOrDefault(profile.avatarId)}
        style={{ width: '200px', height: '200px', borderRadius: '50%' }}
      />
      <Typography variant="h5" fontWeight={'bold'} sx={{ mt: 2 }}>
        {getProfileDisplayNameOrDefault(profile, email)}
      </Typography>
      <Typography textAlign="justify" color={'gray'} sx={{ my: 2 }}>
        {profile.bio ?? 'No bio'}
      </Typography>
    </>
  );
};
