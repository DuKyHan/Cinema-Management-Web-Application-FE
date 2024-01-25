import { Box, Button, Grid, Typography } from '@mui/material';
import { Map, Marker } from '@vis.gl/react-google-maps';
import { Loading } from 'app/components/Loading/Loading';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute } from 'app/routes';
import { createCinema, getCinema, updateCinema } from 'app/services/cinema';
import { useEffect, useState } from 'react';
import { fromLatLng } from 'react-geocode';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useNavigate, useParams } from 'react-router-dom';
import { Cinema, CreateCinemaDto, UpdateCinemaDto } from 'types/cinema';
import { EditMode } from 'types/edit-mode';
import { Location } from 'types/location';
import { locationToString } from 'utils/location';

export const ModCinemaCreateEditPage = (props: { mode?: EditMode }) => {
  const { cinemaId } = useParams();
  const navigate = useNavigate();
  const { showErrorSnackbar } = useGlobalSnackbar();
  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const { mode } = props;

  const formContext = useForm<CreateCinemaDto>();
  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [isCinemaLoading, setCinemaLoading] = useState<boolean>(true);

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (cinemaId != null) {
      getCinema(cinemaId)
        .then(res => {
          setCinema(res.data.data);
          console.log(res.data.data);
          setCurrentLocation(res.data.data.location ?? null);
        })
        .finally(() => {
          setCinemaLoading(false);
        });
    } else {
      setCinemaLoading(false);
    }
  }, [cinemaId]);

  if (isCinemaLoading) {
    return <Loading />;
  }

  return (
    <FormContainer
      context={formContext}
      defaultValues={cinema ?? undefined}
      onSuccess={data => {
        showDialog({
          title: `${mode === EditMode.Edit ? 'Edit' : 'Create'} cinema`,
          description: `Are you sure you want to ${
            mode === EditMode.Edit ? 'edit' : 'create'
          } cinema ${data.name}?`,
          onConfirm: async () => {
            try {
              setDialogLoading(true);
              if (mode === EditMode.Edit) {
                await updateCinema(cinemaId!, {
                  ...data,
                  location: currentLocation ?? undefined,
                } as UpdateCinemaDto);
              } else {
                await createCinema({
                  ...data,
                  location: currentLocation ?? undefined,
                } as CreateCinemaDto);
              }
              navigate(AppRoute.ModCinemaList);
            } catch (error) {
              console.log(JSON.stringify(error));
              showErrorSnackbar(error.response.data.error.details);
            }
          },
        });
      }}
    >
      <Typography variant={'h4'} sx={{ my: 3 }}>
        {props.mode === EditMode.Edit ? 'Edit' : 'Create'} cinema
      </Typography>
      <Typography variant={'h6'} color={'text.secondary'} sx={{ my: 1 }}>
        Enter all the requirement info to{' '}
        {mode === EditMode.Edit ? 'edit' : 'create'} cinema
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant={'h6'} sx={{ my: 1 }} fontWeight="bold">
            Basic info
          </Typography>
          <TextFieldElement
            fullWidth
            required
            name="name"
            label="Name"
            sx={{ my: 2 }}
          />
          <TextFieldElement
            fullWidth
            required
            name="description"
            label="Description"
            rows={5}
            multiline
            sx={{ my: 2 }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant={'h6'} sx={{ my: 1 }} fontWeight="bold">
            Location
          </Typography>
          <Typography variant={'body2'} sx={{ my: 1 }}>
            Click on the map to select the cinema location
          </Typography>
          <Typography color="primary" sx={{ mb: 2 }}>
            {currentLocation == null ||
            currentLocation.latitude == null ||
            currentLocation.longitude == null
              ? 'No location selected'
              : locationToString(currentLocation)}
          </Typography>
          <Box sx={{ height: '300px' }}>
            <Map
              zoom={17}
              center={
                currentLocation == null ||
                currentLocation.latitude == null ||
                currentLocation.longitude == null
                  ? { lat: 10.877581091937635, lng: 106.80162290066895 }
                  : {
                      lat: currentLocation.latitude!,
                      lng: currentLocation.longitude!,
                    }
              }
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              onClick={async e => {
                const lat = e.detail?.latLng?.lat;
                const lng = e.detail?.latLng?.lng;
                if (lat == null || lng == null) {
                  return;
                }
                try {
                  const res = await fromLatLng(lat, lng);
                  const firstResult = res.results[0];
                  if (firstResult == null) {
                    return;
                  }
                  const countryIndex = firstResult.address_components.findIndex(
                    c => c.types.includes('country'),
                  )?.long_name;
                  if (countryIndex === -1) {
                    return;
                  }
                  const country =
                    firstResult.address_components[
                      firstResult.address_components.length - 1
                    ].short_name;
                  const addressLineNames = firstResult.address_components
                    .slice(0, firstResult.address_components.length - 1)
                    .map(c => c.long_name);
                  const addressLine = addressLineNames.join(', ');
                  setCurrentLocation({
                    latitude: lat,
                    longitude: lng,
                    addressLine1: addressLine,
                    country: country,
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <Marker
                position={
                  currentLocation == null ||
                  currentLocation.latitude == null ||
                  currentLocation.longitude == null
                    ? { lat: 10.877581091937635, lng: 106.80162290066895 }
                    : {
                        lat: currentLocation.latitude!,
                        lng: currentLocation.longitude!,
                      }
                }
              />
            </Map>
          </Box>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="error"
        onClick={() => navigate(AppRoute.ModCinemaList)}
        sx={{ mr: 2 }}
      >
        Cancel
      </Button>
      <Button type="submit" variant="contained" sx={{ my: 2 }}>
        {mode === EditMode.Edit ? 'Edit' : 'Create'}
      </Button>
    </FormContainer>
  );
};
