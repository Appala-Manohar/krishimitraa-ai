import React from 'react';
import { 
  RouterProvider, 
  createRouter, 
  createRoute, 
  createRootRoute, 
  Outlet, 
  redirect 
} from '@tanstack/react-router';

// Component Imports
import AuthComponent from './routes/auth';
import DashboardComponent from './routes/_authenticated/dashboard';

// 1. Root Parent Route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased">
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

// 3. Index Redirect Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const token = localStorage.getItem('token') || localStorage.getItem('krishimitra_token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (token || isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    } else {
      throw redirect({ to: '/auth' });
    }
  },
});

// 4. Authenticated Dashboard Route
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

// Route Tree Schema
const routeTree = rootRoute.addChildren([
  indexRoute, 
  authRoute, 
  dashboardRoute
]);

// Create Router Instance
const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Main App Component
export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}