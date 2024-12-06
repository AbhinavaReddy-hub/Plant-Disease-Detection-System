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
import Blog from './pages/Blogs/Blog.jsx';
import NewPost from './pages/Blogs/NewPost.jsx';
import PostDetails from './pages/Blogs/PostDetails.jsx';
import Myblog from "./pages/Blogs/myposts.jsx";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute.jsx";
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

import { useEffect, useState } from "react";
import { useAuthStore } from './pages/store/authStore';

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkUserAuth = async () => {
      await checkAuth();
      setIsAuthChecked(true);
    };
    checkUserAuth();
  }, [checkAuth]);

  if (!isAuthChecked) {
    return <div>Loading...</div>; // Show loading until authentication is checked
  }

  return <RouterProvider router={router} />;
};
const router = createBrowserRouter([
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <HomePage />
      }
    ]
  },
  {
    path: "/blogs",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Blog />
      }
    ]
  },
  {
    path: "/blogs/new",
    element: (
      <ProtectedRoute>
        <NewPost />
      </ProtectedRoute>
    )
  },
  {
    path: "/blogs/:id",
    element: (
      <ProtectedRoute>
        <PostDetails />
      </ProtectedRoute>
    )
  },
  {
    path: "/blogs/my",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Myblog />
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
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Diagnosis />
      }
    ]
  },
  {
    path: '/faq',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Faq />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </StrictMode>
);
