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
import { deleteNews, getNews } from 'app/services/news';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { News, NewsStatus } from 'types/news';

export const ModNewsListPage = () => {
  const navigate = useNavigate();
  const { account } = useAuth();

  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const { showDialog, setDialogLoading } = useGlobalDialogContext();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<News[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadNews = useCallback(() => {
    getNews({
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      search: search.length > 0 ? search : undefined,
      authorId: account?.id,
    }).then(res => {
      setData(res.data.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search, account?.id]);

  useEffect(() => {
    reloadNews();
  }, [reloadNews]);

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        News Management
      </Typography>

      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          placeholder="Search news"
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
            navigate(AppRoute.ModNewsCreate);
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
            field: 'title',
            headerName: 'Title',
            width: 300,
          },

          {
            field: 'content',
            headerName: 'Content',
            width: 500,
          },
          {
            field: 'status',
            headerName: 'Status',
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
                disabled={params.row.status !== NewsStatus.Pending}
                label="Edit"
                onClick={() => {
                  navigate(
                    replaceRouteParams(AppRoute.ModNewsEdit, {
                      newsId: params.id.toString(),
                    }),
                  );
                }}
              />,
              <GridActionsCellItem
                icon={<Delete />}
                label="Delete"
                onClick={async () => {
                  showDialog({
                    title: 'Delete news',
                    description: 'Are you sure to delete this news?',
                    onConfirm: async () => {
                      try {
                        setDialogLoading(true);
                        await deleteNews(parseInt(params.id.toString()));
                        showSuccessSnackbar('Delete news successfully');
                        reloadNews();
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
