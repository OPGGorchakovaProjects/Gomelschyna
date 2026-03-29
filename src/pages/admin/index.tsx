import { useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Screen } from '@modules';
import { AdminPanel } from './components/AdminPanel';
import { ObjectForm } from './components/ObjectForm';
import { Statistics } from './components/Statistics';
import { MapObject } from '@types';

export const AdminPage = () => {
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
  const [isStatisticsMode, setIsStatisticsMode] = useState(false);

  const handleStatisticsToggle = (isStats: boolean) => {
    setIsStatisticsMode(isStats);
  };

  // Временные данные для демонстрации
  const mockStatisticsData = [
    {
      id: '1',
      name: 'Парк Победы',
      visits: 150,
      rating: 4.5,
      category: 'Парки',
    },
    {
      id: '2',
      name: 'Музей истории',
      visits: 80,
      rating: 4.2,
      category: 'Музеи',
    },
    {
      id: '3',
      name: 'Театр драмы',
      visits: 120,
      rating: 4.8,
      category: 'Театры',
    },
    {
      id: '4',
      name: 'Центральная площадь',
      visits: 200,
      rating: 4.3,
      category: 'Площади',
    },
    {
      id: '5',
      name: 'Художественная галерея',
      visits: 60,
      rating: 4.6,
      category: 'Музеи',
    },
  ];

  return (
    <Screen>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель администратора
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Paper
            sx={{
              flex: isStatisticsMode ? 2 : 1,
              p: 3,
              transition: 'all 0.3s ease-in-out',
              width: '100%',
            }}
          >
            <AdminPanel
              onSelectObject={setSelectedObject}
              onStatisticsToggle={handleStatisticsToggle}
              isStatisticsMode={isStatisticsMode}
              statisticsData={mockStatisticsData}
            />
          </Paper>

          {!isStatisticsMode && (
            <Paper
              sx={{
                flex: 1,
                p: 3,
                transition: 'all 0.3s ease-in-out',
                opacity: isStatisticsMode ? 0 : 1,
                transform: isStatisticsMode
                  ? 'translateX(100%)'
                  : 'translateX(0)',
                display: isStatisticsMode ? 'none' : 'block',
              }}
            >
              <ObjectForm selectedObject={selectedObject} />
            </Paper>
          )}
        </Box>
      </Container>
    </Screen>
  );
};
