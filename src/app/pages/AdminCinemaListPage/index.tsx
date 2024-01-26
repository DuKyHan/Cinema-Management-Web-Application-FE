import {
  Block,
  CancelOutlined,
  Check,
  RemoveRedEye,
  Search,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogContentText,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute, replaceRouteParams } from 'app/routes';
import {
  disableCinema,
  enableCinema,
  getCinemas,
  rejectCinema,
  verifyCinema,
} from 'app/services/cinema';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { Cinema, CinemaQueryDto, CinemaStatus } from 'types/cinema';
import { locationToString } from 'utils/location';

export const AdminCinemaListPage = () => {
  const navigate = useNavigate();

  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const {
    showDialog,
    showRawDialog,
    setDialogLoading,
    isDialogLoading,
    closeDialog,
  } = useGlobalDialogContext();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [query, setQuery] = useState<CinemaQueryDto>(new CinemaQueryDto());
  const [data, setData] = useState<Cinema[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadCinemas = useCallback(() => {
    getCinemas({
      ...query,
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      search: search.length > 0 ? search : undefined,
    }).then(res => {
      setData(res.data.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search, query]);

  useEffect(() => {
    reloadCinemas();
  }, [reloadCinemas]);

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        Cinema Management
      </Typography>

      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          placeholder="Search cinemas"
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
          label="All"
          color={query.status === undefined ? 'primary' : undefined}
          onClick={() => {
            setQuery({
              ...query,
              status: undefined,
            });
          }}
        />
        <Chip
          label="Pending"
          color={query.status === CinemaStatus.Pending ? 'primary' : undefined}
          onClick={() => {
            setQuery({
              ...query,
              status: CinemaStatus.Pending,
            });
          }}
        />
        <Chip
          label="Verified"
          color={query.status === CinemaStatus.Verified ? 'primary' : undefined}
          onClick={() => {
            setQuery({
              ...query,
              status: CinemaStatus.Verified,
            });
          }}
        />
        <Chip
          label="Rejected"
          color={query.status === CinemaStatus.Rejected ? 'primary' : undefined}
          onClick={() => {
            setQuery({
              ...query,
              status: CinemaStatus.Rejected,
            });
          }}
        />
        <Chip
          label="Cancelled"
          color={
            query.status === CinemaStatus.Cancelled ? 'primary' : undefined
          }
          onClick={() => {
            setQuery({
              ...query,
              status: CinemaStatus.Cancelled,
            });
          }}
        />
      </Stack>

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
            field: 'status',
            headerName: 'Status',
            width: 200,
          },

          {
            field: 'isDisabled',
            headerName: 'Is disabled',
            width: 200,
          },
          {
            field: 'description',
            headerName: 'Description',
            width: 500,
          },
          {
            field: 'location',
            headerName: 'Location',
            width: 500,
            valueGetter: params => {
              return locationToString(params.row.location);
            },
          },
          {
            field: 'verifierComment',
            headerName: 'Rejected reason',
            width: 500,
            valueGetter: params => {
              return params.row.status === CinemaStatus.Rejected
                ? params.row.verifierComment
                : null;
            },
          },
          {
            field: 'disabledComment',
            headerName: 'Disable reason',
            width: 500,
            valueGetter: params => {
              return params.row.isDisabled ? params.row.disabledComment : null;
            },
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            width: 200,
            getActions: params => {
              const items: JSX.Element[] = [
                <GridActionsCellItem
                  icon={<RemoveRedEye />}
                  label="View"
                  onClick={() => {
                    navigate(
                      replaceRouteParams(AppRoute.Cinema, {
                        cinemaId: params.id.toString(),
                      }),
                    );
                  }}
                />,
              ];

              if (
                params.row.status === CinemaStatus.Pending ||
                params.row.status === CinemaStatus.Rejected
              ) {
                items.push(
                  <GridActionsCellItem
                    icon={<Check />}
                    label="Verify"
                    onClick={() => {
                      showDialog({
                        title: 'Verify cinema',
                        description: 'Are you sure to verify this cinema?',
                        onConfirm: async () => {
                          setDialogLoading(true);
                          try {
                            await verifyCinema(params.id);
                            showSuccessSnackbar('Verify cinema successfully');
                            reloadCinemas();
                          } catch (error) {
                            showErrorSnackbar(
                              error.response.data.error.details,
                            );
                          }
                        },
                      });
                    }}
                  />,
                );
              }

              if (
                params.row.status === CinemaStatus.Pending ||
                params.row.status === CinemaStatus.Verified
              ) {
                items.push(
                  <GridActionsCellItem
                    icon={<CancelOutlined />}
                    label="Reject"
                    onClick={() => {
                      showRawDialog({
                        title: 'Reject cinema',
                        content: (
                          //<Box sx={{ m: 0 }}>
                          <FormContainer
                            onSuccess={async value => {
                              setDialogLoading(true);
                              try {
                                await rejectCinema(params.id, {
                                  comment: value.comment,
                                });
                                showSuccessSnackbar(
                                  'Reject cinema successfully',
                                );
                                reloadCinemas();
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
                                Are you sure to reject this cinema?
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
                          //</Box>
                        ),
                      });
                    }}
                  />,
                );
              }

              if (params.row.status === CinemaStatus.Verified) {
                if (params.row.isDisabled) {
                  items.push(
                    <GridActionsCellItem
                      icon={<Block color={'error'} />}
                      label="Enable"
                      onClick={() => {
                        showDialog({
                          title: 'Enable cinema',
                          description: 'Are you sure to enable this cinema?',
                          onConfirm: async () => {
                            setDialogLoading(true);
                            try {
                              await enableCinema(params.id);
                              showSuccessSnackbar('Enable cinema successfully');
                              reloadCinemas();
                            } catch (error) {
                              showErrorSnackbar(
                                error.response.data.error.details,
                              );
                            }
                          },
                        });
                      }}
                    />,
                  );
                } else {
                  items.push(
                    <GridActionsCellItem
                      icon={<Block />}
                      label="Disable"
                      onClick={() => {
                        showRawDialog({
                          title: 'Disable cinema',
                          content: (
                            //<Box sx={{ m: 0 }}>
                            <FormContainer
                              onSuccess={async value => {
                                setDialogLoading(true);
                                try {
                                  await disableCinema(params.id, {
                                    comment: value.comment,
                                  });
                                  showSuccessSnackbar(
                                    'Disable cinema successfully',
                                  );
                                  reloadCinemas();
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
                                  Are you sure to reject this cinema?
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
                                <Button
                                  disabled={isDialogLoading}
                                  type="submit"
                                >
                                  Confirm
                                </Button>
                              </DialogActions>
                            </FormContainer>
                            //</Box>
                          ),
                        });
                      }}
                    />,
                  );
                }
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
