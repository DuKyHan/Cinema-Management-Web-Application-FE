import { Cancel, Search } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  DialogActions,
  DialogContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { cancelReport, createReport, getReports } from 'app/services/report';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import {
  getReportQueryIncludes,
  GetReportQuerySort,
  Report,
  ReportStatus,
  ReportType,
  reportTypes,
} from 'types/report';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { getProfileDisplayNameOrDefault } from 'utils/profile';

export const ReportListPage = () => {
  const navigate = useNavigate();

  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const { showDialog, showRawDialog, closeDialog, setDialogLoading } =
    useGlobalDialogContext();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadReports = useCallback(() => {
    getReports({
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      name: search.length > 0 ? search : undefined,
      include: getReportQueryIncludes,
      sort: GetReportQuerySort.updatedAtDesc,
    }).then(res => {
      setData(res.data.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search]);

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
        <Button
          variant="contained"
          onClick={() => {
            showRawDialog({
              title: 'Create report',
              content: (
                <FormContainer
                  defaultValues={{
                    type: ReportType.General,
                  }}
                  onSuccess={async (value: any) => {
                    try {
                      setDialogLoading(true);
                      await createReport({
                        title: value.title,
                        message: {
                          content: value.message,
                        },
                        type: value.type,
                      });
                      showSuccessSnackbar('Create report successfully');
                      reloadReports();
                    } catch (error) {
                      console.log(JSON.stringify(error));
                      showErrorSnackbar(error.response.data.error.details);
                    } finally {
                      closeDialog();
                    }
                  }}
                >
                  <DialogContent>
                    <TextFieldElement
                      fullWidth
                      name="title"
                      label="Title"
                      required
                      sx={{ my: 2 }}
                    />
                    <SelectElement
                      fullWidth
                      name="type"
                      label="Report Type"
                      options={reportTypes.map(type => ({
                        label: type,
                        id: type,
                      }))}
                      required
                      sx={{ my: 2 }}
                    />
                    <TextFieldElement
                      fullWidth
                      name="message"
                      label="Message"
                      multiline
                      rows={5}
                      required
                      sx={{ my: 2 }}
                      inputProps={{ maxLength: 10000 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => closeDialog()}>Cancel</Button>
                    <Button type="submit">Create</Button>
                  </DialogActions>
                </FormContainer>
              ),
            });
          }}
        >
          Create
        </Button>
      </Box>

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
            valueGetter: params => {
              return params.row.messages?.[1]?.content;
            },
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
            getActions: params => [
              <GridActionsCellItem
                disabled={params.row.status !== ReportStatus.Pending}
                icon={<Cancel />}
                label="Cancel"
                onClick={async () => {
                  showDialog({
                    title: 'Cancel report',
                    description: 'Are you sure to cancel this report?',
                    onConfirm: async () => {
                      try {
                        setDialogLoading(true);
                        await cancelReport(parseInt(params.id.toString()));
                        showSuccessSnackbar('Cancel report successfully');
                        reloadReports();
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
      ></DataGrid>
    </>
  );
};
