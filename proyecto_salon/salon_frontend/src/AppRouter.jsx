import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './features/auth/ProtectedRoute';
import PageLayout from './components/layout/PageLayout';

// Pages
import Dashboard from './features/dashboard/Dashboard';
import RolesPage from './features/roles/RolesPage';
import RoleFormPage from './features/roles/RoleFormPage';
import MembersPage from './features/members/MembersPage';
import MemberFormPage from './features/members/MemberFormPage';
import ProductsPage from './features/products/ProductsPage';
import CategoryProductsPage from './features/category-products/CategoryProductsPage';
import ServicesPage from './features/services/ServicesPage';
import CategoryServicesPage from './features/category-services/CategoryServicesPage';
import PromotionsPage from './features/promotions/PromotionsPage';
import AppointmentsPage from './features/appointments/AppointmentsPage';
import AppointmentServiceView from './features/appointments/AppointmentServiceView';
import ClientsPage from './features/clients/ClientsPage';
import MarketingPage from './features/marketing/MarketingPage';
import MarketingFormPage from './features/marketing/MarketingFormPage';
import GalleryPage from './features/gallery/GalleryPage';
import Landing from './features/landing/Landing';

// Placeholder para página de login
const LoginPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Login Page</h1>
    <p>Implementar formulario de login aquí</p>
  </div>
);

function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas - Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PageLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="roles/new" element={<RoleFormPage />} />
        <Route path="roles/edit/:id" element={<RoleFormPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="members/new" element={<MemberFormPage />} />
        <Route path="members/edit/:id" element={<MemberFormPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointments/:id/service" element={<AppointmentServiceView />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="category-products" element={<CategoryProductsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="category-services" element={<CategoryServicesPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="marketing/new" element={<MarketingFormPage />} />
        <Route path="marketing/edit/:id" element={<MarketingFormPage />} />
        <Route path="gallery" element={<GalleryPage />} />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
