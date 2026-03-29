import { useEffect, useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  userAtom,
  profileAtom,
  profileLoadingAtom,
  User,
  UserRole,
} from '@store';
import {
  signIn as apiSignIn,
  signUp as apiSignUp,
  signOut as apiSignOut,
  getProfile as apiGetProfile,
} from '@api';
import { LoadingContainer } from '@components';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatar_url?: string | null;
}

export const getRole = (profile: UserProfile | null): UserRole =>
  profile?.role === 'admin' ? 'admin' : 'user';

const mapSupabaseUser = (
  supabaseUser: SupabaseUser | null,
  role: UserRole = 'user',
): User | null => {
  if (!supabaseUser) return null;
  return {
    ...supabaseUser,
    role,
  };
};

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [profile, setProfile] = useAtom(profileAtom);
  const [profileLoading, setProfileLoading] = useAtom(profileLoadingAtom);

  const isAdmin = useMemo(() => profile?.role === 'admin', [profile?.role]);

  const fetchProfile = useCallback(
    async (userId: string) => {
      if (!userId) {
        setProfileLoading(false);
        return;
      }

      try {
        const { data, error } = await apiGetProfile(userId);
        if (!error && data) {
          const userProfile = data as UserProfile;
          setProfile(userProfile);
          setUser(current =>
            current ? { ...current, role: userProfile.role } : null,
          );
        } else {
          setProfile(null);
        }
      } finally {
        setProfileLoading(false);
      }
    },
    [setUser, setProfile, setProfileLoading],
  );

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      setProfileLoading(true);
      await fetchProfile(user.id);
    } else {
      setProfile(null);
      setProfileLoading(false);
    }
  }, [user?.id, fetchProfile, setProfile, setProfileLoading]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { supabase } = await import('@api');
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          const mappedUser = mapSupabaseUser(session.user);
          setUser(mappedUser);

          // Если профиль уже загружен и соответствует текущему пользователю, не загружаем его снова
          if (profile && profile.id === session.user.id) {
            setProfileLoading(false);
          } else {
            await fetchProfile(session.user.id);
          }
        } else {
          setUser(null);
          setProfile(null);
          setProfileLoading(false);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return;

          if (session?.user) {
            const mappedUser = mapSupabaseUser(session.user);
            setUser(mappedUser);

            // Если профиль уже загружен и соответствует текущему пользователю, не загружаем его снова
            if (profile && profile.id === session.user.id) {
              setProfileLoading(false);
            } else {
              await fetchProfile(session.user.id);
            }
          } else {
            setUser(null);
            setProfile(null);
            setProfileLoading(false);
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setProfileLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [setUser, fetchProfile, profile, setProfile, setProfileLoading]);

  const signIn = async (email: string, password: string) => {
    const { error } = await apiSignIn(email, password);
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await apiSignUp(email, password);
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await apiSignOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
    setProfileLoading(false);
  };

  return {
    user,
    profile,
    profileLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { profileLoading } = useAuth();

  return (
    <LoadingContainer isLoading={profileLoading}>{children}</LoadingContainer>
  );
};
