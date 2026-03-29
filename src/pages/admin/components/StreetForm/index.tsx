import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
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
import { MapObject } from '@types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface StreetFormProps {
  selectedObject: MapObject | null;
  onChange?: (data: StreetFormData) => void;
}

interface Point {
  lat: number;
  lng: number;
}

export interface StreetFormData {
  name: string;
  description: string;
  location: string;
  link: string;
  coordinates: string[];
  points: Point[];
}

const MapEvents = ({
  onMapClick,
  isEditingMode,
}: {
  onMapClick: (lat: number, lng: number) => void;
  isEditingMode: boolean;
}) => {
  useMapEvents({
    click: e => {
      if (isEditingMode) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const MapMarker = ({
  points,
  selectedPoint,
  onPointSelect,
  onPointMove,
  isEditingMode,
}: {
  points: Point[];
  selectedPoint: number | null;
  onPointSelect: (index: number) => void;
  onPointMove: (index: number, lat: number, lng: number) => void;
  isEditingMode: boolean;
}) => {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);

  return (
    <>
      {points.map((point, index) => (
        <Marker
          key={index}
          position={[point.lat, point.lng]}
          draggable={isEditingMode}
          eventHandlers={{
            click: () => onPointSelect(index),
            dragend: e => {
              const newPos = e.target.getLatLng();
              onPointMove(index, newPos.lat, newPos.lng);
            },
          }}
        />
      ))}
      {points.length > 1 && (
        <Polyline
          positions={points.map(p => [p.lat, p.lng])}
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

export const StreetForm: React.FC<StreetFormProps> = ({
  selectedObject,
  onChange,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [readMoreLink, setReadMoreLink] = useState('');
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);

  useEffect(() => {
    if (selectedObject) {
      console.log('Loading object:', selectedObject);
      setName(selectedObject.name);
      setDescription(selectedObject.description);
      setLocation(selectedObject.location || '');
      setReadMoreLink(selectedObject.link || '');

      // Проверяем наличие path и его формат
      if (selectedObject.path && Array.isArray(selectedObject.path)) {
        console.log('Loading points from path:', selectedObject.path);
        // Убеждаемся, что каждая точка имеет правильный формат
        const formattedPoints = selectedObject.path.map(point => ({
          lat:
            typeof point.lat === 'number' ? point.lat : parseFloat(point.lat),
          lng:
            typeof point.lng === 'number' ? point.lng : parseFloat(point.lng),
        }));
        console.log('Formatted points:', formattedPoints);
        setPoints(formattedPoints);
      } else if (
        selectedObject.coordinates &&
        Array.isArray(selectedObject.coordinates)
      ) {
        // Если нет path, но есть coordinates, преобразуем их в точки
        console.log(
          'Loading points from coordinates:',
          selectedObject.coordinates,
        );
        const formattedPoints = [];
        for (let i = 0; i < selectedObject.coordinates.length; i += 2) {
          if (i + 1 < selectedObject.coordinates.length) {
            formattedPoints.push({
              lat: parseFloat(selectedObject.coordinates[i]),
              lng: parseFloat(selectedObject.coordinates[i + 1]),
            });
          }
        }
        console.log('Formatted points from coordinates:', formattedPoints);
        setPoints(formattedPoints);
      } else {
        console.log('No valid path or coordinates found in object');
        setPoints([]);
      }
    } else {
      setName('');
      setDescription('');
      setLocation('');
      setReadMoreLink('');
      setPoints([]);
    }
    setSelectedPoint(null);
    setIsEditingMode(false);
  }, [selectedObject]);

  // Добавляем эффект для отслеживания изменений точек
  useEffect(() => {
    console.log('Points changed:', points);
  }, [points]);

  const handleMapClick = (lat: number, lng: number) => {
    if (isEditingMode) {
      console.log('Adding new point:', { lat, lng });
      setPoints(prevPoints => {
        const newPoints = [...prevPoints, { lat, lng }];
        console.log('New points array:', newPoints);
        return newPoints;
      });
    }
  };

  const handlePointSelect = (index: number) => {
    console.log('Selected point:', index, points[index]);
    setSelectedPoint(index);
  };

  const handlePointDelete = (index: number) => {
    console.log('Deleting point:', index);
    setPoints(prevPoints => {
      const newPoints = prevPoints.filter((_, i) => i !== index);
      console.log('Points after deletion:', newPoints);
      return newPoints;
    });
    if (selectedPoint === index) {
      setSelectedPoint(null);
    }
  };

  const handlePointMove = (index: number, newLat: number, newLng: number) => {
    console.log('Moving point:', index, { newLat, newLng });
    setPoints(prevPoints => {
      const newPoints = [...prevPoints];
      newPoints[index] = { lat: newLat, lng: newLng };
      console.log('Points after move:', newPoints);
      return newPoints;
    });
  };

  const formattedCoordinates = useMemo(() => {
    return points.flatMap(point => {
      const lat =
        typeof point.lat === 'number' ? point.lat : parseFloat(point.lat);
      const lng =
        typeof point.lng === 'number' ? point.lng : parseFloat(point.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return [];
      }
      return [lat.toFixed(6), lng.toFixed(6)];
    });
  }, [points]);

  useEffect(() => {
    onChange?.({
      name,
      description,
      location,
      link: readMoreLink,
      coordinates: formattedCoordinates,
      points,
    });
  }, [
    name,
    description,
    location,
    readMoreLink,
    formattedCoordinates,
    points,
    onChange,
  ]);

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        label="Название улицы"
        value={name}
        onChange={e => setName(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Описание"
        value={description}
        onChange={e => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={4}
        required
      />
      <TextField
        fullWidth
        label="Расположение"
        value={location}
        onChange={e => setLocation(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Ссылка на подробное описание"
        value={readMoreLink}
        onChange={e => setReadMoreLink(e.target.value)}
        margin="normal"
      />

      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setIsEditingMode(!isEditingMode)}
          startIcon={<AddIcon />}
        >
          {isEditingMode ? 'Завершить редактирование' : 'Редактировать маршрут'}
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          height: 400,
          width: '100%',
          mb: 2,
          position: 'relative',
        }}
      >
        <MapContainer
          center={[52.4345, 31.0044]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents
            onMapClick={handleMapClick}
            isEditingMode={isEditingMode}
          />
          <MapMarker
            points={points}
            selectedPoint={selectedPoint}
            onPointSelect={handlePointSelect}
            onPointMove={handlePointMove}
            isEditingMode={isEditingMode}
          />
        </MapContainer>
      </Paper>

      {points.length > 0 && (
        <List>
          {points.map((point, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Точка ${index + 1}`}
                secondary={`Широта: ${point.lat.toFixed(6)}, Долгота: ${point.lng.toFixed(6)}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handlePointDelete(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
