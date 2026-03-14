import { lazy } from 'react';

const Landing = lazy(() => import('../../features/landing/Landing'));
const LoginPage = lazy(() => import('../../features/auth/LoginPage'));
const PublicAppointmentPage = lazy(() => import('../../features/appointments/PublicAppointmentPage'));

export const publicRoutes = [
  { path: '/', element: <Landing /> },
  { path: '/reservar', element: <PublicAppointmentPage /> },
  { path: '/login', element: <LoginPage /> },
];

