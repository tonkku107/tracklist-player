import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Store } from './components/Store.jsx';
import Theme from './components/Theme.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Layout from './routes/Layout.jsx';
import './style.css';

const router = createHashRouter([
  {
    path: '/',
    Component: Layout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        lazy: () => import('./routes/App.jsx'),
      },
      {
        path: '/rss/:show',
        lazy: () => import('./routes/Rss.jsx'),
      },
      {
        path: '/queue',
        lazy: () => import('./routes/Queue.jsx'),
        children: [
          {
            path: ':id',
            lazy: () => import('./routes/QueueDetails.jsx'),
          },
        ],
      },
      {
        path: '/player',
        lazy: () => import('./routes/Player.jsx'),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Store>
      <Theme>
        <RouterProvider router={router} />
      </Theme>
    </Store>
  </React.StrictMode>
);
