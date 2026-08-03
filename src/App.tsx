import React from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';

// Auto-generated route tree from TanStack Router CLI
import { routeTree } from './routeTree.gen';

// Create Router with full schema
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}