import type { ReactElement } from "react";
import { Suspense, lazy } from "react";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { getIsAuthenticated } from "@/features/auth/utils/authState";

function RootRedirect(): ReactElement {
  return <Navigate to={getIsAuthenticated() ? "/blogs" : "/login"} replace />;
}

const HomePage = lazy(() =>
  import("@/features/home/pages/HomePage").then((m) => ({
    default: m.HomePage,
  })),
);

const ProfilePage = lazy(() =>
  import("@/features/profile/pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);

const CreateBlogPage = lazy(() =>
  import("@/features/blog/pages/CreateBlogPage").then((module) => ({
    default: module.CreateBlogPage,
  })),
);

function ProtectedBlogsPage(): ReactElement {
  return (
    <ProtectedRoute isAuthenticated={getIsAuthenticated()}>
      <HomePage />
    </ProtectedRoute>
  );
}

function ProtectedProfilePage(): ReactElement {
  return (
    <ProtectedRoute isAuthenticated={getIsAuthenticated()}>
      <ProfilePage />
    </ProtectedRoute>
  );
}

function ProtectedCreateBlogPage(): ReactElement {
  return (
    <ProtectedRoute isAuthenticated={getIsAuthenticated()}>
      <CreateBlogPage />
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootRedirect,
  },
  {
    path: "/blogs",
    Component: ProtectedBlogsPage,
  },
  {
    path: "/blogs/create",
    Component: ProtectedCreateBlogPage,
  },
  {
    path: "/profile",
    Component: ProtectedProfilePage,
  },
  {
    path: "/login",
    lazy: async () => {
      const module = await import("@/features/auth/pages/LoginPage");
      return { Component: module.LoginPage };
    },
  },
  {
    path: "/signup",
    lazy: async () => {
      const module = await import("@/features/auth/pages/SignupPage");
      return { Component: module.SignupPage };
    },
  },
]);

export function AppRouter() {
  return (
    <Suspense
      fallback={<div className="p-6 text-center text-gray-600">Loading page...</div>}
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
