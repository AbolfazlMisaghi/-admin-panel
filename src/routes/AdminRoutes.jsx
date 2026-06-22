import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import AdminLayout from "../features/admin/Layout";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/dashboard/pages/Dashboard";
import TeamList from "../features/team/pages/TeamList";
import TeamForm from "../features/team/pages/TeamForm";
import ProductList from "../features/products/pages/ProductList";
import ProductForm from "../features/products/pages/ProductForm";
import ArticleList from "../features/articles/pages/ArticleList";
import ArticleForm from "../features/articles/pages/ArticleForm";
import Settings from "../features/settings/pages/Settings";

export const adminRouter = createBrowserRouter([
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "team", element: <TeamList /> },
      { path: "team/new", element: <TeamForm /> },
      { path: "team/:id/edit", element: <TeamForm /> },
      { path: "products", element: <ProductList /> },
      { path: "products/new", element: <ProductForm /> },
      { path: "products/:id/edit", element: <ProductForm /> },
      { path: "articles", element: <ArticleList /> },
      { path: "articles/new", element: <ArticleForm /> },
      { path: "articles/:id/edit", element: <ArticleForm /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/admin" replace />,
  },
]);
