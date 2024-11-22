import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './pages/homepage/homepage/HomePage.jsx';
import './globals.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NavBar from './pages/navbar/NavBar.jsx';
import Footer from './pages/footer/Footer.jsx';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/SignUp/SignUp.jsx';
import Diagnosis from './pages/diagnosis/diagnosis.jsx';

const Layout = () => (
  <>
    <NavBar />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: '/home',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />
      }
    ]
  },
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/diagnose',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Diagnosis />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
