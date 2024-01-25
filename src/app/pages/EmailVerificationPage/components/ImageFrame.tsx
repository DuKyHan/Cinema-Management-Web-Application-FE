import { Grid } from '@mui/material';
import Image from 'mui-image';
import VertificationImage from '../assets/VertificationImage.png';

export const ImageFrame = props => {
  return (
    <Grid item xs={6} height={'80vh'} sx={{ p: 3 }}>
      <Image
        src={VertificationImage}
        alt="Item"
        fit="cover"
        easing="linear"
        duration={1000}
        style={{ borderRadius: '25px' }}
      />
    </Grid>
  );
};
