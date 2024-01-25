import { getMyCinemaBrand } from 'app/services/cinema-brand';
import { useEffect, useState } from 'react';
import { CinemaBrand } from 'types/cinema-brand';
import { Image } from 'mui-image';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'app/routes';

export const ModBrandPage = () => {
  const navigate = useNavigate();
  const [cinemaBrand, setCinemaBrand] = useState<CinemaBrand | null>(null);

  useEffect(() => {
    getMyCinemaBrand().then(res => setCinemaBrand(res.data.data));
  }, []);

  if (!cinemaBrand) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={'bold'}
          sx={{ mt: 2 }}
          textAlign="center"
        >
          You have not had a brand yet. Please create one.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(AppRoute.ModBrandEdit)}
          sx={{ width: '30%' }}
        >
          Create a brand
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Image
        src={getImageUrlOrDefault(cinemaBrand?.logo)}
        style={{ width: '200px', height: '200px', borderRadius: '50%' }}
      />
      <Typography variant="h5" fontWeight={'bold'} sx={{ mt: 2 }}>
        {cinemaBrand?.name}
      </Typography>
    </>
  );
};
