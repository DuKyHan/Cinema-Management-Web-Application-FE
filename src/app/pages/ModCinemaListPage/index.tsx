import { Add, Cancel, Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { ImageSelector } from 'app/components/ImageSelector';
import { Loading } from 'app/components/Loading/Loading';
import { useAuth } from 'app/context/AuthContext';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute, replaceRouteParams } from 'app/routes';
import { cancelCinema, deleteCinema, getCinemas } from 'app/services/cinema';
import {
  createCinemaBrand,
  getMyCinemaBrand,
  updateCinemaBrand,
} from 'app/services/cinema-brand';
import _ from 'lodash';
import { Image } from 'mui-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { Cinema, CinemaStatus } from 'types/cinema';
import { CinemaBrand } from 'types/cinema-brand';
import { getImageUrl, getImageUrlOrDefault } from 'utils/get-image-url';

export const ModCinemaListPage = () => {
  const { account } = useAuth();
  const navigate = useNavigate();
  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const { showDialog, setDialogLoading, closeDialog } =
    useGlobalDialogContext();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<Cinema[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const [cinemaBrand, setCinemaBrand] = useState<CinemaBrand | null>(null);

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [brandName, setBrandName] = useState<string | null>(null);
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const formContext = useForm();
  formContext.watch('name');

  const reloadCinemas = useCallback(() => {
    getCinemas({
      limit: paginationModel.pageSize,
      offset: paginationModel.pageSize * paginationModel.page,
      search: search.length > 0 ? search : undefined,
      ownerId: account?.id,
    }).then(res => {
      setData(res.data.data);
      setIsLoadingData(false);
      setTotal(res.data.meta.total);
    });
  }, [paginationModel, search, account?.id]);

  const reloadCinemaBrand = () => {
    getMyCinemaBrand().then(res => setCinemaBrand(res.data.data));
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsDialogLoading(false);
    setBrandName(null);
    setBrandLogo(null);
    formContext.setValue('name', null);
  };

  useEffect(() => {
    reloadCinemas();
  }, [reloadCinemas]);

  useEffect(() => {
    reloadCinemaBrand();
  }, []);

  if (cinemaBrand == null) {
    return <Loading />;
  }

  const isUpdateCinemaBrand = cinemaBrand != null;
  const isCreateCinemaBrand = cinemaBrand == null;
  const isCreateCinemaBrandValid =
    isCreateCinemaBrand && brandName != null && brandLogo != null;
  const isUpdateCinemaBrandValid =
    isUpdateCinemaBrand && (brandName != null || brandLogo != null);

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        Cinema Management
      </Typography>
      <Stack direction="row" alignItems={'center'} sx={{ mb: 6 }}>
        <Image
          src={getImageUrlOrDefault(cinemaBrand?.logo)}
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
          }}
          wrapperStyle={{
            width: '150px',
            justifyContent: 'start',
            marginRight: '24px',
          }}
        />
        <Typography
          variant="h5"
          fontWeight={'bold'}
          sx={{
            mt: 2,
            textAlign: 'center',
          }}
        >
          {cinemaBrand?.name ?? 'No brand'}
        </Typography>
      </Stack>

      <Dialog
        open={isDialogOpen}
        keepMounted
        onClose={() => {
          handleDialogClose();
        }}
      >
        <FormContainer
          context={formContext}
          defaultValues={cinemaBrand}
          onSuccess={() => {
            setIsDialogLoading(true);
            if (cinemaBrand) {
              updateCinemaBrand(
                cinemaBrand.id,
                {
                  name: brandName ?? cinemaBrand.name,
                  logo: cinemaBrand.logo,
                },
                brandLogo,
              )
                .then(res => {
                  showSuccessSnackbar('Update cinema brand successfully');
                  reloadCinemaBrand();
                })
                .catch(err => {
                  showErrorSnackbar(err.response.data.error.details);
                })
                .finally(() => {
                  handleDialogClose();
                });
            } else {
              createCinemaBrand(
                {
                  name: brandName!,
                },
                brandLogo!,
              )
                .then(res => {
                  showSuccessSnackbar('Create cinema brand successfully');
                  reloadCinemaBrand();
                })
                .catch(err => {
                  showErrorSnackbar(err.response.data.error.details);
                })
                .finally(() => {
                  handleDialogClose();
                });
            }
          }}
        >
          <LinearProgress sx={{ opacity: isDialogLoading ? 100 : 0 }} />
          <DialogTitle>Edit cinema brand</DialogTitle>
          <DialogContent>
            <ImageSelector
              imageStyle={{ width: '150px', height: '150px', opacity: 0.5 }}
              defaultUrl={getImageUrl(cinemaBrand?.logo)}
              onFilePick={file => {
                setBrandLogo(file);
              }}
            />
            <TextFieldElement
              name="name"
              label="Name"
              fullWidth
              sx={{ mt: 2 }}
              onChange={e => {
                return setBrandName(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isDialogLoading}
              onClick={() => {
                handleDialogClose();
              }}
            >
              Close
            </Button>
            <Button
              disabled={
                (isUpdateCinemaBrand && !isUpdateCinemaBrandValid) ||
                (isCreateCinemaBrand && !isCreateCinemaBrandValid) ||
                isDialogLoading
              }
              type="submit"
            >
              Confirm
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          placeholder="Search cinemas"
          sx={{ width: '40%' }}
          onChange={e => {
            onSearchChange.current(e.target.value);
          }}
        />
        <Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => {
              setIsDialogOpen(true);
            }}
            sx={{ mr: 2 }}
          >
            Edit brand
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              navigate(AppRoute.ModCinemaCreate);
            }}
          >
            Add
          </Button>
        </Box>
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
            field: 'description',
            headerName: 'Description',
            width: 400,
          },
          {
            field: 'status',
            headerName: 'Status',
            width: 100,
          },
          {
            field: 'isDisabled',
            headerName: 'Is disabled',
            width: 100,
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            width: 200,
            getActions: params => [
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
              <GridActionsCellItem
                icon={<Edit />}
                label="Edit"
                onClick={() => {
                  navigate(
                    replaceRouteParams(AppRoute.ModCinemaEdit, {
                      cinemaId: params.id.toString(),
                    }),
                  );
                }}
              />,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                disabled={params.row.status !== CinemaStatus.Pending}
                onClick={async () => {
                  showDialog({
                    title: 'Cancel cinema',
                    description: 'Are you sure to cancel this cinema?',
                    onConfirm: async () => {
                      try {
                        setDialogLoading(true);
                        await cancelCinema(parseInt(params.id.toString()));
                        showSuccessSnackbar('Delete cinema successfully');
                        reloadCinemas();
                      } catch (error) {
                        console.log(JSON.stringify(error));
                        showErrorSnackbar(error.response.data.error.details);
                      } finally {
                        setDialogLoading(false);
                        closeDialog();
                      }
                    },
                  });
                }}
              />,
              <GridActionsCellItem
                icon={<Delete />}
                label="Delete"
                onClick={async () => {
                  showDialog({
                    title: 'Delete cinema',
                    description: 'Are you sure to delete this cinema?',
                    onConfirm: async () => {
                      try {
                        setDialogLoading(true);
                        await deleteCinema(parseInt(params.id.toString()));
                        showSuccessSnackbar('Delete cinema successfully');
                        reloadCinemas();
                      } catch (error) {
                        console.log(JSON.stringify(error));
                        showErrorSnackbar(error.response.data.error.details);
                      } finally {
                        setDialogLoading(false);
                        closeDialog();
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
