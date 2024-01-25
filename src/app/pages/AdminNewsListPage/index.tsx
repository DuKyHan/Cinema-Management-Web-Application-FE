import { CancelOutlined, Check, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogContentText,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import {
  approveNews,
  getNews,
  ManyNewsQueryDto,
  rejectNews,
} from 'app/services/news';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { News, NewsStatus, newsStatuses } from 'types/news';

export const AdminNewsListPage = () => {
  const navigate = useNavigate();

  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const {
    showDialog,
    setDialogLoading,
    showRawDialog,
    isDialogLoading,
    closeDialog,
  } = useGlobalDialogContext();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<News[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(new ManyNewsQueryDto());

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadNews = useCallback(() => {
    getNews({
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      search: search.length > 0 ? search : undefined,
      ...query,
    }).then(res => {
      setData(res.data.data);
      console.log(res.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search, query]);

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
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Typography sx={{ alignSelf: 'center' }}>Filter status:</Typography>
        <Chip
          label="all"
          color={query.status === undefined ? 'primary' : undefined}
          onClick={() => {
            setQuery({
              ...query,
              status: undefined,
            });
          }}
        />
        {newsStatuses.map(status => (
          <Chip
            label={status}
            color={query.status === status ? 'primary' : undefined}
            onClick={() => {
              setQuery({
                ...query,
                status: status,
              });
            }}
          />
        ))}
      </Stack>

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
            field: 'rejectionReason',
            headerName: 'Rejection reason',
            width: 200,
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            getActions: params => {
              const items: JSX.Element[] = [];

              if (params.row.status !== NewsStatus.Published) {
                items.push(
                  <GridActionsCellItem
                    icon={<Check />}
                    label="Approve"
                    onClick={() => {
                      showDialog({
                        title: 'Approve news',
                        description: 'Are you sure to approve this news?',
                        onConfirm: async () => {
                          try {
                            setDialogLoading(true);
                            await approveNews(parseInt(params.id.toString()));
                            showSuccessSnackbar('Approve news successfully');
                            reloadNews();
                          } catch (error) {
                            console.log(JSON.stringify(error));
                            showErrorSnackbar(
                              error.response.data.error.details,
                            );
                          } finally {
                          }
                        },
                      });
                    }}
                  />,
                );
              }

              if (params.row.status !== NewsStatus.Rejected) {
                items.push(
                  <GridActionsCellItem
                    icon={<CancelOutlined />}
                    label="Reject"
                    onClick={async () => {
                      showRawDialog({
                        title: 'Reject news',
                        content: (
                          <FormContainer
                            onSuccess={async value => {
                              setDialogLoading(true);
                              try {
                                await rejectNews(params.id, {
                                  rejectionReason: value.comment,
                                });
                                showSuccessSnackbar('Reject news successfully');
                                reloadNews();
                              } catch (error) {
                                showErrorSnackbar(
                                  error.response.data.error.details,
                                );
                              } finally {
                                closeDialog();
                              }
                            }}
                          >
                            <DialogContent>
                              <DialogContentText sx={{ mb: 2 }}>
                                Are you sure to reject this news?
                              </DialogContentText>
                              <TextFieldElement
                                fullWidth
                                name="comment"
                                label="Comment"
                                multiline
                                rows={5}
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button
                                disabled={isDialogLoading}
                                onClick={() => closeDialog()}
                              >
                                Cancel
                              </Button>
                              <Button disabled={isDialogLoading} type="submit">
                                Confirm
                              </Button>
                            </DialogActions>
                          </FormContainer>
                        ),
                      });
                    }}
                  />,
                );
              }

              return items;
            },
          },
        ]}
        rows={data}
        rowCount={total}
        paginationMode="server"
        loading={isLoadingData}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        //checkboxSelection
      ></DataGrid>
    </>
  );
};
