import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Tasks from "./pages/Tasks";
import TasksOverview from "./pages/TasksOverview";
import TaskDashboard from "./pages/TasksDashboard";

const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Home,
      ErrorBoundary: NotFound,
    },
    {
      path: "/tasks",
      Component: Tasks,
      // ErrorBoundary: NotFound,
      children: [
        { index: true, Component: TasksOverview },
        {
          path: ":id",
          Component: TaskDashboard,
        },
      ],
    },
  ],
  {
    basename: "/bbp-tools",
  }
);

export default router;
