import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  Snackbar,
  Menu,
  MenuItem,
} from '@mui/material';
import { IconCamera, IconEdit, IconShare, IconX } from '@tabler/icons-react';
import {
  supabase,
  uploadAvatar,
  deleteOldAvatar,
  visitedPlaces,
  favoritePlaces,
} from '@api';
import { useAuth } from '@hooks';
import { Screen, PlacesList } from '@modules';
import { VisitedPlace, FavoritePlace } from '@types';
import styles from './styles.module.scss';
import { QRCodeSVG } from 'qrcode.react';

interface ProfileFormData {
  username: string;
  avatarUrl: string | null;
}

interface PublicProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const getInitial = (profile: any) => {
  if (profile?.username) {
    return profile.username[0].toUpperCase();
  }
  if (profile?.email) {
    return profile.email[0].toUpperCase();
  }
  return '';
};

export const Profile = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id?: string }>();
  const isOwnProfile = !paramId;
  const {
    user,
    profile,
    profileLoading: authLoading,
    signOut,
    refreshProfile,
  } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    avatarUrl: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [visitedPlacesList, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  const [favoritePlacesList, setFavoritePlaces] = useState<FavoritePlace[]>([]);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(
    null,
  );
  const [publicProfileLoading, setPublicProfileLoading] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  let longPressTimer: NodeJS.Timeout | null = null;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  const [avatarOrientation, setAvatarOrientation] = useState<
    'landscape' | 'portrait'
  >('landscape');
  const [zoom, setZoom] = useState(false);

  const fetchVisitedPlaces = async (profileId: string) => {
    try {
      const places = await visitedPlaces.getAll(profileId);
      setVisitedPlaces(places);
    } catch (error) {
      console.error('Error fetching visited places:', error);
      setError('Не удалось загрузить посещенные места');
    }
  };

  const fetchFavoritePlaces = async (profileId: string) => {
    try {
      const places = await favoritePlaces.getAll(profileId);
      setFavoritePlaces(places);
    } catch (error) {
      console.error('Error fetching favorite places:', error);
      setError('Не удалось загрузить избранные места');
    }
  };

  useEffect(() => {
    const fetchData = async (profileId: string) => {
      setLoading(true);
      try {
        await Promise.all([
          fetchVisitedPlaces(profileId),
          fetchFavoritePlaces(profileId),
        ]);
      } catch (error) {
        console.error('Error fetching places:', error);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    const profileId = isOwnProfile ? user?.id : paramId;
    if (profileId) {
      fetchData(profileId);
    } else if (!isOwnProfile) {
      setVisitedPlaces([]);
      setFavoritePlaces([]);
      setLoading(false);
    }
  }, [isOwnProfile, user?.id, paramId]);

  const handleUpdateVisitedPlace = async (
    id: string,
    rating: number,
    comment: string,
  ) => {
    if (!user?.id) return;
    try {
      await visitedPlaces.update(id, { rating, comment });
      await fetchVisitedPlaces(user.id);
    } catch (error) {
      console.error('Error updating visited place:', error);
    }
  };

  const handleDeletePlace = async () => {
    if (!user?.id) return;
    try {
      await Promise.all([
        fetchVisitedPlaces(user.id),
        fetchFavoritePlaces(user.id),
      ]);
    } catch (error) {
      console.error('Error refreshing places:', error);
    }
  };

  useEffect(() => {
    if (isOwnProfile && !user && !authLoading) {
      navigate('/auth');
    }
  }, [isOwnProfile, user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        avatarUrl: profile.avatar_url || null,
      });
    }
  }, [profile?.username, profile?.avatar_url]);

  const updateProfile = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!formData.username.trim()) {
        throw new Error('Имя пользователя не может быть пустым');
      }

      const updates = {
        id: user.id,
        username: formData.username.trim(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setIsEditMode(false);
      setSuccess('Профиль успешно обновлен!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(
        error.message === 'Имя пользователя не может быть пустым'
          ? error.message
          : 'Не удалось обновить профиль. Пожалуйста, попробуйте позже.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      setUploading(true);
      setError(null);
      setSuccess(null);

      try {
        if (profile?.avatar_url) {
          await deleteOldAvatar(profile.avatar_url);
        }

        const publicUrl = await uploadAvatar(user.id, file);

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

        await refreshProfile();

        setSuccess('Аватар успешно обновлен!');
      } catch (error: any) {
        let errorMessage =
          'Не удалось обновить аватар. Пожалуйста, попробуйте позже.';
        if (error.message) {
          if (
            error.message.includes('5MB') ||
            error.message.includes('формат')
          ) {
            errorMessage = error.message;
          } else if (error.message.includes('profiles_avatar_url_key')) {
            errorMessage = 'Ошибка базы данных при обновлении аватара.';
          }
        }
        setError(errorMessage);
        console.error('Error updating avatar:', error);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const profileUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/profile/${user?.id}`;
  }, [user?.id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setShowCopiedSnackbar(true);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  useEffect(() => {
    if (!paramId) {
      setPublicProfile(null);
      return;
    }

    let isMounted = true;

    const loadPublicProfile = async () => {
      setPublicProfileLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', paramId)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error('Error loading public profile:', error);
          setPublicProfile(null);
          return;
        }

        setPublicProfile(
          data
            ? {
                id: data.id,
                username: data.username,
                avatar_url: data.avatar_url,
              }
            : null,
        );
      } catch (error) {
        if (isMounted) {
          console.error('Unexpected error loading public profile:', error);
          setPublicProfile(null);
        }
      } finally {
        if (isMounted) {
          setPublicProfileLoading(false);
        }
      }
    };

    loadPublicProfile();

    return () => {
      isMounted = false;
    };
  }, [paramId]);

  // Получаем url аватарки для модального окна
  const avatarUrl = isOwnProfile
    ? profile?.avatar_url
    : publicProfile?.avatar_url;

  // Обработчики для долгого нажатия/правого клика
  const handleAvatarContextMenu = (e: React.MouseEvent) => {
    if (!isOwnProfile) return;
    e.preventDefault();
    setMenuAnchor(e.currentTarget as HTMLElement);
  };
  const handleAvatarMouseDown = (e: React.MouseEvent) => {
    if (!isOwnProfile) return;
    if (e.button !== 0) return;
    longPressTimer = setTimeout(() => {
      setMenuAnchor(e.currentTarget as HTMLElement);
    }, 600);
  };
  const handleAvatarMouseUp = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
  };
  const handleMenuClose = () => setMenuAnchor(null);

  useEffect(() => {
    if (!isAvatarModalOpen || !avatarUrl) return;
    const img = new window.Image();
    img.onload = function () {
      if (img.naturalWidth > img.naturalHeight) {
        setAvatarOrientation('landscape');
      } else {
        setAvatarOrientation('portrait');
      }
    };
    img.src = avatarUrl;
  }, [isAvatarModalOpen, avatarUrl]);

  useEffect(() => {
    if (!isAvatarModalOpen) setZoom(false);
  }, [isAvatarModalOpen]);

  if (paramId && publicProfileLoading) {
    return (
      <Box className={styles.loader}>
        <CircularProgress />
      </Box>
    );
  }

  if (paramId && !publicProfile) {
    return (
      <Box className={styles.error}>
        <Typography>Профиль не найден</Typography>
      </Box>
    );
  }

  const shouldShowLoader = isOwnProfile
    ? authLoading || loading
    : loading;

  if (shouldShowLoader) {
    return (
      <Box className={styles.loader}>
        <CircularProgress />
      </Box>
    );
  }

  if (isOwnProfile && !user) {
    navigate('/auth');
    return null;
  }

  if (isOwnProfile && !profile) {
    return (
      <Box className={styles.error}>
        <Typography>Ошибка загрузки профиля или профиль не найден</Typography>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    );
  }

  const displayName = isOwnProfile
    ? profile?.username || profile?.email || 'Пользователь'
    : publicProfile?.username || 'Путешественник';

  const secondaryText =
    isOwnProfile && profile?.username ? profile?.email ?? null : null;

  return (
    <Screen>
      <Container maxWidth="lg">
        <Box className={styles.profileContainer}>
          <Paper className={styles.userInfo}>
            <Box className={styles.avatarSection}>
              <Box className={styles.avatarWrapper}>
                <Avatar
                  src={avatarUrl || undefined}
                  className={styles.avatar}
                  onClick={() => avatarUrl && setIsAvatarModalOpen(true)}
                  onContextMenu={handleAvatarContextMenu}
                  onMouseDown={handleAvatarMouseDown}
                  onMouseUp={handleAvatarMouseUp}
                  style={{ cursor: avatarUrl ? 'pointer' : 'default' }}
                >
                  {isOwnProfile
                    ? getInitial(profile)
                    : getInitial(publicProfile)}
                </Avatar>
                {isOwnProfile && (
                  <div
                    className={styles.avatarEditArea}
                    onClick={e => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <button
                      className={styles.avatarEditButton}
                      type="button"
                      aria-label="Изменить аватар"
                      tabIndex={-1}
                    >
                      <IconCamera size={20} />
                    </button>
                  </div>
                )}
                {isOwnProfile && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                )}
              </Box>
              <Box className={styles.userDetails}>
                {isOwnProfile && isEditMode ? (
                  <Box className={styles.editForm}>
                    <TextField
                      label="Имя пользователя"
                      value={formData.username}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      size="small"
                      fullWidth
                    />
                    <Box className={styles.editButtons}>
                      <Button
                        variant="contained"
                        onClick={updateProfile}
                        disabled={loading}
                      >
                        Сохранить
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setIsEditMode(false);
                          setFormData(prev => ({
                            ...prev,
                            username: profile.username || '',
                          }));
                        }}
                      >
                        Отмена
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box className={styles.nameSection}>
                      <Typography variant="h5">{displayName}</Typography>
                      {isOwnProfile && (
                        <IconButton
                          size="small"
                          onClick={() => setIsEditMode(true)}
                        >
                          <IconEdit size={20} />
                        </IconButton>
                      )}
                    </Box>
                    {secondaryText && (
                      <Typography variant="body1" color="text.secondary">
                        {secondaryText}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
              {isOwnProfile && (
                <Box className={styles.profileActions}>
                  <Button
                    variant="outlined"
                    startIcon={<IconShare size={20} />}
                    onClick={() => setIsShareDialogOpen(true)}
                    className={styles.profileActionButton}
                  >
                    Поделиться
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    className={`${styles.logoutButton} ${styles.profileActionButton}`}
                    onClick={() => setIsLogoutDialogOpen(true)}
                  >
                    Выйти
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>

          <Paper className={styles.contentSection}>
            {success && isOwnProfile && (
              <Alert severity="success" className={styles.alert}>
                {success}
              </Alert>
            )}
            {error && isOwnProfile && (
              <Alert severity="error" className={styles.alert}>
                {error}
              </Alert>
            )}

            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              className={styles.tabs}
            >
              <Tab label="Посещенные места" />
              <Tab label="Избранное" />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              <PlacesList
                title="Посещенные места"
                places={visitedPlacesList}
                type="visited"
                emptyMessage={
                  isOwnProfile
                    ? 'Вы еще не посетили ни одного места'
                    : 'Пользователь не посещал места'
                }
                onUpdateVisitedPlace={
                  isOwnProfile ? handleUpdateVisitedPlace : undefined
                }
                onDelete={isOwnProfile ? handleDeletePlace : undefined}
                canEdit={isOwnProfile}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <PlacesList
                title="Избранные места"
                places={favoritePlacesList}
                type="favorite"
                emptyMessage={
                  isOwnProfile
                    ? 'У вас пока нет избранных мест'
                    : 'У пользователя пока нет избранных мест'
                }
                onDelete={isOwnProfile ? handleDeletePlace : undefined}
                canEdit={isOwnProfile}
              />
            </TabPanel>
          </Paper>
        </Box>
      </Container>

      {isOwnProfile && (
        <Dialog
          open={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Поделиться профилем</DialogTitle>
          <DialogContent>
            <Box className={styles.shareDialog}>
              <Box className={styles.qrCodeContainer}>
                <QRCodeSVG value={profileUrl} size={200} />
              </Box>
              <Box className={styles.shareOptions}>
                <Button
                  variant="contained"
                  onClick={handleCopyLink}
                  className={styles.shareButton}
                >
                  Скопировать ссылку
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsShareDialogOpen(false)}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      )}

      {isOwnProfile && (
        <Dialog
          open={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
        >
          <DialogTitle>Подтверждение выхода</DialogTitle>
          <DialogContent>
            <Typography>Вы уверены, что хотите выйти из системы?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsLogoutDialogOpen(false)}>Отмена</Button>
            <Button
              onClick={async () => {
                setIsLogoutDialogOpen(false);
                await signOut();
                navigate('/auth');
              }}
              color="error"
            >
              Выйти
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={showCopiedSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowCopiedSnackbar(false)}
        message="Ссылка скопирована в буфер обмена"
      />

      {/* Модальное окно для увеличенного аватара */}
      <Dialog
        open={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        PaperProps={{
          style: {
            background: 'rgba(0,0,0,0.45)',
            boxShadow: 'none',
            width: 'auto',
            maxWidth: 'none',
          },
        }}
      >
        <DialogContent
          className={
            styles.avatarModalContent + (zoom ? ' ' + styles.zoomed : '')
          }
          style={{ padding: 0 }}
        >
          <button
            className={styles.avatarModalClose}
            onClick={() => setIsAvatarModalOpen(false)}
            aria-label="Закрыть"
            type="button"
          >
            <IconX size={24} />
          </button>
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="avatar"
              className={
                styles.avatarModalImage +
                ' ' +
                styles[avatarOrientation] +
                (zoom ? ' ' + styles.zoomed : '')
              }
              onClick={() => setZoom(z => !z)}
              draggable={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Модальное меню для выбора действия */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            setIsAvatarModalOpen(true);
            handleMenuClose();
          }}
        >
          Посмотреть
        </MenuItem>
        <MenuItem
          onClick={() => {
            fileInputRef.current?.click();
            handleMenuClose();
          }}
        >
          Изменить
        </MenuItem>
      </Menu>
    </Screen>
  );
};
