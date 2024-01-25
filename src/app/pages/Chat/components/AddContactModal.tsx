import { Add, Check } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/context/AuthContext';
import { useState } from 'react';
import { Account } from 'types/account';
import { Profile } from 'types/profile';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { getProfileDisplayName } from 'utils/profile';
import { createChat, getAccountByNameOrEmail } from '../services/chat';

class ExtendedAccount extends Account {
  profile: Profile;
}

export const AddContactModal = (props: {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  excludeAccountIds: number[];
}) => {
  const { openModal, setOpenModal } = props;
  const [search, setSearch] = useState('');
  const [foundAccounts, setFoundAccounts] = useState<ExtendedAccount[]>([]);
  const [addedAccountIds, setAddedAccountIds] = useState<number[]>([]);
  const { account } = useAuth();

  return (
    <Modal
      open={openModal}
      onClose={() => {
        setOpenModal(false);
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          width: 800,
          minHeight: 500,
        }}
      >
        <Typography variant="h5">Add contact</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            label="Search contact"
            placeholder="Search by name or email"
            variant="outlined"
            sx={{ my: 3 }}
            onChange={e => {
              setSearch(e.target.value);
            }}
          />
          <Button
            variant="contained"
            sx={{ height: 50 }}
            onClick={() => {
              getAccountByNameOrEmail({
                search: search,
                excludeIds: [...props.excludeAccountIds, account!.id!],
                limit: 5,
              }).then(res => {
                setFoundAccounts(res.data.data);
                console.log(res.data.data);
              });
            }}
          >
            Search
          </Button>
        </Box>
        <List>
          {foundAccounts.map((account, i) => {
            return (
              <ListItem
                key={i}
                alignItems="center"
                secondaryAction={
                  addedAccountIds.includes(account.id) ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Check color={'primary'} />
                      <Typography color={'primary'}>Added</Typography>
                    </Box>
                  ) : (
                    <Button
                      startIcon={<Add />}
                      onClick={() => {
                        setAddedAccountIds([...addedAccountIds, account.id]);
                        createChat(account.id);
                      }}
                    >
                      Add
                    </Button>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar
                    src={getImageUrlOrDefault(account.profile.avatarId)}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={account.email}
                  secondary={getProfileDisplayName(account.profile)}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Modal>
  );
};
