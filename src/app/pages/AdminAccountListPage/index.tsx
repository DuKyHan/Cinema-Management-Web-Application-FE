import { Block, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useAuth } from 'app/context/AuthContext';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import {
  banAccount,
  GetAccountQueryDto,
  getAccounts,
  unbanAccount,
  updateAccountRole,
} from 'app/services/account';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account } from 'types/account';
import { Role, roles } from 'types/role';

export const AdminAccountListPage = () => {
  const navigate = useNavigate();
  const { account } = useAuth();
  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<Account[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(new GetAccountQueryDto());

  const { showDialog, closeDialog, setDialogLoading } =
    useGlobalDialogContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const onSearchChange = useRef(_.debounce(e => setSearch(e), 1000));

  const reloadAccounts = useCallback(() => {
    getAccounts({
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
    reloadAccounts();
  }, [reloadAccounts]);

  return (
    <>
      <Dialog
        open={isDialogOpen}
        keepMounted
        onClose={() => setIsDialogOpen(false)}
      >
        <LinearProgress sx={{ opacity: isDialogLoading ? 100 : 0 }} />
        <DialogTitle>Edit account role</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure to edit account {selectedAccount?.email}'s role?
          </DialogContentText>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedRole}
              label="Role"
              onChange={e => {
                setSelectedRole(roles.find(r => r === e.target.value) ?? null);
              }}
            >
              {roles.map((r, i) => (
                <MenuItem key={i} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isDialogLoading}
            onClick={() => setIsDialogOpen(false)}
          >
            Close
          </Button>
          <Button
            disabled={
              isDialogLoading || selectedRole === selectedAccount?.roles[0]
            }
            onClick={async () => {
              setIsDialogLoading(true);
              try {
                const res = await updateAccountRole(
                  selectedAccount?.id ?? 0,
                  selectedRole ?? Role.User,
                );
                console.log(res);
                showSuccessSnackbar('Edit account role successfully');
                reloadAccounts();
              } catch (error) {
                console.log(JSON.stringify(error));
                showErrorSnackbar(error.response.data.error.details);
              } finally {
                setIsDialogLoading(false);
                setIsDialogOpen(false);
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant={'h4'} sx={{ my: 3 }}>
        Account Management
      </Typography>

      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search"
          placeholder="Search accounts"
          sx={{ width: '40%' }}
          onChange={e => {
            onSearchChange.current(e.target.value);
          }}
        />
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Typography sx={{ alignSelf: 'center' }}>Filter role:</Typography>
        <Chip
          label="All"
          color={query.role === undefined ? 'primary' : undefined}
          onClick={() => {
            setQuery({
              ...query,
              role: undefined,
            });
          }}
        />
        <Chip
          label="User"
          color={
            query.role?.includes(Role.User) === true ? 'primary' : undefined
          }
          onClick={() => {
            setQuery({
              ...query,
              role: [Role.User],
            });
          }}
        />
        <Chip
          label="Moderator"
          color={
            query.role?.includes(Role.Moderator) === true
              ? 'primary'
              : undefined
          }
          onClick={() => {
            setQuery({
              ...query,
              role: [Role.Moderator],
            });
          }}
        />
        <Chip
          label="Admin"
          color={
            query.role?.includes(Role.Admin) === true ? 'primary' : undefined
          }
          onClick={() => {
            setQuery({
              ...query,
              role: [Role.Admin],
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
            field: 'email',
            headerName: 'Email',
            width: 400,
          },

          {
            field: 'isAccountDisabled',
            headerName: 'Is Banned',
            width: 200,
          },
          {
            field: 'isEmailVerified',
            headerName: 'Is Email Verified',
            width: 200,
          },
          {
            field: 'roles',
            headerName: 'Roles',
            width: 200,
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            getActions: params => {
              const currentAccount = params.row;
              const role = currentAccount.roles[0];

              const items: JSX.Element[] = [];

              if (
                currentAccount.id !== account?.id &&
                params.row.roles[0] !== Role.Admin
              ) {
                items.push(
                  <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => {
                      setSelectedAccount(params.row);
                      setSelectedRole(params.row.roles[0]);
                      setIsDialogOpen(true);
                    }}
                  />,
                );
              }

              if (role !== Role.Admin && currentAccount.id !== account?.id) {
                items.push(
                  <GridActionsCellItem
                    icon={
                      <Block
                        color={
                          currentAccount.isAccountDisabled ? 'error' : undefined
                        }
                      />
                    }
                    label="Ban/Unban"
                    onClick={async () => {
                      showDialog({
                        title: currentAccount.isAccountDisabled
                          ? 'Unban account'
                          : 'Ban account',
                        description: `Are you sure to ${
                          currentAccount.isAccountDisabled ? 'unban' : 'ban'
                        } account ${currentAccount.email}?`,
                        onConfirm: async () => {
                          try {
                            setDialogLoading(true);
                            if (currentAccount.isAccountDisabled) {
                              await unbanAccount(
                                parseInt(params.id.toString()),
                              );
                              showSuccessSnackbar('Unban account successfully');
                            } else {
                              await banAccount(parseInt(params.id.toString()));
                              showSuccessSnackbar('Ban account successfully');
                            }
                            reloadAccounts();
                          } catch (error) {
                            console.log(JSON.stringify(error));
                            showErrorSnackbar(
                              error.response.data.error.details,
                            );
                          } finally {
                            closeDialog();
                          }
                        },
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
        checkboxSelection
      ></DataGrid>
    </>
  );
};
