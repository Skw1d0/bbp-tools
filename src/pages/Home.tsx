import { Stack } from "@mui/material";
import AppbarComponent from "../components/AppbarComponent";
import TasksComponent from "../components/TasksComponent";
import NotificationListComponent from "../components/NotificationListComponent";

export default function Home() {
  const appbarLinks = [
    { label: "Aufgaben", path: "/tasks" },
    { label: "Benachrichtigungen", path: "/notifications" },
  ];

  return (
    <div>
      <AppbarComponent links={appbarLinks} />
      <Stack direction="column" spacing={1} margin={1}>
        <NotificationListComponent mode="preview" />
        <TasksComponent mode="preview" />
      </Stack>
    </div>
  );
}
