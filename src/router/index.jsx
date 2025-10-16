import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Root from "@/layouts/Root";
import { getRouteConfig } from "@/router/route.utils";
import Layout from "@/components/organisms/Layout";

const Pipeline = lazy(() => import("@/components/pages/Pipeline"));
const Contacts = lazy(() => import("@/components/pages/Contacts"));
const Analytics = lazy(() => import("@/components/pages/Analytics"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const Login = lazy(() => import("@/components/pages/Login"));
const Signup = lazy(() => import("@/components/pages/Signup"));
const Callback = lazy(() => import("@/components/pages/Callback"));
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"));

const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<div>Loading.....</div>}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

const authRoutes = [
  createRoute({ path: "login", element: <Login /> }),
  createRoute({ path: "signup", element: <Signup /> }),
  createRoute({ path: "callback", element: <Callback /> }),
  createRoute({ path: "error", element: <ErrorPage /> }),
  createRoute({ path: "reset-password/:appId/:fields", element: <ResetPassword /> }),
  createRoute({ path: "prompt-password/:appId/:emailAddress/:provider", element: <PromptPassword /> }),
];

const mainRoutes = [
  createRoute({ path: "", index: true, element: <Pipeline /> }),
  createRoute({ path: "contacts", element: <Contacts /> }),
  createRoute({ path: "analytics", element: <Analytics /> }),
  createRoute({ path: "*", element: <NotFound /> }),
];

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      ...authRoutes,
      {
        path: "/",
        element: <Layout />,
        children: mainRoutes
      }
    ]
  }
];

export const router = createBrowserRouter(routes);