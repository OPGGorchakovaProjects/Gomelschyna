import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  JSX,
} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import * as L from 'leaflet';
import { NavigationHeader } from '@components';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import styles from './style.module.scss';
import {
  createClusterCustomIcon,
  parseCoordinates,
  MapController,
  ZoomController,
  MarkerWithPopup,
  createRoute as createRouteWithIcons,
  RoutingControl,
} from '@features';
import { MapCoordinates, CategoryKey, MapBounds, calculateStreetCenter } from '@utils';
import type {
  Item,
  Street,
  IMapProps,
  MapObject,
  ExtendedData,
  ExtendedItem,
} from '@types';
import { useAuth } from '@hooks';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import debounce from 'lodash/debounce';
import { objects } from '@api';

// Добавляем маппинг категорий
const categoryMapping: Record<string, CategoryKey> = {
  'Древние города': 'ancient_cities',
  Улицы: 'streets',
  Монументы: 'monuments',
  Музеи: 'museums',
  Заповедники: 'reserve',
  'Культурные ценности': 'cultural_values',
  Промышленность: 'industry',
  Озёра: 'lakes',
  Реки: 'rivers',
  КПХ: "КПХ",
};

const parseStreetCoordinates = (
  coordinates: string[],
): { lat: number; lng: number }[] => {
  const result: { lat: number; lng: number }[] = [];
  for (let i = 0; i < coordinates.length; i += 2) {
    if (i + 1 < coordinates.length) {
      result.push({
        lat: parseFloat(coordinates[i]),
        lng: parseFloat(coordinates[i + 1]),
      });
    }
  }
  return result;
};

export const Map = () => {
  const [data, setData] = useState<ExtendedData | null>(null);
  const [activeCategories, setActiveCategories] = useState<CategoryKey[]>([]);
  const [searchParams] = useSearchParams();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const mapRef = useRef<L.Map>(null);
  // const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const [routingControl, setRoutingControl] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<MapCoordinates | null>(null);
  const [destination, setDestination] = useState<MapCoordinates | null>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [, setCurrentZoom] = useState<number>(8);
  const [, setVisibleMarkers] = useState<Set<string>>(new Set());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const markersCacheRef = useRef<{ [key: string]: JSX.Element }>({});
  const lastActiveCategoriesRef = useRef<CategoryKey[]>([]);
  const lastVisibleMarkersRef = useRef<Set<string>>(new Set());
  const CLUSTERING_ZOOM_THRESHOLD = 13;

  const { user, profileLoading } = useAuth();
  const isAuthenticated = !!user && !profileLoading;

  const handleAuthAction = useCallback(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
  }, [isAuthenticated]);

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthModalConfirm = () => {
    setIsAuthModalOpen(false);
    navigate('/auth');
  };

  const createRoute = (from: MapCoordinates, to: MapCoordinates) => {
    if (mapRef.current) {
      if (routingControl) {
        mapRef.current.removeControl(routingControl);
      }
      const control = createRouteWithIcons(
        mapRef.current,
        from,
        to,
        routingControl,
      );
      setRoutingControl(control);
    }
  };

  const getUserLocation = (destinationCoords: MapCoordinates) => {
    setDestination(destinationCoords);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          createRoute({ lat: latitude, lng: longitude }, destinationCoords);
        },
        error => {
          console.error('Error getting user location:', error);
          alert('Не удалось получить ваше местоположение');
        },
      );
    } else {
      alert('Геолокация не поддерживается вашим браузером');
    }
  };

  const clearRoute = () => {
    if (routingControl && mapRef.current) {
      mapRef.current.removeControl(routingControl);
      setRoutingControl(null);
      setUserLocation(null);
      setDestination(null);
      setRouteInfo(null);
    }
  };

  useEffect(() => {
    const selected = searchParams.get('selected');
    setSelectedMarker(selected);
  }, [searchParams]);

  useEffect(() => {
    const selected = searchParams.get('selected');
    let domain = "https://hello_world";

    // Загружаем реальные объекты с сервера
    console.log('Загрузка объектов с сервера...');
    objects
      .getAll()
      .then(objectsList => {
        const typedObjectsList = objectsList as MapObject[];
        console.log('Получены объекты:', typedObjectsList);
        const categories: Record<string, ExtendedItem[]> = {};
        let matchedCategory: CategoryKey | null = null;
        let matchedMarker: string | null = null;

        typedObjectsList.forEach(obj => {
          // Используем маппинг для преобразования категорий
          const originalCategory = obj.category || 'other';
          const mappedCategory = categoryMapping[originalCategory] || 'other';

          if (!categories[mappedCategory]) categories[mappedCategory] = [];

          // Парсим координаты из строки map_marker
          let lat = 52.4242;
          let lng = 31.014;

          // Если есть координаты в coordintates, используем их
          if (obj.coordinates) {
            if (obj.category === 'Улицы') {
              const streetCoords = parseStreetCoordinates(obj.coordinates);
              const center = calculateStreetCenter(streetCoords);
              categories[mappedCategory].push({
                ...obj,
                coordinates: streetCoords,
                center: [center.lat, center.lng],
                type: mappedCategory,
              } as ExtendedItem);
            } else {
              const lat = parseFloat(obj.coordinates[0]);
              const lng = parseFloat(obj.coordinates[1]);
              categories[mappedCategory].push({
                ...obj,
                coordinates: [{ lat, lng }],
                type: mappedCategory,
              } as ExtendedItem);
            }
          }

          if (
            selected &&
            (obj.map_marker === selected || obj.id?.toString() === selected)
          ) {
            matchedCategory = mappedCategory;
            matchedMarker = obj.map_marker;
          }

          console.log(`Обработка объекта ${obj.name}:`, {
            originalCategory,
            mappedCategory,
            coordinates: [lat, lng],
          });
        });

        console.log('Обработанные категории:', categories);
        setData({ categories });

        // Если есть выбранный объект, активируем его категорию
        if (selected) {
          if (matchedCategory) {
            console.log('Активация выбранной категории:', matchedCategory);
            setActiveCategories([matchedCategory]);
            if (matchedMarker) {
              setSelectedMarker(matchedMarker);
            }
          } else {
            const availableCategories = Object.keys(categories) as CategoryKey[];
            console.log('Категория не найдена, активируем все категории:', availableCategories);
            setActiveCategories(availableCategories);
          }
        }
      })
      .catch((error: Error) => {
        console.error('Ошибка при загрузке объектов:', error);
      });
  }, [searchParams]);

  // Добавляем логирование при изменении активных категорий
  useEffect(() => {
    console.log('Активные категории изменены:', activeCategories);
    console.log('Текущие данные:', data);
  }, [activeCategories, data]);

  const handlePopupOpen = useCallback((item: Item | Street) => {
    if (!mapRef.current) return;

    const coords =
      'center' in item && item.center
        ? item.center
        : Array.isArray(item.coordinates)
          ? item.coordinates[0]
          : parseCoordinates(item.coordinates as string);

    if (!coords) return;

    // Получаем размеры контейнера карты
    const mapContainer = mapRef.current.getContainer();
    const mapRect = mapContainer.getBoundingClientRect();

    // Получаем точку маркера в пикселях
    const markerPoint = mapRef.current.latLngToContainerPoint(coords);

    // Вычисляем смещение для центрирования
    const offsetY = mapRect.height * 0.2; // Смещаем маркер на 20% вверх от центра

    // Создаем новую точку с учетом смещения
    const newPoint = L.point(markerPoint.x, markerPoint.y + offsetY);
    const newCenter = mapRef.current.containerPointToLatLng(newPoint);

    // Устанавливаем новый центр с анимацией
    mapRef.current.setView(newCenter, mapRef.current.getZoom(), {
      animate: true,
      duration: 0.5,
      easeLinearity: 0.25,
    });
  }, []);

  const findItemByMarker = useCallback(
    (identifier: string): ExtendedItem | undefined => {
      if (!data?.categories) return undefined;

      for (const items of Object.values(data.categories)) {
        const found = (items as ExtendedItem[]).find(
          candidate =>
            candidate.map_marker === identifier ||
            (candidate.id && candidate.id.toString() === identifier),
        );
        if (found) {
          return found;
        }
      }

      return undefined;
    },
    [data],
  );

  // Оптимизированная функция обновления кэша маркеров
  const updateMarkersCache = useCallback(
    (category: CategoryKey, items: ExtendedItem[]) => {
      items.forEach(item => {
        const markerKey = `${category}-${item.map_marker}`;
        if (!markersCacheRef.current[markerKey]) {
          markersCacheRef.current[markerKey] = (
            <MarkerWithPopup
              key={markerKey}
              item={item}
              category={category}
              onAuthAction={handleAuthAction}
              onGetRoute={getUserLocation}
              onPopupOpen={handlePopupOpen}
              data={data}
            />
          );
        }
      });
    },
    [handleAuthAction, getUserLocation, handlePopupOpen, data],
  );

  // Оптимизированная функция обновления видимых маркеров
  const updateVisibleMarkers = useCallback(() => {
    if (!mapRef.current) return;

    const newVisibleMarkers = new Set<string>();
    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        const markerId = (layer.options as any)['data-marker-id'];
        if (markerId) {
          newVisibleMarkers.add(markerId);
        }
      }
    });

    // Обновляем состояние только если есть изменения
    if (
      newVisibleMarkers.size !== lastVisibleMarkersRef.current.size ||
      !Array.from(newVisibleMarkers).every(id =>
        lastVisibleMarkersRef.current.has(id),
      )
    ) {
      lastVisibleMarkersRef.current = newVisibleMarkers;
      setVisibleMarkers(newVisibleMarkers);
    }
  }, []);

  // Оптимизированный обработчик событий кластера
  const handleClusterEvent = useCallback(
    debounce((e: any) => {
      if (e.type === 'animationend' || e.type === 'zoomend') {
        updateVisibleMarkers();
      }
    }, 100),
    [updateVisibleMarkers],
  );

  // Оптимизированная функция получения видимых маркеров
  const getVisibleMarkers = useCallback(() => {
    const visibleMarkers: JSX.Element[] = [];
    console.log('Получение видимых маркеров...');

    // Проверяем, изменились ли активные категории
    const categoriesChanged =
      lastActiveCategoriesRef.current.length !== activeCategories.length ||
      !activeCategories.every(cat =>
        lastActiveCategoriesRef.current.includes(cat),
      );

    if (categoriesChanged) {
      console.log('Категории изменились, очищаем кэш маркеров');
      lastActiveCategoriesRef.current = [...activeCategories];
      markersCacheRef.current = {};
    }

    // Добавляем все объекты из активных категорий
    activeCategories.forEach(category => {
      if (!data?.categories[category]) {
        console.log(`Категория ${category} не найдена в данных`);
        return;
      }

      console.log(
        `Обработка категории ${category}:`,
        data.categories[category],
      );

      // Обновляем кэш маркеров для категории
      updateMarkersCache(category, data.categories[category]);

      // Добавляем маркеры из кэша
      data.categories[category].forEach(item => {
        const markerKey = `${category}-${item.map_marker}`;
        if (markersCacheRef.current[markerKey]) {
          visibleMarkers.push(markersCacheRef.current[markerKey]);
        }
      });
    });

    console.log('Создано маркеров:', visibleMarkers.length);
    return visibleMarkers;
  }, [data, activeCategories, updateMarkersCache]);

  const markers = useMemo(() => {
    return getVisibleMarkers();
  }, [getVisibleMarkers]);

  useEffect(() => {
    if (!selectedMarker || !mapRef.current || !data?.categories) {
      return;
    }

    const clusterGroup = clusterGroupRef.current;
    const mapInstance = mapRef.current;
    const targetItem = findItemByMarker(selectedMarker);

    if (!clusterGroup || !targetItem || !targetItem.map_marker) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      let targetMarker: L.Marker | null = null;

      clusterGroup.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          const markerId = (layer.options as any)['data-marker-id'];
          if (markerId === targetItem.map_marker) {
            targetMarker = layer;
          }
        }
      });

      if (!targetMarker) {
        return;
      }

      const openPopup = () => {
        handlePopupOpen(targetItem);
        targetMarker?.openPopup();
        setSelectedMarker(null);
      };

      if ((clusterGroup as any).zoomToShowLayer) {
        clusterGroup.zoomToShowLayer(targetMarker, openPopup);
      } else {
        openPopup();
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [selectedMarker, data, handlePopupOpen, findItemByMarker, markers]);

  // Оптимизированная инициализация кластерной группы
  const initializeClusterGroup = useCallback(() => {
    if (!mapRef.current) return;

    if (clusterGroupRef.current) {
      mapRef.current.removeLayer(clusterGroupRef.current);
    }

    const clusterGroup = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 80,
      animate: true,
      animateAddingMarkers: true,
      disableClusteringAtZoom: CLUSTERING_ZOOM_THRESHOLD,
      spiderLegPolylineOptions: { opacity: 0 },
      spiderfyOnMaxZoom: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: createClusterCustomIcon,
      removeOutsideVisibleBounds: true,
      chunkInterval: 200,
      chunkDelay: 50,
    });

    mapRef.current.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
  }, []);

  // Обработчик изменения зума
  const handleZoomEnd = useCallback(() => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    setCurrentZoom(currentZoom);

    // Контролируем размер попапа
    const popupElement = document.querySelector(
      '.leaflet-popup-content-wrapper',
    );
    if (popupElement) {
      const maxZoom = 13; // Максимальный зум, после которого попап не будет увеличиваться
      const scale = currentZoom > maxZoom ? maxZoom / currentZoom : 1;
      (popupElement as HTMLElement).style.transform = `scale(${scale})`;
    }
  }, []);

  // Инициализация карты
  const handleMapReady = useCallback(() => {
    if (!mapRef.current) return;

    mapRef.current.on('zoomend', handleZoomEnd);
    initializeClusterGroup();
  }, [handleZoomEnd, initializeClusterGroup]);

  const mapProps: IMapProps = {
    ref: mapRef as React.RefObject<L.Map>,
    center: [52.4242, 31.014],
    zoom: 8,
    className: styles.mapContainer,
    attributionControl: false,
    zoomControl: false,
    maxBounds: [
      [49.5, 25.5],
      [55.0, 33.0],
    ] as MapBounds,
    minZoom: 5,
  };

  return (
    <div className={styles.container}>
      <NavigationHeader
        activeCategories={activeCategories}
        setActiveCategories={setActiveCategories}
        hasRoute={!!routingControl}
        onClearRoute={clearRoute}
      />
      <div className={styles.mapWrapper}>
        <MapContainer {...mapProps} whenReady={handleMapReady}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController
            selected={selectedMarker ?? undefined}
            data={data}
            streets={(data?.categories.streets as Street[]) || []}
          />
          <ZoomController onZoomChange={setCurrentZoom} />
          {routingControl && userLocation && destination && (
            <RoutingControl
              userLocation={userLocation}
              destination={destination}
              onRouteCreated={() => {
                if (routingControl) {
                  routingControl.on('routesfound', (e: any) => {
                    const routes = e.routes;
                    if (routes && routes.length > 0) {
                      const route = routes[0];
                      setRouteInfo({
                        totalDistance: route.summary.totalDistance,
                        totalTime: route.summary.totalTime,
                        instructions: route.instructions.map(
                          (instruction: any) => ({
                            distance: instruction.distance,
                            time: instruction.time,
                            text: instruction.text,
                            type: instruction.type,
                          }),
                        ),
                      });
                    }
                  });
                }
              }}
            />
          )}
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            showCoverageOnHover={false}
            maxClusterRadius={80}
            animate={true}
            animateAddingMarkers={true}
            disableClusteringAtZoom={CLUSTERING_ZOOM_THRESHOLD}
            spiderLegPolylineOptions={{ opacity: 0 }}
            spiderfyOnMaxZoom={false}
            zoomToBoundsOnClick={true}
            removeOutsideVisibleBounds={true}
            chunkInterval={200}
            chunkDelay={50}
            eventHandlers={{
              animationend: handleClusterEvent,
              add: handleClusterEvent,
              remove: handleClusterEvent,
              zoomend: handleClusterEvent,
            }}
          >
            {markers}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      <Dialog
        open={isAuthModalOpen}
        onClose={handleAuthModalClose}
        aria-labelledby="auth-dialog-title"
        className={styles.authModal}
      >
        <DialogTitle id="auth-dialog-title">Требуется авторизация</DialogTitle>
        <DialogContent>
          Для доступа к этой функции необходимо войти в систему
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAuthModalClose} color="primary">
            Отмена
          </Button>
          <Button
            onClick={handleAuthModalConfirm}
            color="primary"
            variant="contained"
          >
            Войти
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
