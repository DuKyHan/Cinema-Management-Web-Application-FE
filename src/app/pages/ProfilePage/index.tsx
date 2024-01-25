import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { ErrorComponent } from 'app/components/Error/Error';
import { Loading } from 'app/components/Loading/Loading';
import { useAuth } from 'app/context/AuthContext';
import { AppRoute } from 'app/routes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileIncludes, Profile } from 'types/profile';
import { getMyProfile } from '../../services/profile';
import { DetailInfo } from './components/DetailInfo';
import { Interests } from './components/Interests';
import { MainInfo } from './components/MainInfo';
import { ViewingTime } from './components/ViewingTime';

export function ProfilePage() {
  const { account } = useAuth();
  const [profile, setProfile] = useState<Profile | null>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    getMyProfile({
      includes: getProfileIncludes,
    })
      .then(res => {
        const profile: Profile = res.data.data;
        setProfile(profile);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.response.data.error.details);
        setIsLoading(false);
      });
  }, []);

  const navigate = useNavigate();

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (profile == null) {
    return (
      <Stack justifyContent={'center'} alignItems="center" spacing={2}>
        <Typography variant="h5" textAlign={'center'}>
          Your profile is not complete. Click "Edit profile" to start filling it
          out...
        </Typography>
        <Button
          variant="contained"
          sx={{ textTransform: 'none', width: '80%' }}
          onClick={() => {
            navigate(AppRoute.ProfileEdit);
          }}
        >
          Edit Profile
        </Button>
      </Stack>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            m: 3,
          }}
        >
          <MainInfo profile={profile!} email={account!.email} />
          <Button
            variant="contained"
            sx={{ textTransform: 'none', width: '80%' }}
            onClick={() => {
              navigate(AppRoute.ProfileEdit);
            }}
          >
            Edit Profile
          </Button>
          <DetailInfo profile={profile} />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            m: 3,
          }}
        >
          <Interests
            genres={profile?.interestedGenres?.map(g => g.name) ?? []}
          />
          <ViewingTime viewedGenreTimes={profile?.viewedGenreTimes ?? []} />
          {/* <Tickets
            tickets={[
              {
                name: 'The Shawshank Redemption',
                premiere: new Date('2021-10-10 10:10:10'),
                price: 100000,
              },
              {
                name: 'Shang-Chi and the Legend of the Ten Rings',
                premiere: new Date('2022-12-11 01:44:20'),
                price: 2000,
              },
              {
                name: 'The Green Mile',
                premiere: new Date('2021-10-10 10:10:10'),
                price: 100000,
              },
              {
                name: 'The Lord of the Rings: The Return of the King',
                premiere: new Date('2022-12-11 01:44:20'),
                price: 2000,
              },
            ]}
          />
          <News
            news={[
              {
                title: 'The Shawshank Redemption have been released',
                filmName: 'The Shawshank Redemption',
              },
              {
                title:
                  'Shang-Chi and the Legend of the Ten Rings now in cinemas',
                filmName: 'Shang-Chi and the Legend of the Ten Rings',
              },
            ]}
          /> */}
        </Box>
      </Grid>
    </Grid>
  );
}
