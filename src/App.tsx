import React, { useState, useEffect } from 'react';
import { GirlfriendGameApp } from './components/GirlfriendGameApp';
import { AdminPasswordGate } from './components/admin/AdminPasswordGate';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    const hash = window.location.hash;
    return (
      path === '/admin' ||
      path === '/admin/' ||
      path.startsWith('/admin') ||
      hash === '#/admin' ||
      hash === '#admin'
    );
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('date_night_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isAdmin =
        path === '/admin' ||
        path === '/admin/' ||
        path.startsWith('/admin') ||
        hash === '#/admin' ||
        hash === '#admin';
      setIsAdminRoute(isAdmin);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('date_night_admin_auth');
    } catch {
      // ignore
    }
    setIsAdminAuthenticated(false);
  };

  // If on /admin route:
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminPasswordGate
          onAuthenticated={() => setIsAdminAuthenticated(true)}
        />
      );
    }
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // Otherwise, render the girlfriend game experience (at /)
  return <GirlfriendGameApp />;
}
