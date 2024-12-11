// // import { StrictMode } from 'react';
// // import { createRoot } from 'react-dom/client';
// // import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
// // import HomePage from './pages/homepage/homepage/HomePage.jsx';
// // import './globals.css';
// // import NavBar from './pages/navbar/NavBar.jsx';
// // import Footer from './pages/footer/Footer.jsx';
// // import Login from './pages/Login/Login.jsx';
// // import Signup from './pages/SignUp/SignUp.jsx';
// // import Diagnosis from './pages/diagnosis/Diagnosis.jsx';
// // import Insights from './pages/insights/Analysis.jsx';
// // import SendHistory from './pages/history/SendHistory.jsx';
// // import { DarkModeProvider } from './pages/history/DarkModeContext.jsx';
// // import Blog from './pages/Blogs/Blog.jsx';
// // import NewPost from './pages/Blogs/NewPost.jsx';
// // import BlogDetail from './pages/Blogs/PostDetails.jsx';
// // import Myblog from "./pages/Blogs/myposts.jsx";
// // import EditPost from "./pages/Blogs/EditPost.jsx";
// // import AgricultureDashboard from "./pages/WorkSpace/WorkSpace.jsx";
// // import CaseList from './pages/cases/CaseList.jsx';
// // import Solve  from './pages/solve/SDiagnosisPage.jsx';
// // // frontend/src/pages/solve/SDiagnosisPage.jsx
// // import NotifDetails from './pages/navbar/notifDetails/notifDetails.jsx';
// // // Import Notification component

// // const Layout = () => (
// //   <>
// //     <NavBar />
// //     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
// //       <div style={{ flex: 1, marginTop: '60px' }}>
// //         <Outlet />
// //       </div>
// //       <Footer />
// //     </div>
// //   </>
// // );

// // const router = createBrowserRouter([
// //   {
// //     path: '/home',
// //     element: <Layout />,
// //     children: [{ path: '', element: <HomePage /> }]
// //   },
// //   { path: '/', element: <Login /> },
// //   { path: '/signup', element: <Signup /> },
// //   {
// //     path: '/diagnose',
// //     element: <Layout />,
// //     children: [{ path: '', element: <Diagnosis /> }]
// //   },
// //   {
// //     path: '/insights',
// //     element: <Layout />,
// //     children: [{ path: '', element: <Insights /> }]
// //   },
// //   {
// //     path: '/history',
// //     element: <Layout />,
// //     children: [{ path: '', element: <SendHistory /> }]
// //   },
// //   {
// //     path: '/notifications', // Route for notifications
// //     element: <NotifDetails userId={123} isVisible={true} /> // Replace 123 with dynamic user ID
// //   },
// //   {
// //     path:"/blogs",
// //     element:<Layout />,
// //     children: [
// //       {
// //         path: '',
// //         element:<Blog/>
// //       }
// //     ]
// //   },
// //   {
// //     path:"/blogs/new",
// //     element:<Layout />,
// //     children: [
// //       {
// //         path: '',
// //         element:<NewPost/>
// //       }
// //     ]
// //   },
// //   {
// //     path:"/blogs/:id",

// //     element:<Layout />,
// //     children: [
// //       {
// //         path: '',
// //         element:<BlogDetail/>
// //       }
// //     ]
// //   },
// //   {
// //     path:"/blogs/my",
// //     element:<Layout />,
// //     children: [
// //       {
// //         path: '',
// //         element:<Myblog/>
// //       }
// //     ]
// //   },
// //   {
// //     path: '/',
// //     element: <Login />,
// //   },
// //   {
// //     path:'/blogs/edit/:id',
// //     element: <Layout />,
// //      children: [
// //        {
// //          path: '',
// //          element: <EditPost />
// //        }
// //      ]

// //    },
// //    {
// //     path:'/workspace',
// //     element: <Layout />,
// //      children: [
// //        {
// //          path: '',
// //          element: <AgricultureDashboard />
// //        }
// //      ]

// //    },
// //    {
// //      path: '/cases',
// //      element: <Layout />,
// //      children: [{ path: '', element: <CaseList /> }]
// //    },
// //    {
// //     path: '/solve',
// //     element: <Layout />,
// //     children: [{ path: '', element: <Solve /> }]
// //   },
// // ]);

// // createRoot(document.getElementById('root')).render(
// //   <StrictMode>
// //     <DarkModeProvider>
// //       <RouterProvider router={router} />
// //     </DarkModeProvider>
// //   </StrictMode>
// // );
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { createBrowserRouter, RouterProvider, Outlet , Navigate} from 'react-router-dom';
// import HomePage from './pages/homepage/homepage/HomePage.jsx';
// import './globals.css';
// import NavBar from './pages/navbar/NavBar.jsx';
// import Footer from './pages/footer/Footer.jsx';
// import Login from './pages/Login/Login.jsx';
// import Signup from './pages/SignUp/SignUp.jsx';
// import Diagnosis from './pages/diagnosis/Diagnosis.jsx';
// import Insights from './pages/insights/Analysis.jsx';
// import SendHistory from './pages/history/SendHistory.jsx';
// import { DarkModeProvider } from './pages/history/DarkModeContext.jsx';
// import Blog from './pages/Blogs/Blog.jsx';
// import NewPost from './pages/Blogs/NewPost.jsx';
// import BlogDetail from './pages/Blogs/PostDetails.jsx';
// import Myblog from './pages/Blogs/myposts.jsx';
// import EditPost from './pages/Blogs/EditPost.jsx';
// import AgricultureDashboard from './pages/WorkSpace/WorkSpace.jsx';
// import CaseList from './pages/cases/CaseList.jsx';
// import Solve from './pages/solve/SDiagnosisPage.jsx';
// import NotifDetails from './pages/navbar/notifDetails/notifDetails.jsx';
// import ProtectedRoute from '../components/ProtectedRoute';

// const Layout = () => (
//   <>
//     <NavBar />
//     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <div style={{ flex: 1, marginTop: '60px' }}>
//         <Outlet />
//       </div>
//       <Footer />
//     </div>
//   </>
// );

// const router = createBrowserRouter([
//   {
//     path: '/home',
//     element: <Layout />,
//     children: [{ path: '', element: <HomePage /> }],
//   },
//   { path: '/', element: <Login /> },
//   { path: '/signup', element: <Signup /> },
//   {
//     path: '/diagnose',
//     element: <Layout />,
//     children: [{ path: '', element: <Diagnosis /> }],
//   },
//   {
//     path: '/insights',
//     element: <Layout />,
//     children: [{ path: '', element: <Insights /> }],
//   },
//   {
//     path: '/history',
//     element: <Layout />,
//     children: [{ path: '', element: <SendHistory /> }],
//   },
//   {
//     path: '/notifications',
//     element: (
//       <Layout>
//         <NotifDetails userId={123} isVisible={true} /> {/* Replace 123 with actual user ID */}
//       </Layout>
//     ),
//   },
//   {
//     path: '/blogs',
//     element: <Layout />,
//     children: [{ path: '', element: <Blog /> }],
//   },
//   {
//     path: '/blogs/new',
//     element: <Layout />,
//     children: [{ path: '', element: <NewPost /> }],
//   },
//   {
//     path: '/blogs/:id',
//     element: <Layout />,
//     children: [{ path: '', element: <BlogDetail /> }],
//   },
//   {
//     path: '/blogs/my',
//     element: <Layout />,
//     children: [{ path: '', element: <Myblog /> }],
//   },
//   {
//     path: '/blogs/edit/:id',
//     element: <Layout />,
//     children: [{ path: '', element: <EditPost /> }],
//   },
//   {
//     path: '/workspace',
//     element: <Layout />,
//     children: [{ path: '', element: <AgricultureDashboard /> }],
//   },
//   {
//     path: '/cases',
//     element: <Layout />,
//     children: [{ path: '', element: <CaseList /> }],
//   },
//   {
//     path: '/solve/:caseId',
//     element: <Layout />,
//     children: [{ path: '', element: <Solve /> }],
//   },
// ]);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <DarkModeProvider>
//       <RouterProvider router={router} />
//     </DarkModeProvider>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/homepage/homepage/HomePage.jsx";
import NavBar from "./pages/navbar/NavBar.jsx";
import Footer from "./pages/footer/Footer.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/SignUp/SignUp.jsx";
import Diagnosis from "./pages/diagnosis/Diagnosis.jsx";
import Insights from "./pages/insights/Analysis.jsx";
import SendHistory from "./pages/history/SendHistory.jsx";
import Blog from "./pages/Blogs/Blog.jsx";
import NewPost from "./pages/Blogs/NewPost.jsx";
import BlogDetail from "./pages/Blogs/PostDetails.jsx";
import Myblog from "./pages/Blogs/myposts.jsx";
import EditPost from "./pages/Blogs/EditPost.jsx";
import AgricultureDashboard from "./pages/WorkSpace/WorkSpace.jsx";
import CaseList from "./pages/cases/CaseList.jsx";
import Solve from "./pages/solve/SDiagnosisPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute";
import { DarkModeProvider } from "./DarkModeContext.jsx";
import Layout from "./Layout.jsx";
import "./globals.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Navigate to={localStorage.getItem("authToken") ? "/home" : "/login"} />
    ),
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <HomePage /> }],
  },
  {
    path: "/diagnose",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <Diagnosis /> }],
  },
  {
    path: "/insights",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <Insights /> }],
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <SendHistory /> }],
  },
  {
    path: "/blogs",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <Blog /> }],
  },
  {
    path: "/blogs/new",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <NewPost /> }],
  },
  {
    path: "/blogs/:id",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <BlogDetail /> }],
  },
  {
    path: "/blogs/my",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <Myblog /> }],
  },
  {
    path: "/blogs/edit/:id",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <EditPost /> }],
  },
  {
    path: "/workspace",
    element: (
      <ProtectedRoute isAdminOnly={true}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <AgricultureDashboard /> }],
  },
  {
    path: "/cases",
    element: (
      <ProtectedRoute isAdminOnly={true}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <CaseList /> }],
  },
  {
    path: "/solve/:caseId",
    element: (
      <ProtectedRoute isAdminOnly={true}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <Solve /> }],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </StrictMode>
);
