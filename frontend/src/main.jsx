import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import NavBar from "./pages/navbar/NavBar.jsx";
import Footer from "./pages/footer/Footer.jsx";
import HomePage from "./pages/homepage/homepage/HomePage.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/SignUp/SignUp.jsx";
import Faq from "./pages/Faq_And_Feedback/Faq.jsx";
import { DarkModeProvider } from "./pages/homepage/homepage/DarkModeContext.jsx"; // Import the provider
import "./globals.css";
import Diagnosis from './pages/diagnosis/diagnosis.jsx';

const Layout = () => (
  <>
    <NavBar />
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1, marginTop: '60px' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
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
  },
  {
    path: '/faq',
    element: <Faq/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </StrictMode>
);
