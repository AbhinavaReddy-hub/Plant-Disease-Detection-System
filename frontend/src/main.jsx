import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Layout from './Layout.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import Setting from "./components/Settings/Setting.jsx";
import Analysis from "./components/Analysis.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
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
  {
    path: '/insights',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Analysis />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(

    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
 
);
