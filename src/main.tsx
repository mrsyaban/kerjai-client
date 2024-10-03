import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./pages/home";
import AuthPage from "./pages/auth";
import ResumeGrader from "./pages/resume-grader";
import BehavioralInterviewPage from "./pages/interview-analyzer/behavioral/recorder";
import TechnicalInterviewPage from "./pages/interview-analyzer/technical/recorder";
import Dashboard from "./pages/dashboard";
import BehavioralInterviewResult from "./pages/interview-analyzer/behavioral/result";
import TechnicalInterviewResult from "./pages/interview-analyzer/technical/result";

const router = createBrowserRouter([
  {
    path: "",
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "resume-grader",
        children: [
          {
            path: "",
            element: <ResumeGrader />,
          },
        ],
      },
      {
        path: "interview-analyzer",
        children: [
          {
            path: "behavioral",
            children: [
              {
                path: "",
                element: <BehavioralInterviewPage />,
              },
              {
                path: "result/:id",
                element: <BehavioralInterviewResult />,
              },
            ],
          },
          {
            path: "technical",
            children: [
              {
                path: "",
                element: <TechnicalInterviewPage />,
              },
              {
                path: "result",
                element: <TechnicalInterviewResult/>,
              },
            ],
          },
        ],
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "*",
        element: <div>Not Found</div>,
      },
    ],
    errorElement: <div>Error</div>,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_CLIENT_ID}`}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
