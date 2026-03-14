import { lazy } from 'react';

const Landing = lazy(() => import('../../features/landing/Landing'));
const LoginPage = lazy(() => import('../../features/auth/LoginPage'));

export const publicRoutes = [
  { path: '/', element: <Landing /> },
  { path: '/login', element: <LoginPage /> },
];

