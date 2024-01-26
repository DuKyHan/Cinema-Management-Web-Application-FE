import { Newspaper } from '@mui/icons-material';
import AdbIcon from '@mui/icons-material/Adb';
import ChatIcon from '@mui/icons-material/Chat';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import MenuIcon from '@mui/icons-material/Menu';
import MovieIcon from '@mui/icons-material/Movie';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import TheatersIcon from '@mui/icons-material/Theaters';
import { Badge } from '@mui/material';
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
import { useAuth } from 'app/context/AuthContext';
import { useCurrentProfile } from 'app/context/ProfileContext';
import { AppRoute } from 'app/routes';
import { countNotifications } from 'app/services/notification';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { NavItem } from './NavItem';
import { NavItemHome } from './NavItemHome';
const pages = ['Accounts', 'Films', 'Cinemas', 'News', 'Report'];
const icons = [
  <SupervisorAccountIcon />,
  <MovieIcon />,
  <TheatersIcon />,
  <Newspaper />,
  <ReportProblemIcon />,
];

const navItems = [
  <NavItem
    key={'accounts'}
    name="Accounts"
    icon={<SupervisorAccountIcon />}
    onClick={navigate => navigate(AppRoute.AdminAccountList)}
  />,
  <NavItem
    key={'films'}
    name="Films"
    icon={<MovieIcon />}
    onClick={navigate => navigate(AppRoute.AdminFilmList)}
  />,
  <NavItem
    key={'cinemas'}
    name="Cinemas"
    icon={<TheatersIcon />}
    onClick={navigate => navigate(AppRoute.AdminCinemaList)}
  />,
  <NavItem
    key={'foods'}
    name="Foods"
    icon={<EmojiFoodBeverageIcon />}
    onClick={navigate => navigate(AppRoute.AdminFoodList)}
  />,
  <NavItem
    key={'news'}
    name="News"
    icon={<Newspaper />}
    onClick={navigate => navigate(AppRoute.AdminNewsList)}
  />,
  <NavItem
    key={'reports'}
    name="Report"
    icon={<ReportProblemIcon />}
    onClick={navigate => navigate(AppRoute.AdminReportList)}
  />,
];

export function NavBarAdmin() {
  const navigate = useNavigate();
  const { accessToken, handleLogout } = useAuth();
  const { currentProfile, setCurrentProfile } = useCurrentProfile();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const [notificationCount, setNotificationCount] = React.useState(0);
  const [unreadChatCount, setUnreadChatCount] = React.useState(0);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
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

  return (
    <AppBar position="static" color="transparent">
      <Box mx={3}>
        <Toolbar disableGutters>
          <NavItemHome />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
              {pages.map(page => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
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

          <Box sx={{ display: { xs: 'flex' } }}>
            {navItems.map(item => item)}
          </Box>

          {/* <Box sx={{ display: { xs: 'flex' } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                startIcon={icons[index]}
                sx={{
                  my: 2,
                  mx: 1,
                  color: '#002D6E',
                  display: 'line',
                  textTransform: 'none',
                  fontWeight: '600',
                }}
              >
                {page}
              </Button>
            ))}
          </Box> */}

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
      </Box>
    </AppBar>
  );
}
