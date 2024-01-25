import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import { ImageSelector } from 'app/components/ImageSelector';
import { Loading } from 'app/components/Loading/Loading';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute } from 'app/routes';
import { createFilm, getFilmById, updateFilm } from 'app/services/film';
import { getGenre } from 'app/services/genre';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AutocompleteElement,
  FormContainer,
  MultiSelectElement,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { useNavigate, useParams } from 'react-router-dom';
import { ageRestrictedDescription } from 'types/age-restricted';
import { EditMode } from 'types/edit-mode';
import { Genre } from 'types/genre';
import { getImageUrl } from 'utils/get-image-url';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.5;

type CreateFilm = {
  name: string;
  description: string;
  AgeRestricted: string;
  Duration: number;
  TrailerLink: string;
  thumbnailId: number;
  actors: string[];
  genres: number[];
};
export const AdminFilmCreateEditPage = (props: { mode?: EditMode }) => {
  const { filmId } = useParams();
  const { mode } = props;
  const navigate = useNavigate();
  const { showErrorSnackbar } = useGlobalSnackbar();

  const [defaultValue, setDefaultValue] = useState<CreateFilm | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [file, setFile] = useState<File | null>(null);
  const formContext = useForm<CreateFilm>({
    defaultValues: defaultValue ?? undefined,
  });

  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    getGenre().then(res => {
      setGenres(res.data.data);
    });
    if (filmId != null) {
      setIsLoading(true);
      getFilmById(parseInt(filmId)).then(res => {
        setDefaultValue(res.data.data);
        setIsLoading(false);
      });
    }
  }, [filmId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Typography variant={'h4'} sx={{ mt: 3 }}>
        {mode === EditMode.Edit ? 'Edit' : 'Create'} new film
      </Typography>
      <Typography variant={'h6'} color={'text.secondary'} sx={{ my: 1 }}>
        Enter all the requirement info to{' '}
        {mode === EditMode.Edit ? 'edit' : 'create'} film
      </Typography>

      <Dialog
        open={openDialog}
        keepMounted
        onClose={() => setOpenDialog(false)}
      >
        <LinearProgress sx={{ opacity: isDialogLoading ? 100 : 0 }} />
        <DialogTitle>
          {mode === EditMode.Edit ? 'Edit' : 'Create'} film
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure to {mode === EditMode.Edit ? 'edit' : 'create'} this
            film?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isDialogLoading}
            onClick={() => setOpenDialog(false)}
          >
            Close
          </Button>
          <Button disabled={isDialogLoading} onClick={() => onConfirm()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <FormContainer
        context={formContext}
        defaultValues={defaultValue ?? undefined}
        onSuccess={data => {
          setOpenDialog(true);
          setOnConfirm(() => async () => {
            setIsDialogLoading(true);
            try {
              if (mode === EditMode.Edit) {
                await updateFilm(parseInt(filmId!), data as CreateFilm, file);
              } else {
                await createFilm(data as CreateFilm, file);
              }
              navigate(AppRoute.AdminFilmList);
            } catch (error) {
              console.log(JSON.stringify(error));
              showErrorSnackbar(error.response.data.error.details);
            } finally {
              setIsDialogLoading(false);
              setOpenDialog(false);
            }
          });
        }}
      >
        <Grid container spacing={4} sx={{ my: 3 }}>
          <Grid item xs={6}>
            <Typography variant={'h6'} sx={{ my: 1 }}>
              Film info
            </Typography>
            <TextFieldElement
              label="Name"
              fullWidth
              name="name"
              required
              sx={{ my: 2 }}
            />
            <TextFieldElement
              name="description"
              label="Description"
              fullWidth
              multiline
              required
              rows={5}
              sx={{ my: 2 }}
            />
            <TextFieldElement
              name="Duration"
              label="Duration (minutes)"
              fullWidth
              type="number"
              required
              inputProps={{ min: 0 }}
              sx={{ my: 2 }}
            />
            <TextFieldElement
              name="TrailerLink"
              label="Trailer link"
              fullWidth
              required
              sx={{ my: 2 }}
            />
            <Box my={2}>
              <MultiSelectElement
                name="genres"
                fullWidth
                label={'Genres'}
                options={genres}
                itemKey="id"
                itemLabel="name"
                showChips
                required
              />
            </Box>
            <SelectElement
              name="AgeRestricted"
              fullWidth
              label="Age Restricted"
              options={Object.entries(ageRestrictedDescription).map(value => ({
                id: value[0],
                label: value[1],
              }))}
              required
              sx={{ my: 2 }}
            />
            <AutocompleteElement
              name="actors"
              label="Actors"
              multiple
              options={[]}
              autocompleteProps={{
                freeSolo: true,
                renderTags: (value, props) =>
                  value.map((option, index) => (
                    <Chip label={option} {...props({ index })} />
                  )),
                sx: { my: 2 },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant={'h6'} sx={{ my: 1 }}>
              Thumbnail
            </Typography>
            <ImageSelector
              imageStyle={{
                opacity: 0.5,
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
              }}
              onFilePick={file => {
                setFile(file);
              }}
              defaultUrl={getImageUrl(defaultValue?.thumbnailId)}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate(AppRoute.AdminFilmList)}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          {mode === EditMode.Edit ? 'Edit' : 'Create'}
        </Button>
      </FormContainer>
    </>
  );
};
