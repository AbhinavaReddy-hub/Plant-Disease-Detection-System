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
    element:<NewPost/>
  },
  {
    path:"/blogs/:id",
    element:<PostDetails/>
  },
  {
    path:"/blogs/my",
    element:<Layout />,
    children: [
      {
        path: '',
        element:<Myblog/>
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
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </StrictMode>
);
