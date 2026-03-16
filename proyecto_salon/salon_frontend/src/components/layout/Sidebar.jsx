import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  User,
  UserCog,
  Calendar,
  Scissors,
  Tag,
  Store,
  Layers,
  Image,
  Megaphone,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth, usePermissions } from '../../features/auth/hooks';
import './Sidebar.css';

function Sidebar() {
  const { user, logout } = useAuth();
  const { canReadResource } = usePermissions();

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();
  const displayName = fullName || user?.name || user?.email || 'Usuario';
  const displayRole = user?.role || 'Miembro';
  const avatarText = (displayName?.[0] || 'U').toUpperCase();

  const mainMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, resource: 'dashboard' },
    { path: '/dashboard/appointments', label: 'Citas', icon: Calendar, resource: 'appointments' },
    { path: '/dashboard/clients', label: 'Clientes', icon: Users, resource: 'clients' },
    { path: '/dashboard/services', label: 'Servicios', icon: Scissors, resource: 'services' },
    { path: '/dashboard/members', label: 'Equipo', icon: User, resource: 'members' },
  ];

  const generalMenuItems = [
    { path: '/dashboard/category-services', label: 'Categoría de Servicios', icon: Layers, resource: 'category_services' },
    { path: '/dashboard/category-products', label: 'Categorías de Productos', icon: Layers, resource: 'category_products' },
    { path: '/dashboard/products', label: 'Productos', icon: Store, resource: 'products' },
    { path: '/dashboard/promotions', label: 'Promociones', icon: Tag, resource: 'promotions' },
    { path: '/dashboard/marketing', label: 'Marketing', icon: Megaphone, resource: 'marketing' },
    { path: '/dashboard/gallery', label: 'Galería', icon: Image, resource: 'gallery' },
    { path: '/dashboard/roles', label: 'Roles', icon: UserCog, resource: 'roles' },
  ];

  const visibleMainMenuItems = mainMenuItems.filter((item) => canReadResource(item.resource));
  const visibleGeneralMenuItems = generalMenuItems.filter((item) => canReadResource(item.resource));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-icon">
          <Sparkles size={24} color="#fff" />
        </div>
        <div>
          <span className="sidebar-logo-text">SHIR SALON</span>
          <p className="sidebar-logo-subtext">Panel Administrativo</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">
          {visibleMainMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                isActive ? 'sidebar-nav-item sidebar-nav-item-active' : 'sidebar-nav-item'
              }
            >
              <item.icon size={20} className="sidebar-nav-icon" />
              <span className="sidebar-nav-text">{item.label}</span>
              {window.location.pathname === item.path && (
                <div className="sidebar-active-indicator"></div>
              )}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-section-divider">
          <p className="sidebar-section-title">GENERAL</p>
        </div>

        <div className="sidebar-nav-section">
          {visibleGeneralMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                isActive ? 'sidebar-nav-item sidebar-nav-item-active' : 'sidebar-nav-item'
              }
            >
              <item.icon size={20} className="sidebar-nav-icon" />
              <span className="sidebar-nav-text">{item.label}</span>
              {window.location.pathname === item.path && (
                <div className="sidebar-active-indicator"></div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-user-footer">
        <div className="sidebar-user-card">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar-container">
              {user?.photo_url ? (
                <img src={user.photo_url} alt={displayName} className="sidebar-avatar" />
              ) : (
                <div className="sidebar-avatar sidebar-avatar-fallback">{avatarText}</div>
              )}
              <div className="sidebar-status-dot"></div>
            </div>
            <div>
              <p className="sidebar-user-name">{displayName}</p>
              <p className="sidebar-user-role">{displayRole}</p>
            </div>
          </div>
          <button className="sidebar-logout-button" onClick={logout} title="Cerrar sesión">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

