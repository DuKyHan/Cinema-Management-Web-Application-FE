import { getMyProfile } from 'app/services/profile';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Profile } from 'types/profile';
import { useAuth } from './AuthContext';

export const CurrentProfileContext = createContext<{
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
  refreshCurrentProfile: () => void;
}>({
  currentProfile: null,
  setCurrentProfile: (profile: Profile | null) => {},
  refreshCurrentProfile: () => {},
});

export const CurrentProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  const refreshProfile = useCallback(() => {
    if (accessToken) {
      getMyProfile().then(res => {
        setProfile(res.data.data);
      });
    }
  }, [accessToken]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <CurrentProfileContext.Provider
      value={{
        currentProfile: profile,
        setCurrentProfile: setProfile,
        refreshCurrentProfile: refreshProfile,
      }}
    >
      {children}
    </CurrentProfileContext.Provider>
  );
};

export const useCurrentProfile = () => {
  return useContext(CurrentProfileContext);
};
