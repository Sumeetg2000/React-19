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

// lazy at module scope ensures route chunks are stable and only loaded on navigation.
const HomePage = lazy(() =>
  import("@/features/home/pages/HomePage").then((m) => ({
    default: m.HomePage,
  })),
);

// lazy at module scope avoids recreating lazy components during re-renders.
const ProfilePage = lazy(() =>
  import("@/features/profile/pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);

// lazy at module scope keeps code splitting predictable and StrictMode-safe.
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
    // Suspense at route boundary gives progressive loading for lazy route chunks.
    <Suspense
      fallback={<div className="p-6 text-center text-gray-600">Loading page...</div>}
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
