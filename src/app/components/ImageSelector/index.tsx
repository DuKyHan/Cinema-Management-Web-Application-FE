import { UploadFile } from '@mui/icons-material';
import { Box, Button, styled } from '@mui/material';
import Image from 'mui-image';
import { CSSProperties, useState } from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const ImageSelector = (props: {
  imageStyle?: CSSProperties;
  onFilePick?: (file: File) => void;
  defaultUrl?: string | null;
}) => {
  const { imageStyle, defaultUrl } = props;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>(
    defaultUrl ??
      'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg',
  );

  const handleFileSelect = event => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      props.onFilePick?.(file);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Image src={image} style={imageStyle}></Image>
      <Button
        component="label"
        startIcon={<UploadFile />}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        Upload Image
        <VisuallyHiddenInput type="file" onChange={handleFileSelect} />
      </Button>
    </Box>
  );
};
