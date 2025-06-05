import { createBrowserRouter, redirect } from "react-router";
import NotFound from "./pages/NotFound";
import Tasks from "./pages/Tasks";
import TasksOverview from "./pages/TasksOverview";
import TaskDashboard from "./pages/TasksDashboard";
import Notifications from "./pages/Notifications";
const router = createBrowserRouter(
  [
    {
      path: "/",
      loader: () => redirect("/tasks"),
      ErrorBoundary: NotFound,
    },
    {
      path: "/tasks",
      Component: Tasks,
      ErrorBoundary: NotFound,
      children: [
        { index: true, Component: TasksOverview },
        {
          path: ":id",
          Component: TaskDashboard,
        },
      ],
    },
    {
      path: "/notifications",
      Component: Notifications,
      ErrorBoundary: NotFound,
    },
  ],
  {
    basename: "/bbp-tools",
  }
);

export default router;
