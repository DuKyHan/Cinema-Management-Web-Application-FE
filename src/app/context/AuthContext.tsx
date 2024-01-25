import { Loading } from 'app/components/Loading/Loading';
import { AppRoute } from 'app/routes';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Account } from 'types/account';
import { rawAxiosInstance } from 'utils/axios';
import { socket } from 'utils/socket';

export const AuthContext = createContext<{
  account?: Account | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  handleLogin: (
    account: { id: number; email: string },
    token: { accessToken: string; refreshToken: string },
    navigateToOrigin?: boolean,
  ) => void;
  handleLogout: () => void;
}>({
  account: null,
  accessToken: null,
  refreshToken: null,
  handleLogin: () => {},
  handleLogout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken'),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('refreshToken'),
  );
  const [account, setAccount] = useState<Account | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (
    account: Account,
    token: {
      accessToken: string;
      refreshToken: string;
    },
    navigateToOrigin: boolean = true,
  ) => {
    const { accessToken, refreshToken } = token;

    setAccount(account);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Connect socket
    socket.connect();

    if (!navigateToOrigin) {
      return;
    }

    const origin = (location.state as any)?.from?.pathname || AppRoute.Home;
    navigate(origin);
  };

  const handleLogout = (options?: { navigateToLoginAfterLogout?: boolean }) => {
    setAccount(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Disconnect socket
    socket.disconnect();

    if (
      options?.navigateToLoginAfterLogout == null ||
      options?.navigateToLoginAfterLogout
    ) {
      navigate(AppRoute.Login);
    }
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      handleLogout({
        navigateToLoginAfterLogout: false,
      });
      return;
    }
    setIsLoading(true);
    rawAxiosInstance
      .post('/auth/refresh-token', {
        refreshToken: refreshToken,
      })
      .then(res => {
        const accessToken = res.data.data.token.accessToken;
        const refreshToken = res.data.data.token.refreshToken;
        const account: Account = res.data.data.account;

        setIsLoading(false);
        handleLogin(account, { accessToken, refreshToken }, false);
      })
      .catch(err => {
        setIsLoading(false);
        handleLogout({
          navigateToLoginAfterLogout: false,
        });
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        account,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
