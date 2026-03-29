import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import {
  IconNavigation,
  IconFlagFilled,
  IconArrowRight,
  IconArrowLeft,
  IconArrowUp,
  IconArrowDown,
  IconArrowRotaryLeft,
  IconArrowRotaryRight,
  IconArrowRoundaboutLeft,
  IconArrowRoundaboutRight,
  IconArrowFork,
  IconArrowMerge,
  IconArrowBearRight,
  IconArrowBearLeft,
  IconCircleArrowRight,
  IconCircleArrowLeft,
  IconRoute,
} from '@tabler/icons-react';
import { MapCoordinates } from '@utils';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { renderToString } from 'react-dom/server';
import React from 'react';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import styles from '../../pages/Map/style.module.scss';

interface RouteInstruction {
  distance: number;
  time: number;
  text: string;
  type: string;
}

interface RouteInfo {
  totalDistance: number;
  totalTime: number;
  instructions: RouteInstruction[];
}

interface RoutingControlProps {
  userLocation: MapCoordinates;
  destination: MapCoordinates;
  onRouteCreated?: () => void;
}

interface RouteInfoPanelProps {
  routeInfo: RouteInfo;
  isOpen: boolean;
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectStep: (index: number) => void;
}

declare module 'leaflet' {
  namespace Routing {
    interface Control extends L.Control {
      addTo(map: L.Map): this;
      remove(): this;
      getContainer(): HTMLElement;
      onAdd(map: L.Map): HTMLElement;
      onRemove(map: L.Map): void;
      getPosition(): L.ControlPosition;
      setPosition(position: L.ControlPosition): this;
      options: any;
    }
    function control(options?: any): Control;
  }
}

const createStartIcon = () => {
  const iconHtml = renderToString(
    <div
      style={{
        background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
        borderRadius: '50%',
        padding: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
      }}
    >
      <IconNavigation size={24} color="white" />
    </div>,
  );

  return new L.DivIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const createEndIcon = () => {
  const iconHtml = renderToString(
    <div
      style={{
        background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        borderRadius: '50%',
        padding: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
      }}
    >
      <IconFlagFilled size={24} color="white" />
    </div>,
  );

  return new L.DivIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const getDirectionIcon = (type: string, text?: string) => {
  switch (type.toLowerCase()) {
    case 'straight':
      return <IconArrowUp size={20} />;
    case 'right':
      return <IconArrowRight size={20} />;
    case 'left':
      return <IconArrowLeft size={20} />;
    case 'slight right':
      return <IconArrowBearRight size={20} />;
    case 'slight left':
      return <IconArrowBearLeft size={20} />;
    case 'sharp right':
      return <IconCircleArrowRight size={20} />;
    case 'sharp left':
      return <IconCircleArrowLeft size={20} />;
    case 'uturn':
    case 'turn around':
      return <IconArrowRotaryRight size={20} />;
    case 'roundabout':
      return <IconArrowRoundaboutRight size={20} />;
    case 'merge':
      return <IconArrowMerge size={20} />;
    case 'fork':
      return <IconArrowFork size={20} />;
    default:
      if (text) {
        const t = text.toLowerCase();
        if (
          t.includes('разворот') ||
          t.includes('uturn') ||
          t.includes('turn around')
        )
          return <IconArrowRotaryRight size={20} />;
        if (t.includes('кольцо') || t.includes('roundabout'))
          return <IconArrowRoundaboutRight size={20} />;
        if (t.includes('правее') || t.includes('right'))
          return <IconArrowRight size={20} />;
        if (t.includes('левее') || t.includes('left'))
          return <IconArrowLeft size={20} />;
        if (
          t.includes('вперёд') ||
          t.includes('прямо') ||
          t.includes('straight')
        )
          return <IconArrowUp size={20} />;
      }
      return <IconRoute size={20} />;
  }
};

const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} м`;
  }
  return `${(meters / 1000).toFixed(1)} км`;
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} ч ${minutes} мин`;
  }
  return `${minutes} мин`;
};

const directionMap: Record<string, string> = {
  west: 'запад',
  east: 'восток',
  north: 'север',
  south: 'юг',
  northwest: 'северо-запад',
  northeast: 'северо-восток',
  southwest: 'юго-запад',
  southeast: 'юго-восток',
};

const translateInstruction = (text: string): string => {
  let t = text;

  t = t.replace(/Continue (straight|right|left)/i, (m, dir) => {
    if (dir.toLowerCase() === 'straight') return 'Продолжайте движение прямо';
    if (dir.toLowerCase() === 'right') return 'Продолжайте движение направо';
    if (dir.toLowerCase() === 'left') return 'Продолжайте движение налево';
    return m;
  });
  t = t.replace(
    /Head (west|east|north|south|northwest|northeast|southwest|southeast)/i,
    (m, dir) => `Двигайтесь на ${directionMap[dir.toLowerCase()]}`,
  );
  t = t.replace(/Keep (right|left)/i, (m, dir) =>
    dir.toLowerCase() === 'right' ? 'Держитесь правее' : 'Держитесь левее',
  );
  t = t.replace(/Turn (right|left)/i, (m, dir) =>
    dir.toLowerCase() === 'right' ? 'Поверните направо' : 'Поверните налево',
  );
  t = t.replace(/Slight (right|left)/i, (m, dir) =>
    dir.toLowerCase() === 'right' ? 'Плавно направо' : 'Плавно налево',
  );
  t = t.replace(/Sharp (right|left)/i, (m, dir) =>
    dir.toLowerCase() === 'right' ? 'Резко направо' : 'Резко налево',
  );
  t = t.replace(/Continue( on| onto)?/i, 'Продолжайте движение');
  t = t.replace(/Turn around/i, 'Развернитесь');
  t = t.replace(/Merge/i, 'Слияние');
  t = t.replace(/Fork/i, 'Развилка');
  t = t.replace(/Roundabout/i, 'На кольце');
  t = t.replace(
    /You have arrived at your destination/i,
    'Вы прибыли в место назначения',
  );
  t = t.replace(
    /You have reached your destination/i,
    'Вы достигли места назначения',
  );
  t = t.replace(/Destination is on the right/i, 'Место назначения справа');
  t = t.replace(/Destination is on the left/i, 'Место назначения слева');

  const wordMap: Record<string, string> = {
    right: 'направо',
    left: 'налево',
    straight: 'прямо',
    onto: 'на',
    and: 'и',
    then: 'затем',
    at: 'на',
    the: '',
    a: '',
    an: '',
    street: 'улицу',
    road: 'дорогу',
    avenue: 'проспект',
    boulevard: 'бульвар',
    lane: 'переулок',
    drive: 'проезд',
    place: 'площадь',
    square: 'площадь',
    circle: 'кольцо',
    highway: 'шоссе',
    freeway: 'автостраду',
    expressway: 'скоростную дорогу',
    bridge: 'мост',
    tunnel: 'тоннель',
    exit: 'съезд',
    entrance: 'въезд',
    ramp: 'съезд',
    overpass: 'эстакаду',
    underpass: 'подземный переход',
    crossing: 'переход',
    intersection: 'перекресток',
    junction: 'развязку',
    'traffic light': 'светофор',
    'stop sign': 'знак стоп',
    'yield sign': 'знак уступить дорогу',
    destination: 'место назначения',
    arrive: 'прибытие',
    arrived: 'прибыли',
    reached: 'достигли',
  };
  Object.entries(wordMap).forEach(([eng, rus]) => {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    t = t.replace(regex, rus);
  });

  t = t.replace(/\s+/g, ' ').replace('движениен', 'движение н').trim();
  t = t.replace('движениен', 'движение н');
  t = t.replace(/движение([а-яё]*)прямо/gi, 'движение прямо');
  t = t.replace(/движение([а-яё]*)направо/gi, 'движение направо');
  t = t.replace(/движение([а-яё]*)налево/gi, 'движение налево');
  if (!t.endsWith('.')) t += '.';

  Object.entries(directionMap).forEach(([eng, rus]) => {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    t = t.replace(regex, rus);
  });

  t = t
    .replace(/[a-zA-Z]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!t.endsWith('.')) t += '.';

  return t;
};

const getDirectionColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'straight':
      return '#43a047';
    case 'right':
    case 'slight right':
    case 'sharp right':
      return '#1976d2';
    case 'left':
    case 'slight left':
    case 'sharp left':
      return '#ff9800';
    case 'uturn':
    case 'turn around':
      return '#d32f2f';
    case 'roundabout':
      return '#8e24aa';
    case 'merge':
      return '#607d8b';
    case 'fork':
      return '#009688';
    default:
      return '#333';
  }
};

const InstructionItem: React.FC<{ instruction: RouteInstruction }> = ({
  instruction,
}) => (
  <div className={styles.routeInstruction}>
    <div
      className={styles.routeInstructionIcon}
      style={{ background: getDirectionColor(instruction.type) }}
    >
      {getDirectionIcon(instruction.type, instruction.text)}
    </div>
    <div className={styles.routeInstructionText}>
      <div className={styles.routeInstructionMain}>{instruction.text}</div>
      <div className={styles.routeInstructionDetails}>
        {formatDistance(instruction.distance)}
      </div>
    </div>
  </div>
);

const RouteInfoPanel: React.FC<RouteInfoPanelProps> = ({
  routeInfo,
  isOpen,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  onSelectStep,
}) => {
  const instructions = routeInfo.instructions;
  const currentInstruction =
    instructions[activeIndex] ?? instructions[instructions.length - 1];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {isOpen && <div className={styles.routeOverlay} onClick={onClose} />}
      <div
        className={`${styles.routePanel} ${
          isOpen ? styles.routePanelOpen : ''
        } ${isMobile ? styles.routePanelMobile : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.routePanelHeader}>
          <div className={styles.routePanelTitle}>
            <IconRoute size={18} />
            <span>Маршрут</span>
          </div>
          <button className={styles.routePanelClose} onClick={onClose}>
            Свернуть
          </button>
        </div>
        <div className={styles.routePanelSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Расстояние</span>
            <span className={styles.value}>
              {formatDistance(routeInfo.totalDistance)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Шагов</span>
            <span className={styles.value}>{instructions.length}</span>
          </div>
        </div>
        {isMobile ? (
          <div className={styles.routeStepControlsMobile}>
            <button
              className={styles.stepNavButton}
              onClick={onPrev}
              disabled={activeIndex === 0}
            >
              <IconArrowLeft size={18} />
              <span>Назад</span>
            </button>
            <span className={styles.routeStepCounterMobile}>
              Шаг {activeIndex + 1} / {instructions.length}
            </span>
            <button
              className={styles.stepNavButton}
              onClick={onNext}
              disabled={activeIndex === instructions.length - 1}
            >
              <span>Далее</span>
              <IconArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className={styles.routeStepControls}>
            <button
              className={styles.stepNavButton}
              onClick={onPrev}
              disabled={activeIndex === 0}
            >
              <IconArrowLeft size={18} />
              <span>Назад</span>
            </button>
            <span className={styles.routeStepCounter}>
              Шаг {activeIndex + 1} из {instructions.length}
            </span>
            <button
              className={styles.stepNavButton}
              onClick={onNext}
              disabled={activeIndex === instructions.length - 1}
            >
              <span>Далее</span>
              <IconArrowRight size={18} />
            </button>
          </div>
        )}
        <div className={styles.routeCurrentStep}>
          <InstructionItem instruction={currentInstruction} />
        </div>
        <div className={styles.routeStepsList}>
          {instructions.map((instruction, index) => (
            <button
              key={index}
              className={`${styles.routeStepButton} ${
                index === activeIndex ? styles.active : ''
              }`}
              onClick={() => onSelectStep(index)}
            >
              <span className={styles.routeStepBadge}>{index + 1}</span>
              <span className={styles.routeStepLabel}>{instruction.text}</span>
              <span className={styles.routeStepDistance}>
                {formatDistance(instruction.distance)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export const createRoute = (
  map: L.Map,
  from: MapCoordinates,
  to: MapCoordinates,
  existingControl?: L.Routing.Control,
) => {
  if (existingControl) {
    map.removeControl(existingControl);
  }

  const control = L.Routing.control({
    waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
    routeWhileDragging: false,
    lineOptions: {
      styles: [{ color: '#2196f3', weight: 4 }],
      extendToWaypoints: true,
      missingRouteTolerance: 0,
    },
    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: false,
    createMarker: function (i: number, waypoint: any) {
      return L.marker(waypoint.latLng, {
        icon: i === 0 ? createStartIcon() : createEndIcon(),
        zIndexOffset: i === 0 ? 1000 : 900,
      });
    },
  }).addTo(map);

  return control;
};

export const getUserLocation = (
  destinationCoords: MapCoordinates,
  setUserLocation: (location: MapCoordinates) => void,
  createRouteCallback: (from: MapCoordinates, to: MapCoordinates) => void,
) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        createRouteCallback(
          { lat: latitude, lng: longitude },
          destinationCoords,
        );
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

export const clearRoute = (
  map: L.Map,
  routingControl: L.Routing.Control | null,
  setRoutingControl: (control: L.Routing.Control | null) => void,
  setUserLocation: (location: MapCoordinates | null) => void,
) => {
  if (routingControl) {
    map.removeControl(routingControl);
    setRoutingControl(null);
    setUserLocation(null);
  }
};

export const RoutingControl = ({
  userLocation,
  destination,
  onRouteCreated,
}: RoutingControlProps) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);

  // ➕ флаг, запоминающий, что пользователь сам свернул панель
  const userClosedRef = useRef(false);

  useEffect(() => {
    if (!userLocation || !destination) {
      console.log('Очищаем routeInfo - нет координат');
      setRouteInfo(null);
      setIsPanelOpen(false); // не трогаем userClosedRef — пользовательский выбор сохраняется
      return;
    }

    if (routingControlRef.current && (routingControlRef.current as any)._map) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    const control = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: '#2196f3', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: (i: number, waypoint: any) => {
        return L.marker(waypoint.latLng, {
          icon: i === 0 ? createStartIcon() : createEndIcon(),
          zIndexOffset: i === 0 ? 1000 : 900,
        });
      },
    }).addTo(map);

    routingControlRef.current = control;

    control.on('routesfound', (e: any) => {
      console.log('routesfound event triggered');
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const route = routes[0];
        const instructions = route.instructions.map((instruction: any) => ({
          distance: instruction.distance,
          time: instruction.time,
          text: translateInstruction(instruction.text),
          type: instruction.type,
        }));

        console.log('Setting routeInfo');
        setRouteInfo({
          totalDistance: route.summary.totalDistance,
          totalTime: route.summary.totalTime,
          instructions,
        });
        setActiveInstructionIndex(0);

        // ✅ не открываем автоматически, если пользователь закрывал вручную
        if (!userClosedRef.current) {
          setIsPanelOpen(true);
        }
      }
    });

    if (onRouteCreated) {
      onRouteCreated();
    }

    return () => {
      if (control && (control as any)._map) {
        map.removeControl(control);
      }
      if (routingControlRef.current === control) {
        routingControlRef.current = null;
      }
    };
  }, [map, userLocation, destination, onRouteCreated]);

  useEffect(() => {
    if (!map) return;

    const disableInteractions = () => {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if ((map as any).tap) {
        (map as any).tap.disable();
      }
      map.touchZoom.disable();
    };

    const enableInteractions = () => {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      if ((map as any).tap) {
        (map as any).tap.enable();
      }
      map.touchZoom.enable();
    };

    if (isPanelOpen) {
      disableInteractions();
    } else {
      enableInteractions();
    }

    return () => {
      enableInteractions();
    };
  }, [map, isPanelOpen]);

  useEffect(() => {
    if (!routeInfo) {
      setActiveInstructionIndex(0);
    }
  }, [routeInfo]);

  if (!routeInfo) {
    return null;
  }

  const handlePrev = () => {
    setActiveInstructionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveInstructionIndex(prev =>
      Math.min(routeInfo.instructions.length - 1, prev + 1),
    );
  };

  return (
    <>
      <RouteInfoPanel
        routeInfo={routeInfo}
        isOpen={isPanelOpen}
        activeIndex={activeInstructionIndex}
        onClose={() => {
          // ⛔️ пользователь закрыл вручную — больше автооткрытия не будет
          userClosedRef.current = true;
          setIsPanelOpen(false);
        }}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelectStep={setActiveInstructionIndex}
      />
      {!isPanelOpen && (
        <button
          type="button"
          className={styles.routePanelToggle}
          onClick={() => {
            // 👆 пользователь явно открыл — разрешим последующие автооткрытия
            userClosedRef.current = false;
            setIsPanelOpen(true);
          }}
        >
          <IconRoute size={18} />
          <span>Маршрут</span>
        </button>
      )}
    </>
  );
};
