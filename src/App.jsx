import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';

import './App.css';

import Home from './pages/Home';
import QuranText from './pages/QuranText';
import SearchAyah from './pages/SearchAyah';
import TotalSurah from './pages/TotalSurah';

import ErrorPage from './pages/ErrorPage';

// Router Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'QuranText',
        element: <QuranText />
      },
      {
        path: 'SearchAyah',
        element: <SearchAyah />
      },
      {
        path: 'TotalSurah',
        element: <TotalSurah />
      },
    ]
  }
], { basename: '/RreactQuranApp' });

function App() {
  return <RouterProvider router={router} />;
}

export default App;
