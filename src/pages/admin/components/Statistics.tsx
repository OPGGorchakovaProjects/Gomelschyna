import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from 'recharts';
import {
  addDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from 'date-fns';
import { useAtomValue, useSetAtom } from 'jotai';
import { objectRatingsAtom, loadAllRatingsAtom } from '@store';
import { useAuth } from '@hooks';
import { visitedPlaces } from '@api';

interface StatisticsData {
  id: string;
  name: string;
  visits: number;
  rating: number;
  category: string;
}

type VisitedPlace = {
  object_id: number | string;
  visited_at: string;
  object?: {
    name?: string;
    category?: string;
  };
};

type ObjectRating = {
  objectId: number;
  averageRating: number;
};

const calculateTopVisitedPlaces = (
  visitedPlaces: VisitedPlace[],
  objectRatings: ObjectRating[],
): StatisticsData[] => {
  const grouped: Record<
    string,
    { count: number; object?: VisitedPlace['object'] }
  > = {};

  visitedPlaces.forEach(place => {
    const id = place.object_id.toString();
    if (!grouped[id]) {
      grouped[id] = { count: 1, object: place.object };
    } else {
      grouped[id].count += 1;
    }
  });

  const result = Object.entries(grouped).map(
    ([objectId, { count, object }]) => {
      const rating = objectRatings.find(r => r.objectId === Number(objectId));
      return {
        id: objectId,
        name: object?.name ?? 'Неизвестное место',
        visits: count,
        rating: rating?.averageRating ?? 0,
        category: object?.category ?? 'Без категории',
      };
    },
  );

  return result.sort((a, b) => b.visits - a.visits);
};

type PeriodType = 'week' | 'month' | 'year' | 'custom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const BAR_COLORS = ['#1976d2', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Маппинг для отображения русских названий категорий
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

const PeriodSelector: React.FC<{
  onPeriodChange: (startDate: Date | null, endDate: Date | null) => void;
}> = ({ onPeriodChange }) => {
  const [period, setPeriod] = useState<PeriodType>('week');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: PeriodType,
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
      const now = new Date();

      switch (newPeriod) {
        case 'week':
          onPeriodChange(startOfDay(addDays(now, -7)), endOfDay(now));
          break;
        case 'month':
          onPeriodChange(startOfDay(addMonths(now, -1)), endOfDay(now));
          break;
        case 'year':
          onPeriodChange(startOfDay(addYears(now, -1)), endOfDay(now));
          break;
        case 'custom':
          onPeriodChange(startDate, endDate);
          break;
      }
    }
  };

  const handleDateChange = (type: 'start' | 'end', value: Date | null) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    if (period === 'custom' && value) {
      onPeriodChange(
        type === 'start' ? value : startDate,
        type === 'end' ? value : endDate,
      );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ToggleButtonGroup
        value={period}
        exclusive
        onChange={handlePeriodChange}
        aria-label="period selection"
        sx={{
          mb: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          '& .MuiToggleButton-root': {
            flex: { xs: '1 1 auto', sm: '0 1 auto' },
            minWidth: { xs: '80px', sm: 'auto' },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            py: { xs: 1, sm: 1.5 },
          },
        }}
      >
        <ToggleButton value="week" aria-label="week">
          Неделя
        </ToggleButton>
        <ToggleButton value="month" aria-label="month">
          Месяц
        </ToggleButton>
        <ToggleButton value="year" aria-label="year">
          Год
        </ToggleButton>
        <ToggleButton value="custom" aria-label="custom">
          Произвольный
        </ToggleButton>
      </ToggleButtonGroup>

      {period === 'custom' && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <DatePicker
              label="Начальная дата"
              value={startDate}
              onChange={newValue => handleDateChange('start', newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DatePicker
              label="Конечная дата"
              value={endDate}
              onChange={newValue => handleDateChange('end', newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                },
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const objectRatings = useAtomValue(objectRatingsAtom);
  const loadAllRatings = useSetAtom(loadAllRatingsAtom);
  const [filteredData, setFilteredData] = useState<StatisticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [allVisitedPlaces, setAllVisitedPlaces] = useState<VisitedPlace[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем все посещенные места без фильтрации по profile_id
        const visitedPlacesData = await visitedPlaces.getAll();
        setAllVisitedPlaces(visitedPlacesData);
        await loadAllRatings();
      } catch (error) {
        console.error('Error loading statistics data:', error);
      }
    };
    loadData();
  }, [loadAllRatings]);

  useEffect(() => {
    if (!allVisitedPlaces.length || !objectRatings.length) return;

    const statisticsData = calculateTopVisitedPlaces(
      allVisitedPlaces,
      objectRatings,
    );
    setFilteredData(statisticsData);
    setLoading(false);
  }, [allVisitedPlaces, objectRatings]);

  const handlePeriodChange = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) {
      const statisticsData = calculateTopVisitedPlaces(
        allVisitedPlaces,
        objectRatings,
      );
      setFilteredData(statisticsData);
      return;
    }

    const filteredVisitedPlaces = allVisitedPlaces.filter(place => {
      const visitedAt = new Date(place.visited_at);
      return isWithinInterval(visitedAt, { start: startDate, end: endDate });
    });

    const filtered = calculateTopVisitedPlaces(
      filteredVisitedPlaces,
      objectRatings,
    );
    setFilteredData(filtered);
  };

  // --- Debug output for visits calculation ---
  useEffect(() => {
    if (allVisitedPlaces.length > 0) {
    }
  }, [allVisitedPlaces]);

  useEffect(() => {
    if (filteredData.length > 0) {
    }
  }, [filteredData]);

  // --- Top visited places calculation ---
  const topVisitedPlaces = [...filteredData]
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5)
    .map(item => ({
      ...item,
      name: item.name,
      category: REVERSE_CATEGORY_MAPPING[item.category] || item.category,
      visits: Number(item.visits),
    }));

  // Debug output for topVisitedPlaces
  useEffect(() => {
    if (topVisitedPlaces.length > 0) {
    }
  }, [topVisitedPlaces]);

  const topRatedPlaces = [...filteredData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map(item => ({
      ...item,
      name: item.name,
      category: REVERSE_CATEGORY_MAPPING[item.category] || item.category,
      rating: Number(item.rating),
    }));

  const categoryData = filteredData.reduce(
    (acc: { name: string; value: number }[], curr) => {
      const categoryName =
        REVERSE_CATEGORY_MAPPING[curr.category] || curr.category;
      const existingCategory = acc.find(item => item.name === categoryName);
      if (existingCategory) {
        existingCategory.value += curr.visits;
      } else {
        acc.push({ name: categoryName, value: curr.visits });
      }
      return acc;
    },
    [],
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
      >
        Статистика посещений
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <PeriodSelector onPeriodChange={handlePeriodChange} />
      </LocalizationProvider>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
          mt: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Paper sx={{ flex: 1, p: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Топ посещаемых мест
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topVisitedPlaces}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 10 }}
                  interval={0}
                  tickMargin={10}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  label={{
                    value: 'Посещения',
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 12,
                  }}
                  domain={[0, (dataMax: number) => dataMax + 1]}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    `${value}`,
                    name === 'visits' ? 'Посещения' : name,
                  ]}
                  labelFormatter={label => `Место: ${label}`}
                  contentStyle={{ fontSize: '0.85rem', padding: '4px 8px' }}
                />
                <Bar dataKey="visits">
                  {topVisitedPlaces.map((entry, index) => (
                    <Cell
                      key={`cell-bar-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                  <LabelList
                    dataKey="visits"
                    position="top"
                    formatter={(v: number) => v}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ flex: 1, p: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Топ по рейтингу
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={topRatedPlaces}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 10 }}
                  interval={0}
                  tickMargin={10}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  label={{
                    value: 'Рейтинг',
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 12,
                  }}
                  domain={[0, 5]}
                  allowDecimals={true}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    `${value}`,
                    name === 'rating' ? 'Рейтинг' : name,
                  ]}
                  labelFormatter={label => `Место: ${label}`}
                  contentStyle={{ fontSize: '0.85rem', padding: '4px 8px' }}
                />
                <Line type="monotone" dataKey="rating" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Paper sx={{ p: { xs: 1, sm: 2 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Распределение по категориям
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: '0.75rem',
                  paddingTop: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export { Statistics };
