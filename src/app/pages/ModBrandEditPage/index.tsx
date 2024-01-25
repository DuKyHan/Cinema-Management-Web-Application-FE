import { Typography } from '@mui/material';
import { getMyCinemaBrand } from 'app/services/cinema-brand';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CinemaBrand } from 'types/cinema-brand';

export const ModBrandEditPage = () => {
  const navigate = useNavigate();
  const [cinemaBrand, setCinemaBrand] = useState<CinemaBrand | null>(null);

  useEffect(() => {
    getMyCinemaBrand().then(res => setCinemaBrand(res.data.data));
  }, []);

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        Edit brand
      </Typography>
    </>
  );
};
