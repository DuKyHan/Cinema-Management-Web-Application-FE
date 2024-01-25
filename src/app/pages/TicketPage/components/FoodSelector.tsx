import { Add, Remove } from '@mui/icons-material';
import { Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Loading } from 'app/components/Loading/Loading';
import { getFoods } from 'app/services/food';
import { useCallback, useEffect, useState } from 'react';
import { CinemaFilm } from 'types/cinema-film';
import { CinemaFilmPremiere } from 'types/cinema-film-premiere';
import { Food, foodQueryIncludes } from 'types/food';
import { SeatData } from '..';
import { FilmInfo } from './FilmInfo';

export class FoodData {
  food: Food;
  quantity: number;
}

export const FoodSelector = (props: {
  cinemaFilm: CinemaFilm;
  cinemaFilmPremiere: CinemaFilmPremiere;
  selectedSeat: SeatData | null;
  onFoodDataChange: (foodData: FoodData[]) => void;
  defaultFoodData?: FoodData[];
}) => {
  const {
    cinemaFilm,
    cinemaFilmPremiere,
    selectedSeat,
    defaultFoodData,
    onFoodDataChange,
  } = props;

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<Food[]>([]);
  const [total, setTotal] = useState(0);

  const [foodDatum, setFoodDatum] = useState<FoodData[]>(defaultFoodData ?? []);

  const reloadFoods = useCallback(() => {
    getFoods({
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      cinemaId: cinemaFilm.cinema!.id,
      includes: foodQueryIncludes,
    }).then(res => {
      setData(res.data.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, cinemaFilm]);

  useEffect(() => {
    reloadFoods();
  }, [reloadFoods]);

  if (isLoadingData) {
    return <Loading />;
  }

  const foodPrice = foodDatum.reduce((prev, curr) => {
    return (
      prev + curr.quantity * data.find(food => food.id === curr.food.id)!.price
    );
  }, 0);

  return (
    <Stack direction={'row'} gap={6} justifyContent="center" mt={6}>
      <DataGrid
        columns={[
          {
            field: 'name',
            headerName: 'Combo',
            width: 600,
            renderCell: params => {
              return (
                <Tooltip
                  title={
                    <Stack>
                      <Typography>{params.row.name}</Typography>
                      <Typography variant="body2" color="white">
                        {params.row.description}
                      </Typography>
                    </Stack>
                  }
                >
                  <Stack>
                    <Typography>{params.row.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {params.row.description}
                    </Typography>
                  </Stack>
                </Tooltip>
              );
            },
          },
          {
            field: 'price',
            headerName: 'Price',
            width: 100,
            valueGetter: params => {
              if (params.row.price === 0) {
                return 'Free';
              }
              return params.row.price;
            },
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Quantity',
            cellClassName: 'actions',
            getActions: params => {
              const food = params.row as Food;
              const foodData = foodDatum.find(
                foodData => foodData.food.id === food.id,
              );

              return [
                <GridActionsCellItem
                  icon={<Remove />}
                  label={'Remove'}
                  onClick={() => {
                    if (foodData && foodData.quantity > 1) {
                      foodData.quantity--;
                      const newFoodDatum = [...foodDatum];
                      setFoodDatum(newFoodDatum);
                      onFoodDataChange(newFoodDatum);
                    } else {
                      const newFoodDatum = [
                        ...foodDatum.filter(
                          foodData => foodData.food.id !== food.id,
                        ),
                      ];
                      setFoodDatum(newFoodDatum);
                      onFoodDataChange(newFoodDatum);
                    }
                  }}
                />,
                <Typography>{foodData?.quantity ?? 0}</Typography>,
                <GridActionsCellItem
                  icon={<Add />}
                  label={'Add'}
                  onClick={() => {
                    if (foodData && food.quantity > foodData.quantity) {
                      foodData.quantity++;
                      const newFoodDatum = [...foodDatum];
                      setFoodDatum(newFoodDatum);
                      onFoodDataChange(newFoodDatum);
                    } else {
                      const newFoodDatum = [
                        ...foodDatum,
                        {
                          food: food,
                          quantity: 1,
                        },
                      ];
                      setFoodDatum(newFoodDatum);
                      onFoodDataChange(newFoodDatum);
                    }
                  }}
                />,
              ];
            },
          },
        ]}
        rows={data}
        rowCount={total}
        paginationMode="server"
        loading={isLoadingData}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <FilmInfo
        cinemaFilm={cinemaFilm}
        cinemaFilmPremiere={cinemaFilmPremiere}
        seat={selectedSeat}
        trailingElement={
          <>
            <Typography fontWeight={'bold'}>
              Food price: {foodPrice} VND
            </Typography>
            <Typography fontWeight={'bold'}>
              Total price: {foodPrice + selectedSeat!.cinemaFilmSeat.price} VND
            </Typography>
          </>
        }
      />
    </Stack>
  );
};
