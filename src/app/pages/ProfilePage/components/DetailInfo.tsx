import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Profile } from 'types/profile';
import { locationToString } from 'utils/location';
import { InfoLine } from './InfoLine';

export const DetailInfo = (props: { profile: Profile }) => {
  const { profile } = props;

  return (
    <Box sx={{ mt: 5, width: '100%' }}>
      <Typography
        variant="h6"
        fontWeight={'bold'}
        textAlign={'center'}
        sx={{ borderBottom: 2, width: '100%', borderColor: 'dodgerblue' }}
      >
        Detail
      </Typography>
      <InfoLine title="Gender" value={profile.gender} />
      <InfoLine
        title="Date of birth"
        value={
          profile.dateOfBirth
            ? dayjs(profile.dateOfBirth!).format('DD/MM/YYYY')
            : null
        }
      />
      <InfoLine
        title="Address"
        value={profile.location ? locationToString(profile.location!) : null}
      />
      <InfoLine title="Phone" value={profile.phoneNumber} />
    </Box>
  );
};
