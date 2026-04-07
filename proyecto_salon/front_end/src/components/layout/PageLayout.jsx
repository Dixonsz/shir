import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './PageLayout.css';

function PageLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="page-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen ? (
        <button
          type="button"
          className="page-layout-overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Cerrar menu lateral"
        />
      ) : null}

      <div className="page-layout-content">
        <Navbar onMenuClick={() => setIsSidebarOpen((prevState) => !prevState)} />
        <main className="page-layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PageLayout;

