import { Movie, NavigateNext, Newspaper } from '@mui/icons-material';
import AdbIcon from '@mui/icons-material/Adb';
import ChatIcon from '@mui/icons-material/Chat';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SearchIcon from '@mui/icons-material/Search';
import { Badge, InputAdornment, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { AuthContext, useAuth } from 'app/context/AuthContext';
import { useCurrentProfile } from 'app/context/ProfileContext';
import { AppRoute } from 'app/routes';
import { countUnreadChats } from 'app/services/chat';
import { countNotifications } from 'app/services/notification';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { NavItem } from './NavItem';

const navItems = [
  <NavItem
    key={'films'}
    name="Films"
    icon={<Movie />}
    onClick={navigate => navigate(AppRoute.FilmList)}
  />,
  <NavItem
    key={'news'}
    name="News"
    icon={<Newspaper />}
    onClick={navigate => {
      navigate(AppRoute.NewsList);
    }}
  />,
  <NavItem
    key={'tickets'}
    name="Tickets"
    icon={<ConfirmationNumberIcon />}
    onClick={navigate => {
      navigate(AppRoute.TicketList);
    }}
  />,
  <NavItem
    key={'reports'}
    name="Report"
    icon={<ReportProblemIcon />}
    onClick={navigate => {
      navigate(AppRoute.Reports);
    }}
  />,
];

export function NavBarUser() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();
  const { currentProfile, setCurrentProfile } = useCurrentProfile();
  const [search, setSearch] = useState('');

  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    let invalid = true;
    const func = async () => {
      if (!invalid) return;
      try {
        const response = await countNotifications({
          read: false,
        });
        const count = response.data.data._count;
        setNotificationCount(count);
      } catch (error) {
        console.log(error);
      }
    };

    const intervalCall = setInterval(func, 30 * 1000);
    const timeoutCall = setTimeout(func, 5000);

    return () => {
      invalid = false;
      if (intervalCall) {
        clearInterval(intervalCall);
      }
      if (timeoutCall) {
        clearTimeout(timeoutCall);
      }
    };
  }, []);

  useEffect(() => {
    let invalid = true;
    const func = async () => {
      if (!invalid) return;
      try {
        const response = await countUnreadChats();
        const count = response.data.data;
        setUnreadChatCount(count);
      } catch (error) {
        console.log(error);
      }
    };

    //const timeoutCall = setTimeout(func, 5000);
    const intervalCall = setInterval(func, 5000);

    return () => {
      invalid = false;
      if (intervalCall) {
        clearInterval(intervalCall);
      }
      // if (timeoutCall) {
      //   clearTimeout(timeoutCall);
      // }
    };
  }, []);

  return (
    <AuthContext.Consumer>
      {({ handleLogout }) => (
        <AppBar position="static" color="transparent">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Link
                to={AppRoute.Home}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'black',
                }}
              >
                <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  CINEMA WEB
                </Typography>
              </Link>

              {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {navItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick(navigate);
                        }
                      }}
                    >
                      <Typography textAlign="center">{item.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box> */}
              <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              {location.pathname !== AppRoute.FilmList ? (
                <TextField
                  size="small"
                  id="outlined-multiline-flexible"
                  placeholder="Search films..."
                  maxRows={1}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setSearch('');
                            navigate(AppRoute.FilmList, { state: { search } });
                          }}
                        >
                          <NavigateNext />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: '400px',
                    mr: 2,
                  }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              ) : null}

              <Box sx={{ display: { xs: 'flex' } }}>
                {navItems.map(item => item)}
              </Box>

              <IconButton
                sx={{ color: '#002D6E' }}
                onClick={() => {
                  navigate(AppRoute.Chat);
                }}
              >
                <Badge badgeContent={unreadChatCount} color="error">
                  <ChatIcon />
                </Badge>
              </IconButton>

              <IconButton
                sx={{ color: '#002D6E', mr: 1 }}
                onClick={() => {
                  navigate(AppRoute.Notification);
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={getImageUrlOrDefault(currentProfile?.avatarId)}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    key={'profile'}
                    onClick={() => {
                      navigate(AppRoute.Profile);
                    }}
                  >
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  {accessToken != null ? (
                    <MenuItem
                      key={'logout'}
                      onClick={() => {
                        handleLogout();
                        setCurrentProfile(null);
                      }}
                    >
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={'login'}
                      onClick={() => {
                        navigate(AppRoute.Login);
                      }}
                    >
                      <Typography textAlign="center">Login</Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </AuthContext.Consumer>
  );
}
