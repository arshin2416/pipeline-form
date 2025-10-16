import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load pages
const Pipeline = lazy(() => import("@/components/pages/Pipeline"));
const Contacts = lazy(() => import("@/components/pages/Contacts"));
const Analytics = lazy(() => import("@/components/pages/Analytics"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Pipeline />
      </Suspense>
    )
  },
  {
    path: "contacts",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Contacts />
      </Suspense>
    )
  },
  {
    path: "analytics", 
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Analytics />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);