import { Search } from '@mui/icons-material';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { getTickets } from 'app/services/ticket';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, TicketSort } from 'types/ticket';
import { alphabetNumberFromRowColumn } from 'utils/general';

export const TicketListPage = (props: {}) => {
  const navigate = useNavigate();

  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const { showDialog, setDialogLoading } = useGlobalDialogContext();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadTickets = useCallback(() => {
    getTickets({
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      search: search.length > 0 ? search : undefined,
      sort: TicketSort.CreatedAtDesc,
    }).then(res => {
      setData(res.data.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search]);

  useEffect(() => {
    reloadTickets();
  }, [reloadTickets]);

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        Tickets Management
      </Typography>

      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          placeholder="Search tickets"
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
      </Box>

      <DataGrid
        columns={[
          {
            field: 'film',
            headerName: 'Film',
            width: 300,
            valueGetter: params => {
              return params.row.film?.name;
            },
          },
          {
            field: 'cinema',
            headerName: 'Cinema',
            width: 300,
            valueGetter: params => {
              return params.row.cinema?.name;
            },
          },
          {
            field: 'room',
            headerName: 'Room',
            width: 300,
            valueGetter: params => {
              return params.row.room?.name;
            },
          },
          {
            field: 'seat',
            headerName: 'Seat',
            width: 100,
            valueGetter: params => {
              return params.row.seat != null
                ? alphabetNumberFromRowColumn(
                    params.row.seat.row,
                    params.row.seat.column,
                  )
                : '';
            },
          },
          {
            field: 'createdAt',
            headerName: 'Purchased Date',
            width: 200,
            valueGetter: params => {
              return dayjs(params.row.createdAt).format('DD/MM/YYYY HH:mm');
            },
          },
          {
            field: 'price',
            headerName: 'Price',
            width: 200,
          },
          // {
          //   field: 'actions',
          //   type: 'actions',
          //   headerName: 'Actions',
          //   cellClassName: 'actions',
          //   getActions: params => [
          //     <GridActionsCellItem
          //       icon={<Delete />}
          //       label="Delete"
          //       onClick={async () => {
          //         showDialog({
          //           title: 'Delete film',
          //           description: 'Are you sure to delete this film?',
          //           onConfirm: async () => {
          //             try {
          //               // setDialogLoading(true);
          //               // await deleteFilm(parseInt(params.id.toString()));
          //               // showSuccessSnackbar('Delete film successfully');
          //               // reloadTickets();
          //             } catch (error) {
          //               console.log(JSON.stringify(error));
          //               showErrorSnackbar(error.response.data.error.details);
          //             } finally {
          //             }
          //           },
          //         });
          //       }}
          //     />,
          //   ],
          // },
        ]}
        rows={data}
        rowCount={total}
        paginationMode="server"
        loading={isLoadingData}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      ></DataGrid>
    </>
  );
};
