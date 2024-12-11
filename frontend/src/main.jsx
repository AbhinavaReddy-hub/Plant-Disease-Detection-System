import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/homepage/homepage/HomePage.jsx";
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
import Faq from './pages/faq_feedback/Faq.jsx';
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
    path: "/faq",
    element: (
      <ProtectedRoute requiredUserType="normal">
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <Faq /> }],
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
