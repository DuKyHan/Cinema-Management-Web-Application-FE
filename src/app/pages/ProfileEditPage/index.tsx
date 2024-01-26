import { UploadFile } from '@mui/icons-material';
import { Box, Button, Chip, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ErrorComponent } from 'app/components/Error/Error';
import { Loading } from 'app/components/Loading/Loading';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { useCurrentProfile } from 'app/context/ProfileContext';
import { AppRoute } from 'app/routes';
import { getGenre } from 'app/services/genre';
import dayjs from 'dayjs';
import Image from 'mui-image';
import { useEffect, useState } from 'react';
import {
  AutocompleteElement,
  DatePickerElement,
  FormContainer,
  RadioButtonGroup,
  TextFieldElement,
} from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { genders } from 'types/gender';
import { Genre } from 'types/genre';
import { Location } from 'types/location';
import { getProfileIncludes, Profile } from 'types/profile';
import { DEFAULT_AVATAR_URL, getImageUrl } from 'utils/get-image-url';
import { getMyProfile, updateProfile } from '../../services/profile';

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

export const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string>(
    'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg',
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [isGenresLoading, setIsGenresLoading] = useState<boolean>(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { setCurrentProfile } = useCurrentProfile();

  useEffect(() => {
    getMyProfile({
      includes: getProfileIncludes,
    })
      .then(res => {
        const profile: Profile = res.data.data;
        console.log(profile);
        setProfile(profile);
        setImage(getImageUrl(profile.avatarId) || DEFAULT_AVATAR_URL);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.response.data.error.details);
        setIsLoading(false);
      });
    getGenre()
      .then(res => {
        setGenres(res.data.data);
        setIsGenresLoading(false);
      })
      .catch(err => {
        setError(err.response.data.error.details);
        setIsGenresLoading(false);
      });
  }, []);

  const handleFileSelect = event => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (isLoading || isGenresLoading) {
    return <Loading />;
  }

  return (
    <FormContainer
      defaultValues={{
        ...profile,
        dateOfBirth:
          profile?.dateOfBirth == null ? null : dayjs(profile?.dateOfBirth),
        interestedGenres: profile?.interestedGenres?.map(g => ({
          id: g.id,
          label: g.name,
          value: g.name,
        })),
      }}
      onSuccess={async (value: any) => {
        console.log(value);
        showDialog({
          title: 'Update profile',
          description: 'Are you sure to update your profile?',
          onConfirm: async () => {
            try {
              setDialogLoading(true);
              const phoneNumber = value.phoneNumber.toString();
              const newProfile: any = {
                ...value,
                dateOfBirth: value.dateOfBirth.toDate(),
                phoneNumber:
                  phoneNumber === ''
                    ? null
                    : phoneNumber.startsWith('+84')
                    ? phoneNumber
                    : `+84${phoneNumber}`,
                interestedGenres: value.interestedGenres.map(g => g.id),
              };
              const res = await updateProfile(newProfile, imageFile);
              showSuccessSnackbar('Update profile successfully');
              setCurrentProfile(res.data.data);
              navigate(AppRoute.Profile);
            } catch (error) {
              console.log(error);
              //showErrorSnackbar(error.response.data.error.details);
            } finally {
            }
          },
        });
      }}
    >
      <Grid container>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              my: 3,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Image
                src={image}
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  opacity: 0.5,
                }}
              ></Image>
              <Button
                component="label"
                startIcon={<UploadFile />}
                sx={{ position: 'absolute', top: '50%', left: '40%' }}
              >
                Upload Image
                <VisuallyHiddenInput type="file" onChange={handleFileSelect} />
              </Button>
            </Box>

            <TextFieldElement
              fullWidth
              name="firstName"
              label="First name"
              sx={{ mt: 2 }}
            />
            <TextFieldElement
              fullWidth
              name="lastName"
              label="Last name"
              sx={{ mt: 2 }}
            />
            <TextFieldElement
              fullWidth
              name="bio"
              label="Bio"
              sx={{ mt: 2 }}
              minRows={5}
              multiline
            />
            <Box sx={{ mt: 2 }}>
              <RadioButtonGroup
                name="gender"
                label="Gender"
                options={genders.map(g => ({
                  id: g,
                  label: g,
                }))}
                row
              />
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePickerElement
                name="dateOfBirth"
                label="Date of Birth"
                sx={{ mt: 2, width: '100%' }}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
            <TextFieldElement
              fullWidth
              name="location"
              label="Address"
              sx={{ mt: 2 }}
              transform={{
                input: (value: Location) => value?.addressLine1,
                output: (value: string) => ({
                  addressLine1: value,
                }),
              }}
            />
            <TextFieldElement
              fullWidth
              type="number"
              name="phoneNumber"
              label="Phone Number"
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: '+84',
              }}
              transform={{
                input: (value: any) => {
                  if (typeof value == 'string' && value.startsWith('+84')) {
                    return value.slice(3);
                  }
                  return value;
                },
              }}
            />
            <AutocompleteElement
              name="interestedGenres"
              label="Interests"
              multiple
              options={genres.map(g => ({
                id: g.id,
                label: g.name,
                value: g.name,
              }))}
              autocompleteProps={{
                freeSolo: true,
                renderTags: (value, props) =>
                  value.map((option, index) => (
                    <Chip label={option.label} {...props({ index })} />
                  )),
                sx: { my: 2 },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                mt: 6,
              }}
            >
              <Button
                type="submit"
                disabled={profile == null && imageFile == null}
                fullWidth
                variant="contained"
              >
                Save
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => navigate(AppRoute.Profile)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </FormContainer>
  );
};
