import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import AuthComponent from './routes/auth';

// Importing your REAL Original Project Dashboard Component
import DashboardComponent from './routes/_authenticated/dashboard';

// 1. Root Layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Outlet />
    </div>
  ),
});

// 2. Auth Route
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthComponent,
});

// 3. Index Route -> Redirects to /auth if not logged in
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('krishimitra_token');
    if (!token) {
      throw redirect({ to: '/auth' });
    } else {
      throw redirect({ to: '/dashboard' });
    }
  },
});

// 4. Authenticated Dashboard Route (Renders your REAL Dashboard Features)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('krishimitra_token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!token && !isAuthenticated) {
      throw redirect({ to: '/auth' });
    }
  },
  component: DashboardComponent,
});

// Build Router Tree
const routeTree = rootRoute.addChildren([indexRoute, authRoute, dashboardRoute]);
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}