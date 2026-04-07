import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { dashboardRoutes } from './app/routes/dashboardRoutes';
import { publicRoutes } from './app/routes/publicRoutes';
import ProtectedRoute from './features/auth/ProtectedRoute';
import RoleRoute from './features/auth/RoleRoute';
import PageLayout from './components/layout/PageLayout';

function RouteFallback() {
  return (
    <div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center' }}>
      <span>Cargando modulo...</span>
    </div>
  );
}

function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageLayout />
            </ProtectedRoute>
          }
        >
          {dashboardRoutes.map((route) =>
            route.index ? (
              <Route
                key="dashboard-index"
                index
                element={
                  <RoleRoute resource={route.resource} requiresWrite={route.requiresWrite}>
                    {route.element}
                  </RoleRoute>
                }
              />
            ) : (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RoleRoute resource={route.resource} requiresWrite={route.requiresWrite}>
                    {route.element}
                  </RoleRoute>
                }
              />
            )
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;

