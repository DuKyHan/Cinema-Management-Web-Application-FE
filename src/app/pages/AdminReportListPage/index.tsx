import { CancelOutlined, Check, Search } from '@mui/icons-material';
import {
  Avatar,
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
import { completeReport, getReports, rejectReport } from 'app/services/report';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import {
  GetReportQueryDto,
  getReportQueryIncludes,
  GetReportQuerySort,
  Report,
  ReportStatus,
  reportStatuses,
} from 'types/report';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { getProfileDisplayNameOrDefault } from 'utils/profile';

export const AdminReportListPage = () => {
  const navigate = useNavigate();

  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const {
    showDialog,
    showRawDialog,
    closeDialog,
    setDialogLoading,
    isDialogLoading,
  } = useGlobalDialogContext();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(new GetReportQueryDto());

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadReports = useCallback(() => {
    getReports({
      ...query,
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      name: search.length > 0 ? search : undefined,
      include: getReportQueryIncludes,
      sort: GetReportQuerySort.updatedAtDesc,
    }).then(res => {
      console.log(res.data.data);
      setData(res.data.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search, query]);

  useEffect(() => {
    reloadReports();
  }, [reloadReports]);

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        Report Management
      </Typography>

      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          placeholder="Search reports"
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
        {reportStatuses.map(status => (
          <Chip
            label={status}
            color={
              query.status?.includes(status) === true ? 'primary' : undefined
            }
            onClick={() => {
              setQuery({
                ...query,
                status: [status],
              });
            }}
          />
        ))}
      </Stack>

      <DataGrid
        columns={[
          {
            field: 'title',
            headerName: 'Title',
            width: 300,
          },
          {
            field: 'content',
            headerName: 'Content',
            width: 500,
            valueGetter: params => {
              return params.row.messages?.[0]?.content;
            },
          },
          {
            field: 'type',
            headerName: 'Type',
            width: 100,
          },
          {
            field: 'status',
            headerName: 'Status',
            width: 100,
          },

          {
            field: 'reviewer',
            headerName: 'Reviewer',
            width: 300,
            renderCell: params => {
              if (params.row.reviewer == null) {
                return 'Not reviewed yet';
              }

              const name = getProfileDisplayNameOrDefault(
                params.row.reviewer,
                'Unknown',
              );

              return (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar
                    alt={name}
                    src={getImageUrlOrDefault(params.row.reviewer?.avatarId)}
                    sx={{
                      width: 24,
                      height: 24,
                    }}
                  />
                  <Typography>{name}</Typography>
                </Stack>
              );
            },
          },
          {
            field: 'reviewerMessage',
            headerName: 'Reviewer Message',
            width: 500,
            // valueGetter: params => {
            //   return params.row.messages?.[1]?.content;
            // },
          },
          {
            field: 'createdAt',
            headerName: 'Created Date',
            width: 200,
            valueGetter: params => {
              return dayjs(params.row.createdAt).format('DD/MM/YYYY HH:mm');
            },
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            getActions: params => {
              const items: JSX.Element[] = [];

              if (params.row.status === ReportStatus.Pending) {
                items.push(
                  <GridActionsCellItem
                    icon={<Check />}
                    label="Complete"
                    onClick={() => {
                      showRawDialog({
                        title: 'Complete report',
                        content: (
                          <FormContainer
                            onSuccess={async value => {
                              setDialogLoading(true);
                              try {
                                await completeReport(params.id, {
                                  message: value.comment,
                                });
                                showSuccessSnackbar(
                                  'Complete report successfully',
                                );
                                reloadReports();
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
                                Are you sure to reject this report?
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
                items.push(
                  <GridActionsCellItem
                    icon={<CancelOutlined />}
                    label="Reject"
                    onClick={() => {
                      showRawDialog({
                        title: 'Reject report',
                        content: (
                          <FormContainer
                            onSuccess={async value => {
                              setDialogLoading(true);
                              try {
                                await rejectReport(params.id, {
                                  message: value.comment,
                                });
                                showSuccessSnackbar(
                                  'Reject report successfully',
                                );
                                reloadReports();
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
                                Are you sure to reject this report?
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
      ></DataGrid>
    </>
  );
};
