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
import { deleteFilm, getFilms } from 'app/services/film';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'types/film';

export function AdminFilmListPage() {
  const navigate = useNavigate();

  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const { showDialog, setDialogLoading } = useGlobalDialogContext();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<Film[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadFilms = useCallback(() => {
    getFilms({
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      search: search.length > 0 ? search : undefined,
    }).then(res => {
      setData(res.data.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search]);

  useEffect(() => {
    reloadFilms();
  }, [reloadFilms]);

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        Films Management
      </Typography>

      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          placeholder="Search films"
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
            navigate(AppRoute.AdminFilmCreate);
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
            field: 'name',
            headerName: 'Name',
            width: 400,
          },

          {
            field: 'AgeRestricted',
            headerName: 'Age Restricted',
            width: 110,
          },
          {
            field: 'description',
            headerName: 'Description',
            width: 500,
          },
          {
            field: 'Duration',
            headerName: 'Duration (minutes)',
            width: 200,
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
                    replaceRouteParams(AppRoute.AdminFilmEdit, {
                      filmId: params.id.toString(),
                    }),
                  );
                }}
              />,
              <GridActionsCellItem
                icon={<Delete />}
                label="Delete"
                onClick={async () => {
                  showDialog({
                    title: 'Delete film',
                    description: 'Are you sure to delete this film?',
                    onConfirm: async () => {
                      try {
                        setDialogLoading(true);
                        await deleteFilm(parseInt(params.id.toString()));
                        showSuccessSnackbar('Delete film successfully');
                        reloadFilms();
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
}
