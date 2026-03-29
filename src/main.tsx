import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getCategoriesAtom } from '@store';
import { AnimatePresence } from 'framer-motion';

import { Home, Information, Map, Profile, AdminPage, AuthPage, AboutPage } from '@pages';
import { AuthProvider } from '@hooks';
import { PageTransition, ProtectedRoute, PublicRoute } from '@components';

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, fetchCategories] = useAtom(getCategoriesAtom);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return <AuthProvider>{children}</AuthProvider>;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/information" element={<Information />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:id" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

const App = () => (
  <AppProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AppProvider>
);

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
