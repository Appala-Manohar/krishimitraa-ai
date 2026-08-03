import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import AuthComponent from './routes/auth';

// 1. Root Layout Route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Outlet />
    </div>
  ),
});

// 2. Auth Page Route
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthComponent,
});

// 3. Index/Home Redirect Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/auth' });
  },
});

// 4. Authenticated Dashboard Route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    // Auth Check: Allow entry if token or dummy session is set
    const token = localStorage.getItem('token') || localStorage.getItem('krishimitra_token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!token && !isAuthenticated) {
      throw redirect({ to: '/auth' });
    }
  },
  component: () => {
    const user = JSON.parse(localStorage.getItem('krishimitra_user') || '{"name": "Farmer"}');
    return (
      <div className="min-h-screen p-6 sm:p-10 max-w-7xl mx-auto flex items-center justify-center">
        <div className="w-full bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
          <div className="inline-block bg-emerald-100 dark:bg-emerald-950/60 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold text-2xl">
            🌾 KrishiMitra AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            స్వాగతం, {user.name}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto">
            మీ రైతు ఖాతా విజయవంతంగా లాగిన్ అయింది. మీ పంట వివరాలు మరియు AI విశ్లేషణ సిద్ధంగా ఉన్నాయి.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/auth';
            }}
            className="mt-6 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition"
          >
            లాగ్ అవుట్ (Log Out)
          </button>
        </div>
      </div>
    );
  },
});

// Create Router Schema
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