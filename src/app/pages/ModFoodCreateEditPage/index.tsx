import { Button, Typography } from '@mui/material';
import { Loading } from 'app/components/Loading/Loading';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute } from 'app/routes';
import { getCinemas } from 'app/services/cinema';
import { createFood, getFoodById, updateFood } from 'app/services/food';
import { useEffect, useState } from 'react';
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { useNavigate, useParams } from 'react-router-dom';
import { Cinema } from 'types/cinema';
import { EditMode } from 'types/edit-mode';
import { Food } from 'types/food';

export const ModFoodCreateEditPage = (props: { mode?: EditMode }) => {
  const { mode } = props;

  const { foodId } = useParams();
  const navigate = useNavigate();

  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const { showErrorSnackbar } = useGlobalSnackbar();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [food, setFood] = useState<Food | undefined>(undefined);

  const [isLoadingCinema, setIsLoadingCinema] = useState(true);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    if (foodId != null) {
      getFoodById(foodId).then(res => {
        setFood(res.data.data);
        setIsLoadingData(false);
      });
    } else {
      setIsLoadingData(false);
    }
    getCinemas().then(res => {
      setCinemas(res.data.data);
      setIsLoadingCinema(false);
    });
  }, [foodId]);

  if (isLoadingData || isLoadingCinema) {
    return <Loading />;
  }

  return (
    <>
      <Typography variant={'h4'} sx={{ mt: 3 }}>
        {mode === EditMode.Edit ? 'Edit' : 'Create'} food
      </Typography>
      <Typography variant={'h6'} color={'text.secondary'} sx={{ my: 1 }}>
        Enter all the requirement info to{' '}
        {mode === EditMode.Edit ? 'edit' : 'create'} food
      </Typography>
      <FormContainer
        defaultValues={food}
        onSuccess={data => {
          showDialog({
            title: `${mode === EditMode.Edit ? 'Edit' : 'Create'} food?`,
            description: `Are you sure you want to ${
              mode === EditMode.Edit ? 'edit' : 'create'
            } this food?`,
            onConfirm: () => {
              setDialogLoading(true);
              if (mode === EditMode.Edit) {
                updateFood(food!.id, data)
                  .then(() => {
                    navigate(AppRoute.ModFoodList);
                  })
                  .catch(err => {
                    showErrorSnackbar(err.response.data.error.details);
                  });
              } else {
                createFood(data)
                  .then(() => {
                    navigate(AppRoute.ModFoodList);
                  })
                  .catch(err => {
                    showErrorSnackbar(err.response.data.error.details);
                  });
              }
            },
          });
        }}
      >
        <TextFieldElement
          fullWidth
          name="name"
          label="Name"
          required
          sx={{ my: 2 }}
        />
        <TextFieldElement
          fullWidth
          name="description"
          label="Description"
          required
          sx={{ my: 2 }}
        />
        <SelectElement
          disabled={mode === EditMode.Edit}
          fullWidth
          name="cinemaId"
          label="Cinema"
          options={cinemas.map(cinema => ({
            label: cinema.name,
            id: cinema.id,
          }))}
          required
          sx={{ my: 2 }}
        />
        <TextFieldElement
          fullWidth
          name="quantity"
          label="Quantity"
          inputProps={{ min: 0, max: 10000, maxLength: 5 }}
          type="number"
          required
          sx={{ my: 2 }}
          transform={{ output: value => parseFloat(value) }}
        />
        <TextFieldElement
          fullWidth
          name="price"
          label="Price"
          inputProps={{ type: 'number', max: Number.MAX_SAFE_INTEGER }}
          required
          sx={{ my: 2 }}
          transform={{ output: value => parseFloat(value) }}
        />
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate(AppRoute.ModFoodList)}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          {mode === EditMode.Edit ? 'Save' : 'Create'}
        </Button>
      </FormContainer>
    </>
  );
};
