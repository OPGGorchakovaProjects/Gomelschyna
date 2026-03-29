import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Card,
  CardContent,
  CardActionArea,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  CardMedia,
  Modal,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { categoriesListAtom } from '@store';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { MapObject } from '@types';
import { objects as objectsApi } from '@api';
import { Statistics } from '../Statistics';

interface AdminPanelProps {
  onSelectObject: (object: MapObject | null) => void;
  onStatisticsToggle: (isStats: boolean) => void;
  isStatisticsMode: boolean;
  statisticsData: Array<{
    id: string;
    name: string;
    visits: number;
    rating: number;
    category: string;
  }>;
}

const LIST_ITEMS_PER_PAGE_OPTIONS = [4, 6, 8];
const GRID_ITEMS_PER_PAGE_OPTIONS = [4, 6, 8, 10];

type ViewMode = 'list' | 'grid';
type AdminMode = 'list' | 'new' | 'statistics';

const ListView = ({
  objects,
  onSelectObject,
}: {
  objects: MapObject[];
  onSelectObject: (object: MapObject) => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <List>
        {objects.map(object => (
          <ListItem
            key={object.id}
            onClick={() => onSelectObject(object)}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              mb: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              display: 'flex',
              gap: 2,
            }}
          >
            {object.images && object.images.length > 0 && (
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  flexShrink: 0,
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative',
                }}
                onClick={e => {
                  e.stopPropagation();
                  if (object.images && object.images.length > 0) {
                    setSelectedImage(object.images[0]);
                  }
                }}
              >
                <img
                  src={object.images[0]}
                  alt={object.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}
            <ListItemText
              primary={object.name}
              secondary={
                <>
                  {object.location && (
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Расположение: {object.location}
                      </Typography>
                      <br />
                    </>
                  )}
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {object.description.length > 100
                      ? `${object.description.substring(0, 100)}...`
                      : object.description}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 1,
          }}
        >
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImage || ''}
            alt="Full size"
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </Paper>
      </Modal>
    </>
  );
};

const GridView = ({
  objects,
  onSelectObject,
}: {
  objects: MapObject[];
  onSelectObject: (object: MapObject) => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderObjectCard = (object: MapObject) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={() => onSelectObject(object)}>
        {object.images && object.images.length > 0 && (
          <CardMedia
            component="img"
            height="160"
            image={object.images[0]}
            alt={object.name}
            sx={{
              objectFit: 'cover',
            }}
          />
        )}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {object.name}
          </Typography>
          {object.location && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {object.location}
            </Typography>
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: '0.875rem',
              lineHeight: 1.4,
            }}
          >
            {object.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          '& > *': {
            flex: '1 1 calc(50% - 8px)',
            minWidth: '280px',
            maxWidth: 'calc(50% - 8px)',
          },
        }}
      >
        {objects.map(object => (
          <Box key={object.id}>{renderObjectCard(object)}</Box>
        ))}
      </Box>

      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 1,
          }}
        >
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImage || ''}
            alt="Full size"
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </Paper>
      </Modal>
    </>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onSelectObject,
  onStatisticsToggle,
  isStatisticsMode,
  statisticsData,
}) => {
  const categories = useAtomValue(categoriesListAtom);
  const [objects, setObjects] = useState<MapObject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AdminMode>('list');
  const [selectedType, setSelectedType] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    if (selectedType !== '') {
      setLoading(true);
      fetchObjects();
    }
  }, [selectedType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, searchQuery, itemsPerPage]);

  const fetchObjects = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!categories || categories.length === 0 || selectedType === '') {
        console.log('Categories not loaded or selectedType is empty:', {
          categories,
          selectedType,
        });
        setObjects([]);
        return;
      }

      const category = categories.find(cat => cat.id === selectedType);
      if (!category) {
        console.log('Category not found:', { selectedType, categories });
        setObjects([]);
        return;
      }

      console.log('Fetching objects for category:', category.name);

      // Используем API для получения объектов по типу
      const objectsData = await objectsApi.getByType(category.name);

      console.log('Received objects from API:', objectsData.length);

      // Преобразуем данные в нужный формат
      const transformedObjects = objectsData.map((item: any) => {
        console.log('Processing item coordinates:', {
          name: item.name,
          coordinates: item.coordinates,
          coordinatesType: typeof item.coordinates,
          isArray: Array.isArray(item.coordinates),
        });

        // Обрабатываем координаты в зависимости от их формата
        let coordinates;
        if (Array.isArray(item.coordinates)) {
          if (Array.isArray(item.coordinates[0])) {
            // Если координаты в формате массива массивов [[lng, lat], [lng, lat], ...] (полилиния)
            // Берем первую точку как основную координату для маркера
            coordinates = {
              lat: item.coordinates[0][1],
              lng: item.coordinates[0][0],
            };
            // Сохраняем полный путь улицы в дополнительном поле
            item.path = item.coordinates.map((coord: number[]) => ({
              lat: coord[1],
              lng: coord[0],
            }));
          } else {
            // Если координаты в формате массива [lat, lng] (как в API)
            coordinates = {
              lat: item.coordinates[0],
              lng: item.coordinates[1],
            };
          }
        } else if (typeof item.coordinates === 'string') {
          // Если координаты в формате строки "lat, lng"
          const [lat, lng] = item.coordinates
            .split(',')
            .map((coord: string) => parseFloat(coord.trim()));
          coordinates = { lat, lng };
        } else {
          console.error('Invalid coordinates format:', item.coordinates);
          coordinates = { lat: 0, lng: 0 };
        }

        console.log('Processed coordinates:', {
          name: item.name,
          original: item.coordinates,
          processed: coordinates,
        });

        return {
          id: item.id,
          created_at: item.created_at,
          created_by: item.created_by,
          category: item.category,
          name: item.name,
          description: item.description,
          type: category.id.toString(),
          coordinates: [coordinates.lat.toString(), coordinates.lng.toString()],
          location: item.location,
          link: item.link,
          map_marker: item.map_marker,
          images: item.images || [],
          path: item.path,
        };
      });

      console.log('Transformed objects:', transformedObjects.length);
      setObjects(transformedObjects);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching objects from API:', err);
      setObjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredObjects = useMemo(() => {
    return objects.filter(
      object =>
        object.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        object.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [objects, searchQuery]);

  const paginatedObjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredObjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredObjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredObjects.length / itemsPerPage);

  const handleModeChange = (
    event: React.SyntheticEvent,
    newValue: AdminMode,
  ) => {
    if (newValue === 'statistics') {
      onStatisticsToggle(true);
    } else {
      onStatisticsToggle(false);
    }
    setMode(newValue);
    if (newValue === 'new') {
      onSelectObject(null);
    }
  };

  const handleTypeChange = (event: any) => {
    setSelectedType(Number(event.target.value));
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleTypeReset = () => {
    setSelectedType('');
    setSearchQuery('');
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event: any) => {
    setItemsPerPage(event.target.value);
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
      setItemsPerPage(4);
      setCurrentPage(1);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={mode}
          onChange={handleModeChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: { xs: 'auto', md: '160px' },
              padding: { xs: '12px 16px', md: '12px 24px' },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '24px', md: '20px' },
              },
            },
          }}
        >
          <Tab
            label="Список"
            value="list"
            icon={<ListAltIcon />}
            iconPosition="start"
            sx={{
              '& .MuiTab-iconWrapper': {
                marginRight: { xs: 0, md: 1 },
              },
              '& .MuiTypography-root': {
                display: { xs: 'none', md: 'block' },
              },
            }}
          />
          <Tab
            label="Новый объект"
            value="new"
            icon={<AddCircleOutlineIcon />}
            iconPosition="start"
            sx={{
              '& .MuiTab-iconWrapper': {
                marginRight: { xs: 0, md: 1 },
              },
              '& .MuiTypography-root': {
                display: { xs: 'none', md: 'block' },
              },
            }}
          />
          <Tab
            label="Статистика"
            value="statistics"
            icon={<BarChartIcon />}
            iconPosition="start"
            sx={{
              '& .MuiTab-iconWrapper': {
                marginRight: { xs: 0, md: 1 },
              },
              '& .MuiTypography-root': {
                display: { xs: 'none', md: 'block' },
              },
            }}
          />
        </Tabs>
      </Paper>

      {mode === 'list' && !isStatisticsMode && (
        <>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                flexDirection: { xs: 'column', md: 'row' },
                '& .MuiFormControl-root': {
                  minWidth: { xs: '100%', md: 300 },
                },
              }}
            >
              <FormControl>
                <InputLabel id="object-type-label">Тип объекта</InputLabel>
                <Select
                  labelId="object-type-label"
                  value={selectedType}
                  label="Тип объекта"
                  onChange={handleTypeChange}
                  sx={{
                    '& .MuiSelect-select': {
                      color:
                        selectedType === '' ? 'text.secondary' : 'text.primary',
                    },
                  }}
                  endAdornment={
                    selectedType !== '' && (
                      <IconButton
                        size="small"
                        onClick={handleTypeReset}
                        sx={{
                          position: 'absolute',
                          right: 32,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          '&:hover': { backgroundColor: 'transparent' },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Поиск"
                variant="outlined"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или описанию..."
              />
            </Box>
          </Box>

          {selectedType === '' ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
              Выберите тип объекта для отображения списка
            </Typography>
          ) : loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <>
              {viewMode === 'list' ? (
                <ListView
                  objects={paginatedObjects}
                  onSelectObject={onSelectObject}
                />
              ) : (
                <GridView
                  objects={paginatedObjects}
                  onSelectObject={onSelectObject}
                />
              )}

              {filteredObjects.length === 0 ? (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  {searchQuery ? 'Ничего не найдено' : 'Нет объектов'}
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    px: 2,
                  }}
                >
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label="режим отображения"
                    size="small"
                  >
                    <ToggleButton value="list" aria-label="список">
                      <ViewListIcon />
                    </ToggleButton>
                    <ToggleButton value="grid" aria-label="сетка">
                      <ViewModuleIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>

                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />

                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="items-per-page-label">
                      На странице
                    </InputLabel>
                    <Select
                      labelId="items-per-page-label"
                      value={itemsPerPage}
                      label="На странице"
                      onChange={handleItemsPerPageChange}
                      size="small"
                    >
                      {(viewMode === 'list'
                        ? LIST_ITEMS_PER_PAGE_OPTIONS
                        : GRID_ITEMS_PER_PAGE_OPTIONS
                      ).map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </>
          )}
        </>
      )}

      {mode === 'new' && !isStatisticsMode && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            Заполните форму для добавления нового объекта
          </Typography>
        </Box>
      )}

      {isStatisticsMode && (
        <Box sx={{ p: 2 }}>
          <Statistics />
        </Box>
      )}
    </Box>
  );
};
