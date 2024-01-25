import { Add, Delete, Edit, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute, replaceRouteParams } from 'app/routes';
import { deleteCinemaFilm, getCinemaFilms } from 'app/services/cinema-film';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CinemaFilm,
  CinemaFilmInclude,
  ExtendedCinemaFilm,
} from 'types/cinema-film';

export const ModCinemaFilmListPage = () => {
  const navigate = useNavigate();
  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<ExtendedCinemaFilm[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadCinemaFilms = useCallback(() => {
    getCinemaFilms({
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      search: search.length > 0 ? search : undefined,
      includes: [
        CinemaFilmInclude.Film,
        CinemaFilmInclude.Cinema,
        CinemaFilmInclude.Room,
      ],
    }).then(res => {
      setData(
        (res.data.data as CinemaFilm[]).map(
          item =>
            ({
              ...item,
              cinemaName: item.cinema?.name,
              filmName: item.film?.name,
              roomName: item.room?.name,
            } as ExtendedCinemaFilm),
        ),
      );

      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search]);

  useEffect(() => {
    reloadCinemaFilms();
  }, [reloadCinemaFilms]);

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        Cinema Films Management
      </Typography>

      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          placeholder="Search cinemas or films"
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            navigate(AppRoute.ModCinemaFilmCreate);
          }}
        >
          Add
        </Button>
      </Box>

      <DataGrid
        columns={[
          {
            field: 'id',
            headerName: 'ID',
            width: 100,
          },
          {
            field: 'cinemaName',
            headerName: 'Cinema',
            width: 300,
            valueGetter: params => params.row.cinema?.name,
          },
          {
            field: 'roomName',
            headerName: 'Room',
            width: 300,
            valueGetter: params => params.row.room?.name,
          },
          {
            field: 'filmName',
            headerName: 'Film',
            width: 300,
            valueGetter: params => params.row.film?.name,
          },
          {
            field: 'premiere',
            headerName: 'Premiere',
            width: 200,
            valueGetter: params => {
              const p = params.row.premieres;
              if (p) {
                return p
                  .map(item => dayjs(item.premiere).format('DD/MM/YYYY HH:mm'))
                  .join(', ');
              }
            },
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            getActions: params => [
              <GridActionsCellItem
                icon={<Edit />}
                label="Edit"
                onClick={() => {
                  navigate(
                    replaceRouteParams(AppRoute.ModCinemaFilmEdit, {
                      cinemaFilmId: params.id.toString(),
                    }),
                  );
                }}
              />,
              <GridActionsCellItem
                icon={<Delete />}
                label="Delete"
                onClick={async () => {
                  showDialog({
                    title: 'Delete cinema film',
                    description: 'Are you sure to delete this cinema film?',
                    onConfirm: async () => {
                      try {
                        setDialogLoading(true);
                        await deleteCinemaFilm(parseInt(params.id.toString()));
                        showSuccessSnackbar('Delete cinema film successfully');
                        reloadCinemaFilms();
                      } catch (error) {
                        console.log(JSON.stringify(error));
                        showErrorSnackbar(error.response.data.error.details);
                      } finally {
                      }
                    },
                  });
                }}
              />,
            ],
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
