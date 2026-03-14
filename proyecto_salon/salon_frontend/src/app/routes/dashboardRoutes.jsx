import { lazy } from 'react';

const Dashboard = lazy(() => import('../../features/dashboard/Dashboard'));
const RolesPage = lazy(() => import('../../features/roles/RolesPage'));
const RoleFormPage = lazy(() => import('../../features/roles/RoleFormPage'));
const MembersPage = lazy(() => import('../../features/members/MembersPage'));
const MemberFormPage = lazy(() => import('../../features/members/MemberFormPage'));
const ProductsPage = lazy(() => import('../../features/products/ProductsPage'));
const CategoryProductsPage = lazy(() => import('../../features/category-products/CategoryProductsPage'));
const ServicesPage = lazy(() => import('../../features/services/ServicesPage'));
const CategoryServicesPage = lazy(() => import('../../features/category-services/CategoryServicesPage'));
const PromotionsPage = lazy(() => import('../../features/promotions/PromotionsPage'));
const AppointmentsPage = lazy(() => import('../../features/appointments/AppointmentsPage'));
const AppointmentServiceView = lazy(() => import('../../features/appointments/components/AppointmentServiceView'));
const ClientsPage = lazy(() => import('../../features/clients/ClientsPage'));
const MarketingPage = lazy(() => import('../../features/marketing/MarketingPage'));
const MarketingFormPage = lazy(() => import('../../features/marketing/MarketingFormPage'));
const GalleryPage = lazy(() => import('../../features/gallery/GalleryPage'));

export const dashboardRoutes = [
  { index: true, element: <Dashboard /> },
  { path: 'roles', element: <RolesPage /> },
  { path: 'roles/new', element: <RoleFormPage /> },
  { path: 'roles/edit/:id', element: <RoleFormPage /> },
  { path: 'members', element: <MembersPage /> },
  { path: 'members/new', element: <MemberFormPage /> },
  { path: 'members/edit/:id', element: <MemberFormPage /> },
  { path: 'clients', element: <ClientsPage /> },
  { path: 'appointments', element: <AppointmentsPage /> },
  { path: 'appointments/:id/service', element: <AppointmentServiceView /> },
  { path: 'products', element: <ProductsPage /> },
  { path: 'category-products', element: <CategoryProductsPage /> },
  { path: 'services', element: <ServicesPage /> },
  { path: 'category-services', element: <CategoryServicesPage /> },
  { path: 'promotions', element: <PromotionsPage /> },
  { path: 'marketing', element: <MarketingPage /> },
  { path: 'marketing/new', element: <MarketingFormPage /> },
  { path: 'marketing/edit/:id', element: <MarketingFormPage /> },
  { path: 'gallery', element: <GalleryPage /> },
];

