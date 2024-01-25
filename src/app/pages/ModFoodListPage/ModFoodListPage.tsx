import { Add, Delete, Edit, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useAuth } from 'app/context/AuthContext';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute, replaceRouteParams } from 'app/routes';
import { deleteFood, getFoods } from 'app/services/food';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Food, foodQueryIncludes } from 'types/food';
import { Role } from 'types/role';

export const ModFoodListPage = () => {
  const { account } = useAuth();
  const role = account!.roles[0];

  const navigate = useNavigate();
  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<Food[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadFoods = useCallback(() => {
    getFoods({
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      search: search.length > 0 ? search : undefined,
      includes: foodQueryIncludes,
    }).then(res => {
      console.log(res.data.data);
      setData(res.data.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search]);

  useEffect(() => {
    reloadFoods();
  }, [reloadFoods]);

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        Foods Management
      </Typography>

      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          placeholder="Search foods"
          sx={{ width: '40%' }}
          onChange={e => {
            onSearchChange.current(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        {role === Role.Moderator ? (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              navigate(AppRoute.ModFoodCreate);
            }}
          >
            Add
          </Button>
        ) : null}
      </Box>

      <DataGrid
        columns={[
          {
            field: 'id',
            headerName: 'ID',
            width: 100,
          },
          {
            field: 'name',
            headerName: 'Name',
            width: 300,
          },
          {
            field: 'cinemaName',
            headerName: 'Cinema',
            width: 300,
            valueGetter: params => {
              return params.row.cinema!.name;
            },
          },
          {
            field: 'description',
            headerName: 'Description',
            width: 300,
          },
          {
            field: 'quantity',
            headerName: 'Quantity',
            width: 150,
          },
          {
            field: 'price',
            headerName: 'Price',
            width: 150,
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            getActions: params => {
              const elements: JSX.Element[] = [];

              if (role === Role.Moderator) {
                elements.push(
                  <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => {
                      navigate(
                        replaceRouteParams(AppRoute.ModFoodEdit, {
                          foodId: params.id.toString(),
                        }),
                      );
                    }}
                  />,
                );
              }

              elements.push(
                <GridActionsCellItem
                  icon={<Delete />}
                  label="Delete"
                  onClick={async () => {
                    showDialog({
                      title: 'Delete food?',
                      description: 'Are you sure you want to delete this food?',
                      onConfirm: async () => {
                        try {
                          setDialogLoading(true);
                          await deleteFood(parseInt(params.id.toString()));
                          showSuccessSnackbar('Delete food successfully');
                          reloadFoods();
                        } catch (error) {
                          console.log(JSON.stringify(error));
                          showErrorSnackbar(error.response.data.error.details);
                        } finally {
                        }
                      },
                    });
                  }}
                />,
              );

              return elements;
            },
          },
        ]}
        rows={data}
        rowCount={total}
        paginationMode="server"
        loading={isLoadingData}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        checkboxSelection
      ></DataGrid>
    </>
  );
};
