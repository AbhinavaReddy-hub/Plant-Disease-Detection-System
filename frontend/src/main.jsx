import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import NavBar from "./components/navbar/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./components/homepage/HomePage.jsx";
import Login from "./components/login_signup/Login.jsx";
import Signup from "./components/login_signup/SignUp.jsx";
import Faq from "./components/faq_feedback/Faq.jsx";
import { DarkModeProvider } from "./components/DarkModeContext.jsx"; // Import the provider
import "./globals.css";
import SendHistory from "./components/History/SendHistory.jsx";
import Diagnosis from './components/Diagnosis.jsx';
import Blog from './components/Blogs/Blog.jsx';
import NewBlog from './components/Blogs/NewBlog.jsx';
import BlogDetails from './components/Blogs/BlogDetails.jsx';
import MyBlogs from "./components/Blogs/MyBlogs.jsx";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword.jsx";
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
    path:"/blogs",
    element:<Layout />,
    children: [
      {
        path: '',
        element:<Blog/>
      }
    ]
  },
  {
    path:"/blogs/new",
    element:<NewBlog/>
  },
  {
    path:"/blogs/:id",
    element:<BlogDetails/>
  },
  {
    path:"/blogs/my",
    element:<Layout />,
    children: [
      {
        path: '',
        element:<MyBlogs/>
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
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Faq />
      }
    ]
  },
  {
    path: '/History',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <SendHistory />
      }
    ]
  },
  {
    path: '/forgotPassword',
    element: <ForgotPassword />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </StrictMode>
);
