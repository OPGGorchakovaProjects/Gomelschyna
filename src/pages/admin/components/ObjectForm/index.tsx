import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useAtomValue } from 'jotai';
import { categoriesListAtom } from '@store';
import { StreetForm, StreetFormData } from '../StreetForm';
import CloseIcon from '@mui/icons-material/Close';
import { ImageUploader } from './ImageUploader';
import { objects, supabase } from '@api';
import { useAuth } from '@hooks';
import { CreateObjectInput, UpdateObjectInput, MapObject } from '@types';

interface ObjectFormProps {
  selectedObject: MapObject | null;
}

const MapEvents = ({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: e => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const fetchLocationFromCoordinates = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'ru',
        },
      },
    );
    const data = await response.json();

    // Формируем адрес из компонентов
    const address = data.address;
    const locationParts = [];

    if (address.city) {
      locationParts.push(address.city);
    } else if (address.town) {
      locationParts.push(address.town);
    } else if (address.village) {
      locationParts.push(address.village);
    }

    if (address.road) {
      locationParts.push(address.road);
    }

    if (address.house_number) {
      locationParts.push(address.house_number);
    }

    return locationParts.join(', ');
  } catch (error) {
    console.error('Error fetching location:', error);
    return '';
  }
};

const fetchCoordinatesFromLocation = async (location: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location,
      )}&limit=1`,
      {
        headers: {
          'Accept-Language': 'ru',
        },
      },
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

const MapMarker = ({
  position,
  path,
}: {
  position: { lat: number; lng: number };
  path?: Array<{ lat: number; lng: number }>;
}) => {
  const map = useMap();

  useEffect(() => {
    if (path && path.length > 0) {
      // Если есть путь, устанавливаем вид на всю линию
      const bounds = L.latLngBounds(path.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Иначе устанавливаем вид на точку
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, path, map]);

  return (
    <>
      <Marker position={[position.lat, position.lng]} />
      {path && path.length > 0 && (
        <Polyline
          positions={path.map(p => [p.lat, p.lng])}
          pathOptions={{
            color: '#FF0000',
            weight: 5,
            opacity: 0.7,
          }}
        />
      )}
    </>
  );
};

// Маппинг русских названий категорий на английские ключи
const CATEGORY_MAPPING: Record<string, string> = {
  'Древние города': 'ancient_cities',
  'Культурные ценности': 'cultural_values',
  Промышленность: 'industry',
  Озёра: 'lakes',
  Монументы: 'monuments',
  Музеи: 'museums',
  Заповедники: 'reserve',
  Реки: 'rivers',
  Улицы: 'streets',
};

// Обратный маппинг для проверки
const REVERSE_CATEGORY_MAPPING: Record<string, string> = {
  ancient_cities: 'Древние города',
  cultural_values: 'Культурные ценности',
  industry: 'Промышленность',
  lakes: 'Озёра',
  monuments: 'Монументы',
  museums: 'Музеи',
  reserve: 'Заповедники',
  rivers: 'Реки',
  streets: 'Улицы',
};

const transliterate = (text: string): string => {
  const rusToLat: { [key: string]: string } = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => rusToLat[char] || char)
    .join('')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

const uploadImageFromUrl = async (
  imageUrl: string,
  category: string,
  index: number,
  map_marker: string,
): Promise<string> => {
  try {
    // Проверяем авторизацию
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Пользователь не авторизован');
    }

    // Получаем расширение файла из URL
    const fileExt = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
    const fileName = `${map_marker}_img_${index}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    // Загружаем изображение по URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки изображения: ${response.statusText}`);
    }
    const blob = await response.blob();

    // Сначала пытаемся удалить существующий файл
    try {
      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (deleteError) {
      }
    } catch (error) {}

    // Создаем уникальное имя файла с временной меткой
    const timestamp = Date.now();
    const uniqueFileName = `${map_marker}_img_${index}_${timestamp}.${fileExt}`;
    const uniqueFilePath = `${category}/${uniqueFileName}`;

    // Загружаем новый файл
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(uniqueFilePath, blob, {
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw new Error(`Ошибка загрузки файла: ${uploadError.message}`);
    }

    // Получаем публичный URL
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(uniqueFilePath);
    if (!data?.publicUrl) {
      throw new Error('Не удалось получить публичный URL');
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image from URL:', error);
    throw error;
  }
};

// Устанавливаем дефолтные иконки для всех маркеров Leaflet
// Это нужно для корректного отображения маркеров, иначе они могут быть невидимы
// (особенно в новых версиях leaflet)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const ObjectForm: React.FC<ObjectFormProps> = ({ selectedObject }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [location, setLocation] = useState('');
  const [readMoreLink, setReadMoreLink] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 52.4242,
    lng: 31.0143,
  });
  const [coordinateInputMethod, setCoordinateInputMethod] = useState<
    'manual' | 'map'
  >('manual');
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [coordinateError, setCoordinateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = useAtomValue(categoriesListAtom);
  const [images, setImages] = useState<string[]>([]);
  const [streetFormData, setStreetFormData] = useState<StreetFormData | null>(
    null,
  );

  const isValidLatitude = (lat: number) => lat >= -90 && lat <= 90;
  const isValidLongitude = (lng: number) => lng >= -180 && lng <= 180;

  // Определяем, является ли объект улицей по текущему типу (английский ключ)
  const isStreet = type === 'streets';

  const handleTypeChange = (newTypeId: string) => {
    setSelectedCategoryId(newTypeId);
    setStreetFormData(null);

    // Находим категорию по ID
    const category = categories.find(cat => cat.id.toString() === newTypeId);
    if (category) {
      // Если это улица, устанавливаем тип 'streets'
      if (category.name === 'Улицы') {
        setType('streets');
      } else {
        // Для других категорий используем маппинг или имя категории
        const mappedType = CATEGORY_MAPPING[category.name] || category.name;
        setType(mappedType);
      }
    }
  };

  const handleTypeReset = () => {
    setType('');
    setSelectedCategoryId('');
    setStreetFormData(null);
  };

  useEffect(() => {
    if (selectedObject) {
      setName(selectedObject.name);
      setDescription(selectedObject.description);
      setLocation(selectedObject.location || '');
      setReadMoreLink(selectedObject.link || '');
      setImages(selectedObject.images || []);

      // Находим категорию по selectedObject.category
      const category = categories.find(
        cat => cat.name === selectedObject.category,
      );

      if (category) {
        // Определяем тип для состояния isStreet
        const objectType =
          category.name === 'Улицы'
            ? 'streets'
            : CATEGORY_MAPPING[category.name] || category.name;
        setType(objectType);
        setSelectedCategoryId(category.id.toString());

        // Если это не улица, по умолчанию ставим выбор на карте
        if (objectType !== 'streets') {
          setCoordinateInputMethod('map');
          setStreetFormData(null);
        } else {
          // Для улиц оставляем ручной ввод по умолчанию, или переключаем на карту если координаты заданы
          setCoordinateInputMethod(
            selectedObject.coordinates?.length > 0 ? 'map' : 'manual',
          );

          const existingPoints = (selectedObject.path || [])
            .map(point => ({
              lat:
                typeof point.lat === 'number'
                  ? point.lat
                  : parseFloat(String(point.lat)),
              lng:
                typeof point.lng === 'number'
                  ? point.lng
                  : parseFloat(String(point.lng)),
            }))
            .filter(point => !Number.isNaN(point.lat) && !Number.isNaN(point.lng));

          let derivedPoints = existingPoints;

          if (
            derivedPoints.length === 0 &&
            Array.isArray(selectedObject.coordinates) &&
            selectedObject.coordinates.length >= 4
          ) {
            const coords = selectedObject.coordinates
              .map(coord => parseFloat(coord))
              .filter(coord => !Number.isNaN(coord));

            const converted: { lat: number; lng: number }[] = [];
            for (let i = 0; i < coords.length; i += 2) {
              if (i + 1 < coords.length) {
                converted.push({ lat: coords[i], lng: coords[i + 1] });
              }
            }
            derivedPoints = converted;
          }

          const coordinatesList = derivedPoints.length
            ? derivedPoints.flatMap(point => [
                point.lat.toString(),
                point.lng.toString(),
              ])
            : Array.isArray(selectedObject.coordinates)
            ? selectedObject.coordinates
            : [];

          setStreetFormData({
            name: selectedObject.name,
            description: selectedObject.description,
            location: selectedObject.location || '',
            link: selectedObject.link || '',
            coordinates: coordinatesList,
            points: derivedPoints,
          });
        }
      } else {
        // Если категория не найдена, устанавливаем тип из объекта напрямую и оставляем ручной ввод координат
        setType(selectedObject.category);
        setCoordinateInputMethod('manual');
        setStreetFormData(null);
      }

      // Обработка координат
      if (selectedObject.coordinates?.length >= 2) {
        const lat = parseFloat(selectedObject.coordinates[0]);
        const lng = parseFloat(selectedObject.coordinates[1]);

        if (!isNaN(lat) && !isNaN(lng)) {
          setCoordinates({ lat, lng });
          setLatInput(lat.toString());
          setLngInput(lng.toString());
        } else {
          setCoordinates({ lat: 52.4242, lng: 31.0143 });
          setLatInput('52.4242');
          setLngInput('31.0143');
        }
      } else {
        setCoordinates({ lat: 52.4242, lng: 31.0143 });
        setLatInput('52.4242');
        setLngInput('31.0143');
      }
      setCoordinateError(null);
    } else if (!selectedObject) {
      // Сброс формы при создании нового объекта
      setName('');
      setDescription('');
      setType('');
      setLocation('');
      setReadMoreLink('');
      setMapLink('');
      setCoordinates({ lat: 52.4242, lng: 31.0143 });
      setLatInput('52.4242');
      setLngInput('31.0143');
      setCoordinateInputMethod('manual');
      setImages([]);
      setCoordinateError(null);
      setStreetFormData(null);
    }
  }, [selectedObject, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setCoordinateError(null);
    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error('Пользователь не авторизован');
      }

      if (!selectedCategoryId) {
        throw new Error('Выберите тип объекта');
      }

      const category = categories.find(
        cat => cat.id.toString() === selectedCategoryId,
      );

      if (!category) {
        throw new Error('Категория не найдена');
      }

      if (isStreet) {
        if (!streetFormData) {
          throw new Error('Пожалуйста, заполните все обязательные поля');
        }

        const streetName = streetFormData.name?.trim();
        const streetDescription = streetFormData.description?.trim();
        const streetLocation = streetFormData.location?.trim();
        const streetLink = streetFormData.link?.trim() || '';
        const streetPoints = streetFormData.points ?? [];
        const streetCoordinates = streetFormData.coordinates ?? [];

        if (
          !streetName ||
          !streetDescription ||
          !streetLocation ||
          streetPoints.length < 2 ||
          streetCoordinates.length < 4 ||
          streetCoordinates.length % 2 !== 0
        ) {
          throw new Error(
            'Для улицы укажите название, описание, расположение и не меньше двух точек на карте',
          );
        }

        const mapMarker = `${transliterate(category.name)}_${transliterate(
          streetName,
        )}`;

        let uploadedImages: string[] = [];
        if (images.length > 0) {
          try {
            uploadedImages = await Promise.all(
              images.map((imageUrl, index) =>
                uploadImageFromUrl(
                  imageUrl,
                  type || 'streets',
                  index + 1,
                  mapMarker,
                ),
              ),
            );
          } catch (error) {
            console.error('Error uploading images:', error);
            throw new Error(
              'Ошибка при загрузке изображений. Пожалуйста, попробуйте еще раз.',
            );
          }
        }

        const streetPayload: CreateObjectInput = {
          created_by: user.id,
          category: category.name,
          name: streetName,
          description: streetDescription,
          location: streetLocation || streetName,
          coordinates: streetCoordinates,
          map_marker: mapMarker,
          link: streetLink || null,
          images: uploadedImages.length > 0 ? uploadedImages : null,
          path: streetPoints,
        };

        if (selectedObject?.id) {
          const objectId =
            typeof selectedObject.id === 'string'
              ? parseInt(selectedObject.id, 10)
              : selectedObject.id;

          if (isNaN(objectId)) {
            await objects.create(streetPayload);
          } else {
            const streetUpdatePayload: UpdateObjectInput = {
              category: category.name,
              name: streetName,
              description: streetDescription,
              location: streetLocation || streetName,
              coordinates: streetCoordinates,
              map_marker: mapMarker,
              link: streetLink || null,
              images: uploadedImages.length > 0 ? uploadedImages : null,
              path: streetPoints,
            };
            await objects.update(objectId, streetUpdatePayload);
          }
        } else {
          await objects.create(streetPayload);
        }
      } else {
        if (!name || !description || !location || !type) {
          throw new Error('Пожалуйста, заполните все обязательные поля');
        }

        const lat = parseFloat(latInput);
        const lng = parseFloat(lngInput);

        if (isNaN(lat) || isNaN(lng)) {
          setCoordinateError(
            'Введите корректные числовые значения широты и долготы',
          );
          throw new Error(
            'Введите корректные числовые значения широты и долготы',
          );
        }

        if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
          const message =
            'Координаты должны быть в диапазоне: широта от -90 до 90, долгота от -180 до 180';
          setCoordinateError(message);
          throw new Error(message);
        }

        setCoordinates({ lat, lng });

        let uploadedImages: string[] = [];
        const mapMarker = `${transliterate(category.name)}_${transliterate(
          name,
        )}`;

        if (images.length > 0) {
          try {
            uploadedImages = await Promise.all(
              images.map((imageUrl, index) =>
                uploadImageFromUrl(imageUrl, type, index + 1, mapMarker),
              ),
            );
          } catch (error) {
            console.error('Error uploading images:', error);
            throw new Error(
              'Ошибка при загрузке изображений. Пожалуйста, попробуйте еще раз.',
            );
          }
        }

        const formattedCoordinates = selectedObject?.path?.length
          ? selectedObject.path
              .map(point => [point.lat.toFixed(6), point.lng.toFixed(6)])
              .flat()
          : [lat.toFixed(6), lng.toFixed(6)];

        const baseFormData = {
          created_by: user.id,
          category: category.name,
          name,
          description,
          location: location || name,
          coordinates: formattedCoordinates,
          map_marker: mapMarker,
          link: readMoreLink || null,
          images: uploadedImages.length > 0 ? uploadedImages : null,
        };

        if (selectedObject?.id) {
          const objectId =
            typeof selectedObject.id === 'string'
              ? parseInt(selectedObject.id, 10)
              : selectedObject.id;

          if (isNaN(objectId)) {
            await objects.create(baseFormData as CreateObjectInput);
          } else {
            await objects.update(objectId, baseFormData as UpdateObjectInput);
          }
        } else {
          await objects.create(baseFormData as CreateObjectInput);
        }
      }

      // Очищаем форму после успешного сохранения
      setName('');
      setDescription('');
      setLocation('');
      setReadMoreLink('');
      setMapLink('');
      setImages([]);
      setSelectedCategoryId('');
      setType('');
      setStreetFormData(null);

      alert(
        selectedObject ? 'Объект успешно обновлен' : 'Объект успешно создан',
      );
    } catch (error) {
      console.error('Error saving object:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при сохранении объекта',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    if (coordinateInputMethod === 'map') {
      if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
        setCoordinateError(
          'Широта должна быть в диапазоне от -90 до 90, долгота — от -180 до 180',
        );
        return;
      }

      setCoordinateError(null);
      setCoordinates({ lat, lng });
      setLatInput(lat.toString());
      setLngInput(lng.toString());

      // Получаем адрес по координатам
      setIsLoadingLocation(true);
      try {
        const newLocation = await fetchLocationFromCoordinates(lat, lng);
        if (newLocation) {
          setLocation(newLocation);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    }
  };

  const handleCoordinateChange = async () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || isNaN(lng)) {
      setCoordinateError(
        'Введите корректные числовые значения широты и долготы',
      );
      return;
    }

    if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
      setCoordinateError(
        'Широта должна быть в диапазоне от -90 до 90, долгота — от -180 до 180',
      );
      return;
    }

    setCoordinateError(null);
    setCoordinates({ lat, lng });

    // Получаем адрес по координатам
    setIsLoadingLocation(true);
    try {
      const newLocation = await fetchLocationFromCoordinates(lat, lng);
      if (newLocation) {
        setLocation(newLocation);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationChange = async (newLocation: string) => {
    setLocation(newLocation);

    // Добавляем небольшую задержку перед поиском координат
    // чтобы не делать запрос при каждом нажатии клавиши
    const timeoutId = setTimeout(async () => {
      if (newLocation.length > 3) {
        // Ищем только если введено достаточно символов
        setIsLoadingLocation(true);
        try {
          const coords = await fetchCoordinatesFromLocation(newLocation);
          if (
            coords &&
            isValidLatitude(coords.lat) &&
            isValidLongitude(coords.lng)
          ) {
            setCoordinateError(null);
            setCoordinates(coords);
            setLatInput(coords.lat.toString());
            setLngInput(coords.lng.toString());
          } else if (coords) {
            setCoordinateError(
              'Широта должна быть в диапазоне от -90 до 90, долгота — от -180 до 180',
            );
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        } finally {
          setIsLoadingLocation(false);
        }
      }
    }, 1000); // Задержка 1 секунда

    return () => clearTimeout(timeoutId);
  };

  // Эффект для автоматического обновления расположения при изменении координат
  useEffect(() => {
    const updateLocationFromCoordinates = async () => {
      if (latInput && lngInput) {
        const lat = parseFloat(latInput);
        const lng = parseFloat(lngInput);
        if (!isNaN(lat) && !isNaN(lng)) {
          if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
            setCoordinateError(
              'Широта должна быть в диапазоне от -90 до 90, долгота — от -180 до 180',
            );
            return;
          }

          setCoordinateError(null);
          setIsLoadingLocation(true);
          try {
            const newLocation = await fetchLocationFromCoordinates(lat, lng);
            if (newLocation) {
              setLocation(newLocation);
            }
          } catch (error) {
            console.error('Error fetching location:', error);
          } finally {
            setIsLoadingLocation(false);
          }
        }
      }
    };

    updateLocationFromCoordinates();
  }, [latInput, lngInput]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        {selectedObject ? 'Редактировать объект' : 'Добавить новый объект'}
      </Typography>

      <FormControl fullWidth required>
        <InputLabel id="type-select-label">Тип объекта</InputLabel>
        <Select
          labelId="type-select-label"
          value={selectedCategoryId}
          label="Тип объекта"
          onChange={e => handleTypeChange(e.target.value)}
          endAdornment={
            selectedCategoryId !== '' && (
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
            <MenuItem key={category.id} value={category.id.toString()}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Условный рендеринг остальной части формы */}
      {isStreet ? (
        // Если это улица, рендерим форму улицы
        <StreetForm
          selectedObject={selectedObject}
          onChange={setStreetFormData}
        />
      ) : (
        // Иначе рендерим стандартные поля ввода и карту
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Название"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Описание"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
          />

          <Box sx={{ position: 'relative' }}>
            <TextField
              label="Расположение"
              value={location}
              onChange={e => handleLocationChange(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isLoadingLocation && (
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                    )}
                  </Box>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Ссылка на подробнее"
              value={readMoreLink}
              onChange={e => setReadMoreLink(e.target.value)}
              fullWidth
            />
          </Box>

          <FormControl component="fieldset">
            <FormLabel component="legend">Способ установки координат</FormLabel>
            <RadioGroup
              value={coordinateInputMethod}
              onChange={e => {
                setCoordinateInputMethod(e.target.value as 'manual' | 'map');
                setCoordinateError(null);
              }}
            >
              <FormControlLabel
                value="manual"
                control={<Radio />}
                label="Ручной ввод"
              />
              <FormControlLabel
                value="map"
                control={<Radio />}
                label="Выбор на карте"
              />
            </RadioGroup>
          </FormControl>

          {coordinateInputMethod === 'manual' ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Широта"
                value={latInput}
                onChange={e => {
                  setLatInput(e.target.value);
                  setCoordinateError(null);
                }}
                onBlur={handleCoordinateChange}
                type="number"
                fullWidth
                required
                error={!!coordinateError}
                helperText={coordinateError || ' '}
                InputProps={{
                  endAdornment: isLoadingLocation && (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  ),
                }}
                inputProps={{ min: -90, max: 90, step: 'any' }}
              />
              <TextField
                label="Долгота"
                value={lngInput}
                onChange={e => {
                  setLngInput(e.target.value);
                  setCoordinateError(null);
                }}
                onBlur={handleCoordinateChange}
                type="number"
                fullWidth
                required
                error={!!coordinateError}
                helperText={coordinateError ? ' ' : undefined}
                InputProps={{
                  endAdornment: isLoadingLocation && (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  ),
                }}
                inputProps={{ min: -180, max: 180, step: 'any' }}
              />
            </Box>
          ) : (
            <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
              <MapContainer
                attributionControl={false}
                center={[coordinates.lat, coordinates.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapMarker position={coordinates} path={selectedObject?.path} />
                <MapEvents onMapClick={handleMapClick} />
              </MapContainer>
            </Box>
          )}
        </Box>
      )}

      <ImageUploader images={images} onImagesChange={setImages} type={type} />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} color="inherit" />
            {selectedObject ? 'Сохранение...' : 'Добавление...'}
          </>
        ) : (
          selectedObject ? 'Сохранить изменения' : 'Добавить объект'
        )}
      </Button>
    </Box>
  );
};
