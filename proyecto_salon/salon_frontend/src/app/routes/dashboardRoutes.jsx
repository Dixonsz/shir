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
const SettingsPage = lazy(() => import('../../features/settings/SettingsPage'));

export const dashboardRoutes = [
  { index: true, element: <Dashboard />, resource: 'dashboard' },
  { path: 'roles', element: <RolesPage />, resource: 'roles' },
  { path: 'roles/new', element: <RoleFormPage />, resource: 'roles', requiresWrite: true },
  { path: 'roles/edit/:id', element: <RoleFormPage />, resource: 'roles', requiresWrite: true },
  { path: 'members', element: <MembersPage />, resource: 'members' },
  { path: 'members/new', element: <MemberFormPage />, resource: 'members', requiresWrite: true },
  { path: 'members/edit/:id', element: <MemberFormPage />, resource: 'members', requiresWrite: true },
  { path: 'clients', element: <ClientsPage />, resource: 'clients' },
  { path: 'appointments', element: <AppointmentsPage />, resource: 'appointments' },
  { path: 'appointments/:id/service', element: <AppointmentServiceView />, resource: 'appointments', requiresWrite: true },
  { path: 'products', element: <ProductsPage />, resource: 'products' },
  { path: 'category-products', element: <CategoryProductsPage />, resource: 'category_products' },
  { path: 'services', element: <ServicesPage />, resource: 'services' },
  { path: 'category-services', element: <CategoryServicesPage />, resource: 'category_services' },
  { path: 'promotions', element: <PromotionsPage />, resource: 'promotions' },
  { path: 'marketing', element: <MarketingPage />, resource: 'marketing' },
  { path: 'marketing/new', element: <MarketingFormPage />, resource: 'marketing', requiresWrite: true },
  { path: 'marketing/edit/:id', element: <MarketingFormPage />, resource: 'marketing', requiresWrite: true },
  { path: 'gallery', element: <GalleryPage />, resource: 'gallery' },
  { path: 'settings', element: <SettingsPage />, resource: 'settings', requiresWrite: true },
];

